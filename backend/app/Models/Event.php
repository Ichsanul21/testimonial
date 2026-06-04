<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Event extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'date', 'location',
        'icon', 'color', 'qr_hash', 'is_active', 'banned_words',
    ];

    protected $appends = ['qr_content_url'];

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

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }

    public function admins()
    {
        return $this->belongsToMany(User::class, 'event_user');
    }
}
