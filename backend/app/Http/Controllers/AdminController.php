<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Setting;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
        if ($testimonial->photo) {
            Storage::disk('public')->delete($testimonial->photo);
        }
        $testimonial->update(['is_active' => false, 'photo' => null]);

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

    public function batch(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|string|in:takedown,restore,priority',
            'ids' => 'required|array|max:50',
            'ids.*' => 'integer|exists:testimonials,id',
            'is_priority' => 'boolean|required_if:action,priority',
        ]);

        $query = Testimonial::whereIn('id', $validated['ids']);
        $count = 0;

        if ($validated['action'] === 'takedown') {
            $testimonials = $query->get();
            foreach ($testimonials as $t) {
                if ($t->photo) {
                    Storage::disk('public')->delete($t->photo);
                }
                $t->update(['is_active' => false, 'photo' => null]);
                $count++;
            }
        } elseif ($validated['action'] === 'restore') {
            $count = $query->update(['is_active' => true]);
        } elseif ($validated['action'] === 'priority') {
            $isPriority = $validated['is_priority'] ?? true;
            $testimonials = $query->get();
            foreach ($testimonials as $t) {
                if ($isPriority) {
                    $already = Testimonial::where('event_id', $t->event_id)
                        ->where('is_priority', true)->count();
                    if ($already >= 10) continue;
                }
                $t->update(['is_priority' => $isPriority]);
                $count++;
            }
        }

        return response()->json([
            'message' => "{$count} testimonial berhasil diproses",
            'count' => $count,
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
