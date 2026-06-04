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
            'photo' => 'required|image|max:5120',
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

        $path = $request->file('photo')->store('photos', 'public');

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
}
