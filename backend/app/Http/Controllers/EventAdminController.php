<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventAdminController extends Controller
{
    public function events(Request $request)
    {
        $events = $request->user()->events()
            ->withCount('testimonials')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $events]);
    }

    public function show(Request $request, int $id)
    {
        $event = $request->user()->events()
            ->withCount('testimonials')
            ->findOrFail($id);

        $stats = [
            'total' => Testimonial::where('event_id', $id)->count(),
            'active' => Testimonial::where('event_id', $id)->where('is_active', true)->count(),
            'takedown' => Testimonial::where('event_id', $id)->where('is_active', false)->count(),
        ];

        return response()->json([
            'event' => $event,
            'stats' => $stats,
        ]);
    }

    public function refreshQR(Request $request, int $id)
    {
        $event = $request->user()->events()->findOrFail($id);

        $event->update(['qr_hash' => Str::random(32)]);

        return response()->json([
            'message' => 'QR code berhasil direfresh',
            'qr_hash' => $event->fresh()->qr_hash,
            'qr_content_url' => $event->fresh()->qr_content_url,
        ]);
    }

    public function testimonials(Request $request)
    {
        $eventIds = $request->user()->events()->pluck('events.id');

        $query = Testimonial::whereIn('event_id', $eventIds);

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('testimonial', 'like', "%{$search}%");
            });
        }

        if ($eventId = $request->event_id) {
            if (!in_array($eventId, $eventIds->toArray())) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
            $query->where('event_id', $eventId);
        }

        $sortDir = $request->sort === 'oldest' ? 'asc' : 'desc';
        $query->orderBy('created_at', $sortDir);

        return response()->json($query->paginate(20));
    }

    public function takedown(Request $request, int $id)
    {
        $eventIds = $request->user()->events()->pluck('events.id');

        $testimonial = Testimonial::whereIn('event_id', $eventIds)->findOrFail($id);
        $testimonial->update(['is_active' => false]);

        return response()->json(['message' => 'Testimonial berhasil ditakedown']);
    }

    public function restore(Request $request, int $id)
    {
        $eventIds = $request->user()->events()->pluck('events.id');

        $testimonial = Testimonial::whereIn('event_id', $eventIds)->findOrFail($id);
        $testimonial->update(['is_active' => true]);

        return response()->json(['message' => 'Testimonial berhasil direstore']);
    }

    public function updateBannedWords(Request $request, int $id)
    {
        $event = $request->user()->events()->findOrFail($id);

        $validated = $request->validate([
            'banned_words' => 'nullable|string|max:1000',
        ]);

        $event->update(['banned_words' => $validated['banned_words'] ?? null]);

        return response()->json([
            'message' => 'Kata terlarang berhasil diperbarui',
            'banned_words' => $event->fresh()->banned_words,
        ]);
    }

    public function setPriority(Request $request, int $id)
    {
        $request->validate([
            'is_priority' => 'required|boolean',
        ]);

        $eventIds = $request->user()->events()->pluck('events.id');

        $testimonial = Testimonial::whereIn('event_id', $eventIds)->findOrFail($id);

        if ($request->is_priority) {
            $alreadyPriority = Testimonial::where('event_id', $testimonial->event_id)
                ->where('is_priority', true)->count();
            if ($alreadyPriority >= 10) {
                return response()->json([
                    'message' => 'Maksimal 10 testimonial prioritas per acara'
                ], 422);
            }
        }

        $testimonial->update(['is_priority' => $request->is_priority]);

        return response()->json([
            'message' => $request->is_priority
                ? 'Testimonial diprioritaskan'
                : 'Prioritas testimonial dicopot',
            'is_priority' => $request->is_priority,
        ]);
    }
}
