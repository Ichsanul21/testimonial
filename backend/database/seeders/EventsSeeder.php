<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventsSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            [
                'name' => 'Pernikahan Sarah & Adi',
                'slug' => 'pernikahan-sarah-adi',
                'description' => 'Pernikahan putri pertama kami. Terima kasih atas doa dan kehadiran para tamu undangan.',
                'date' => '2026-06-20',
                'location' => 'Gedung Serbaguna, Jakarta',
                'icon' => '💍',
                'color' => '#ec4899',
            ],
            [
                'name' => 'Seminar Teknologi AI 2026',
                'slug' => 'seminar-ai-2026',
                'description' => 'Seminar nasional tentang perkembangan Artificial Intelligence di Indonesia.',
                'date' => '2026-07-15',
                'location' => 'Convention Hall, Bandung',
                'icon' => '🤖',
                'color' => '#3b82f6',
            ],
            [
                'name' => 'Gathering Keluarga Besar',
                'slug' => 'gathering-keluarga-besar',
                'description' => 'Acara tahunan keluarga besar dalam rangka silaturahmi dan kebersamaan.',
                'date' => '2026-08-01',
                'location' => 'Taman Wisata, Bogor',
                'icon' => '🎉',
                'color' => '#f59e0b',
            ],
        ];

        foreach ($events as $data) {
            Event::create([
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => $data['description'],
                'date' => $data['date'],
                'location' => $data['location'],
                'icon' => $data['icon'],
                'color' => $data['color'],
                'qr_hash' => Str::random(32),
                'is_active' => true,
            ]);
        }

        $this->command->info('3 events created!');
    }
}
