<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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
        if ($testimonial->photo) {
            Storage::disk('public')->delete($testimonial->photo);
        }
        $testimonial->update(['is_active' => false, 'photo' => null]);

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

    public function batch(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|string|in:takedown,restore,priority',
            'ids' => 'required|array|max:50',
            'ids.*' => 'integer|exists:testimonials,id',
            'is_priority' => 'boolean|required_if:action,priority',
        ]);

        $eventIds = $request->user()->events()->pluck('events.id');
        $query = Testimonial::whereIn('testimonials.id', $validated['ids'])
            ->whereIn('event_id', $eventIds);
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
            $ids = $query->pluck('id');
            $count = Testimonial::whereIn('id', $ids)->update(['is_active' => true]);
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

    public function getDisplaySettings(Request $request, int $id)
    {
        $event = $request->user()->events()->findOrFail($id);
        return response()->json([
            'display_name' => $event->display_name,
            'display_logo_url' => $event->display_logo_url,
            'background_type' => $event->background_type,
            'background_value' => $event->background_value,
            'animation_movement' => $event->animation_movement,
            'animation_in' => $event->animation_in,
            'animation_out' => $event->animation_out,
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

    public function updateDisplaySettings(Request $request, int $id)
    {
        $event = $request->user()->events()->findOrFail($id);

        $validated = $request->validate([
            'display_name' => 'nullable|string|max:255',
            'background_type' => 'required|string|in:theme,color,gradient,image',
            'background_value' => 'nullable|string|max:2000',
            'animation_movement' => 'required|string|in:scroll-left,scroll-right,alternating,float,carousel',
            'animation_in' => 'required|string|in:fade,scale,slide',
            'animation_out' => 'required|string|in:fade,scale,slide',
            'new_item_animation' => 'sometimes|string|in:pop-up,slide-in,glow,bounce,flip,none',
            'new_item_duration' => 'sometimes|integer|min:2|max:8',
            'poll_interval' => 'sometimes|string|in:realtime,normal',
            'animation_movement_extra' => 'nullable|string|in:bounce,waterfall,v-scroll,random,wave',
            'animation_in_extra' => 'nullable|string|in:zoom,flip,rotate,blur',
            'animation_out_extra' => 'nullable|string|in:zoom,flip,rotate,blur',
            'new_item_animation_extra' => 'nullable|string|in:typewriter,spin,expand',
            'title_font' => 'sometimes|string|in:playfair,inter,montserrat,poppins,lora,dancing-script,great-vibes,roboto',
            'title_size' => 'sometimes|string|in:sm,md,lg,xl',
            'banner_style' => 'sometimes|string|in:glass,solid,gradient',
            'banner_position' => 'sometimes|string|in:top,top-center,center',
            'card_radius' => 'sometimes|string|in:sm,md,lg,xl,2xl,full',
            'card_style' => 'sometimes|string|in:glass,solid,bordered,elevated',
            'card_text_color' => 'sometimes|string|in:light,dark',
            'text_align' => 'sometimes|string|in:left,center,right',
            'show_photo' => 'sometimes|boolean',
            'show_quote' => 'sometimes|boolean',
            'scroll_speed' => 'sometimes|string|in:slow,normal,fast',
            'show_date' => 'sometimes|boolean',
            'show_relationship' => 'sometimes|boolean',
            'card_gap' => 'sometimes|string|in:sm,md,lg',
            'visible_rows' => 'sometimes|integer|min:2|max:5',
            'pause_on_hover' => 'sometimes|boolean',
            'photo_shape' => 'sometimes|string|in:circle,rounded,square',
            'card_backdrop_blur' => 'sometimes|string|in:none,sm,md,lg',
            'card_overlay_opacity' => 'nullable|integer|min:0|max:100',
        ]);

        $event->update($validated);

        return response()->json([
            'message' => 'Display settings berhasil disimpan',
            'data' => [
                'display_name' => $event->fresh()->display_name,
                'display_logo_url' => $event->fresh()->display_logo_url,
                'background_type' => $event->fresh()->background_type,
                'background_value' => $event->fresh()->background_value,
                'animation_movement' => $event->fresh()->animation_movement,
                'animation_in' => $event->fresh()->animation_in,
                'animation_out' => $event->fresh()->animation_out,
                'new_item_animation' => $event->fresh()->new_item_animation,
                'new_item_duration' => (int) $event->fresh()->new_item_duration,
                'poll_interval' => $event->fresh()->poll_interval,
                'animation_movement_extra' => $event->fresh()->animation_movement_extra,
                'animation_in_extra' => $event->fresh()->animation_in_extra,
                'animation_out_extra' => $event->fresh()->animation_out_extra,
                'new_item_animation_extra' => $event->fresh()->new_item_animation_extra,
                'title_font' => $event->fresh()->title_font ?? 'playfair',
                'title_size' => $event->fresh()->title_size ?? 'lg',
                'banner_style' => $event->fresh()->banner_style ?? 'glass',
                'banner_position' => $event->fresh()->banner_position ?? 'top',
                'card_radius' => $event->fresh()->card_radius ?? 'md',
                'card_style' => $event->fresh()->card_style ?? 'glass',
                'card_text_color' => $event->fresh()->card_text_color ?? 'light',
                'text_align' => $event->fresh()->text_align ?? 'left',
                'show_photo' => (bool) ($event->fresh()->show_photo ?? true),
                'show_quote' => (bool) ($event->fresh()->show_quote ?? false),
                'scroll_speed' => $event->fresh()->scroll_speed ?? 'normal',
                'show_date' => (bool) ($event->fresh()->show_date ?? true),
                'show_relationship' => (bool) ($event->fresh()->show_relationship ?? true),
                'card_gap' => $event->fresh()->card_gap ?? 'md',
                'visible_rows' => (int) ($event->fresh()->visible_rows ?? 3),
                'pause_on_hover' => (bool) ($event->fresh()->pause_on_hover ?? false),
                'photo_shape' => $event->fresh()->photo_shape ?? 'rounded',
                'card_backdrop_blur' => $event->fresh()->card_backdrop_blur ?? 'md',
                'card_overlay_opacity' => $event->fresh()->card_overlay_opacity ?? 88,
            ],
        ]);
    }

    public function uploadLogo(Request $request, int $id)
    {
        $event = $request->user()->events()->findOrFail($id);

        $request->validate([
            'logo' => 'required|image|mimes:png,jpg,jpeg,svg,webp|max:2048',
        ]);

        if ($event->display_logo) {
            Storage::disk('public')->delete($event->display_logo);
        }

        $path = $request->file('logo')->store('logos', 'public');
        $event->update(['display_logo' => $path]);

        return response()->json([
            'message' => 'Logo berhasil diupload',
            'display_logo_url' => $event->fresh()->display_logo_url,
        ]);
    }

    public function uploadBackground(Request $request, int $id)
    {
        $event = $request->user()->events()->findOrFail($id);

        $request->validate([
            'background' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($event->background_type === 'image' && $event->background_value) {
            $oldPath = str_replace(url('storage/'), '', $event->background_value);
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('background')->store('backgrounds', 'public');

        $event->update([
            'background_type' => 'image',
            'background_value' => url('storage/' . $path),
        ]);

        return response()->json([
            'message' => 'Background berhasil diupload',
            'background_value' => $event->fresh()->background_value,
        ]);
    }
}
