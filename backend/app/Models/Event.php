<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Event extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'date', 'location',
        'icon', 'color', 'qr_hash', 'is_active', 'banned_words',
        'display_name', 'display_logo',
        'background_type', 'background_value',
        'animation_movement', 'animation_in', 'animation_out',
        'new_item_animation', 'new_item_duration', 'poll_interval',
        'animation_movement_extra', 'animation_in_extra', 'animation_out_extra', 'new_item_animation_extra',
        'title_font', 'title_size', 'banner_style', 'banner_position',
        'card_radius', 'card_style', 'card_text_color', 'text_align',
        'show_photo', 'show_quote', 'scroll_speed',
        'show_date', 'show_relationship', 'card_gap', 'visible_rows',
        'pause_on_hover', 'photo_shape', 'card_backdrop_blur', 'card_overlay_opacity',
    ];

    protected $appends = ['qr_content_url', 'display_logo_url'];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Event $event) {
            if (!$event->slug) {
                $event->slug = Str::slug($event->name) . '-' . Str::random(4);
            }
            if (!$event->qr_hash) {
                $event->qr_hash = Str::random(32);
            }
        });
    }

    public function getQrContentUrlAttribute(): string
    {
        return url('/form?acara=' . $this->slug);
    }

    public function getDisplayLogoUrlAttribute(): ?string
    {
        if (!$this->display_logo) return null;
        return url('storage/' . $this->display_logo);
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }

    public function admins()
    {
        return $this->belongsToMany(User::class, 'event_user');
    }
}
