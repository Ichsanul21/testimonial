<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Setting;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TestimonialController extends Controller
{
    public function index()
    {
        $query = Testimonial::where('is_active', true);

        if (request('all')) {
            $testimonials = $query->latest()->get();
            $priority = Testimonial::where('is_active', true)
                ->where('is_priority', true)
                ->pluck('id');
            return response()->json([
                'data' => $testimonials,
                'priority_ids' => $priority,
            ]);
        }

        $testimonials = $query->latest()->paginate(20);
        return response()->json($testimonials);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|integer|exists:events,id',
            'name' => 'required|string|max:255',
            'phone_email' => 'nullable|string|max:255',
            'relationship' => 'required|string|in:Teman,Keluarga,Rekan Kerja,Lainnya',
            'testimonial' => 'required|string|max:1000',
            'photo' => 'nullable|image|max:5120',
        ]);

        $event = Event::find($validated['event_id']);
        $bannedWords = $event?->banned_words ?? '';
        if ($bannedWords) {
            $words = array_map('trim', explode(',', $bannedWords));
            foreach (['name', 'testimonial'] as $field) {
                foreach ($words as $word) {
                    if ($word !== '' && stripos($validated[$field], $word) !== false) {
                        return response()->json([
                            'message' => "Kata terlarang ditemukan: {$word}"
                        ], 422);
                    }
                }
            }
        }

        $path = $request->hasFile('photo')
            ? $request->file('photo')->store('photos', 'public')
            : null;

        if ($path) {
            $this->compressImage(Storage::disk('public')->path($path));
        }

        $autoApprove = Setting::getValue('auto_approve', 'true') === 'true';

        $testimonial = Testimonial::create([
            'event_id' => $validated['event_id'],
            'name' => $validated['name'],
            'phone_email' => $validated['phone_email'] ?? null,
            'relationship' => $validated['relationship'],
            'testimonial' => $validated['testimonial'],
            'photo' => $path,
            'is_active' => $autoApprove,
        ]);

        return response()->json($testimonial, 201);
    }

    private function compressImage(string $path, int $maxWidth = 1200, int $quality = 75): void
    {
        if (!file_exists($path)) {
            return;
        }

        // Frontend sudah kompres (file < 500KB) — skip
        if (filesize($path) <= 512000) {
            return;
        }

        $info = getimagesize($path);
        if (!$info) {
            return;
        }

        [$width, $height, $type] = $info;

        $image = match ($type) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($path),
            IMAGETYPE_PNG => @imagecreatefrompng($path),
            IMAGETYPE_WEBP => @imagecreatefromwebp($path),
            IMAGETYPE_GIF => @imagecreatefromgif($path),
            default => null,
        };

        if (!$image) {
            return;
        }

        if ($width > $maxWidth) {
            $newWidth = $maxWidth;
            $newHeight = (int) round($height * ($maxWidth / $width));
            $resized = imagescale($image, $newWidth, $newHeight, IMG_BILINEAR_FIXED);
            if ($resized !== false) {
                imagedestroy($image);
                $image = $resized;
            }
        }

        imagejpeg($image, $path, $quality);
        imagedestroy($image);
    }
}
