<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Testimonial;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::where('is_active', true)
            ->select('id', 'name', 'slug', 'description', 'date', 'location', 'icon', 'color')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json(['data' => $events]);
    }

    public function show(string $slug)
    {
        $event = Event::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'id' => $event->id,
            'name' => $event->name,
            'slug' => $event->slug,
            'description' => $event->description,
            'date' => $event->date?->format('Y-m-d'),
            'location' => $event->location,
            'icon' => $event->icon,
            'color' => $event->color,
            'qr_content_url' => $event->qr_content_url,
        ]);
    }

    public function displaySettings(string $slug)
    {
        $event = Event::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'display_name' => $event->display_name,
            'display_logo_url' => $event->display_logo_url,
            'background_type' => $event->background_type,
            'background_value' => $event->background_value,
            'animation_movement' => $event->animation_movement,
            'animation_in' => $event->animation_in,
            'animation_out' => $event->animation_out,
            'icon' => $event->icon,
            'name' => $event->name,
        ]);
    }

    public function testimonials(string $slug)
    {
        $event = Event::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $query = Testimonial::where('event_id', $event->id)
            ->where('is_active', true);

        if (request('all')) {
            $testimonials = $query->latest()->get();
            $priority = Testimonial::where('event_id', $event->id)
                ->where('is_active', true)
                ->where('is_priority', true)
                ->pluck('id');
            return response()->json([
                'data' => $testimonials,
                'priority_ids' => $priority,
            ]);
        }

        return response()->json($query->latest()->paginate(20));
    }
}
