<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Testimonial extends Model
{
    protected $fillable = [
        'event_id', 'name', 'phone_email', 'relationship', 'testimonial', 'photo', 'is_active', 'is_priority'
    ];

    protected $appends = ['photo_url'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_priority' => 'boolean',
        ];
    }

    public function getPhotoUrlAttribute(): ?string
    {
        if (!$this->photo) return null;
        return url('storage/' . $this->photo);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
