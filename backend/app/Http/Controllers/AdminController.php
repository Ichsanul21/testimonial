<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Setting;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function testimonials(Request $request)
    {
        $query = Testimonial::query();

        if ($eventId = $request->event_id) {
            $query->where('event_id', $eventId);
        }

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('testimonial', 'like', "%{$search}%");
            });
        }

        $sortDir = $request->sort === 'oldest' ? 'asc' : 'desc';
        $query->orderBy('created_at', $sortDir);

        $testimonials = $query->paginate(20);

        return response()->json($testimonials);
    }

    public function stats()
    {
        return response()->json([
            'total' => Testimonial::count(),
            'active' => Testimonial::where('is_active', true)->count(),
            'takedown' => Testimonial::where('is_active', false)->count(),
        ]);
    }

    public function takedown($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update(['is_active' => false]);

        return response()->json(['message' => 'Testimonial berhasil ditakedown']);
    }

    public function restore($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update(['is_active' => true]);

        return response()->json(['message' => 'Testimonial berhasil direstore']);
    }

    public function settings($key)
    {
        $value = Setting::getValue($key);
        return response()->json(['key' => $key, 'value' => $value]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'key' => 'required|string|max:50',
            'value' => 'required|string|max:255',
        ]);

        Setting::setValue($request->key, $request->value);

        return response()->json([
            'message' => 'Setting berhasil diupdate',
            'key' => $request->key,
            'value' => $request->value,
        ]);
    }

    public function setPriority(Request $request, $id)
    {
        $request->validate([
            'is_priority' => 'required|boolean',
        ]);

        $testimonial = Testimonial::findOrFail($id);

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

    public function submitters(Request $request)
    {
        $query = Testimonial::query()
            ->select('testimonials.id', 'testimonials.name', 'testimonials.phone_email', 'testimonials.relationship', 'testimonials.event_id', 'testimonials.created_at')
            ->join('events', 'events.id', '=', 'testimonials.event_id')
            ->addSelect('events.name as event_name');

        if ($eventId = $request->event_id) {
            $query->where('testimonials.event_id', $eventId);
        }

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('testimonials.name', 'like', "%{$search}%")
                  ->orWhere('testimonials.phone_email', 'like', "%{$search}%");
            });
        }

        $sortDir = $request->sort === 'oldest' ? 'asc' : 'desc';
        $query->orderBy('testimonials.created_at', $sortDir);

        return response()->json($query->paginate(20));
    }
}
