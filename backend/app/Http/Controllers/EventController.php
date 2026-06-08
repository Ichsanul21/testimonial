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
            'new_item_animation' => $event->new_item_animation,
            'new_item_duration' => (int) $event->new_item_duration,
            'poll_interval' => $event->poll_interval,
            'animation_movement_extra' => $event->animation_movement_extra,
            'animation_in_extra' => $event->animation_in_extra,
            'animation_out_extra' => $event->animation_out_extra,
            'new_item_animation_extra' => $event->new_item_animation_extra,
            'title_font' => $event->title_font ?? 'playfair',
            'title_size' => $event->title_size ?? 'lg',
            'banner_style' => $event->banner_style ?? 'glass',
            'banner_position' => $event->banner_position ?? 'top',
            'card_radius' => $event->card_radius ?? 'md',
            'card_style' => $event->card_style ?? 'glass',
            'card_text_color' => $event->card_text_color ?? 'light',
            'text_align' => $event->text_align ?? 'left',
            'show_photo' => (bool) ($event->show_photo ?? true),
            'show_quote' => (bool) ($event->show_quote ?? false),
            'scroll_speed' => $event->scroll_speed ?? 'normal',
            'show_date' => (bool) ($event->show_date ?? true),
            'show_relationship' => (bool) ($event->show_relationship ?? true),
            'card_gap' => $event->card_gap ?? 'md',
            'visible_rows' => (int) ($event->visible_rows ?? 3),
            'pause_on_hover' => (bool) ($event->pause_on_hover ?? false),
            'photo_shape' => $event->photo_shape ?? 'rounded',
            'card_backdrop_blur' => $event->card_backdrop_blur ?? 'md',
            'card_overlay_opacity' => $event->card_overlay_opacity ?? 88,
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

    public function streamTestimonials(string $slug)
    {
        $event = Event::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        set_time_limit(0);
        ini_set('output_buffering', 'off');
        ini_set('zlib.output_compression', false);

        while (ob_get_level() > 0) {
            ob_end_flush();
        }

        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');
        header('X-Accel-Buffering: no');

        $lastId = (int) ($_SERVER['HTTP_LAST_EVENT_ID'] ?? request('lastId', 0));

        while (true) {
            if (connection_aborted()) {
                break;
            }

            $new = Testimonial::where('event_id', $event->id)
                ->where('is_active', true)
                ->where('id', '>', $lastId)
                ->orderBy('id')
                ->get();

            if ($new->isNotEmpty()) {
                $lastId = $new->last()->id;
                echo "id: {$lastId}\n";
                echo "event: new-testimonials\n";
                echo 'data: ' . json_encode([
                    'testimonials' => $new,
                    'priority_ids' => Testimonial::where('event_id', $event->id)
                        ->where('is_active', true)
                        ->where('is_priority', true)
                        ->pluck('id'),
                ]) . "\n\n";
                ob_flush();
                flush();
            } else {
                echo ": keepalive\n\n";
                ob_flush();
                flush();
            }

            sleep(1);
        }
    }
}
