<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('event_user')->truncate();
        User::truncate();
        Schema::enableForeignKeyConstraints();

        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@alk-tech.my.id',
            'password' => bcrypt('admin123'),
            'role' => 'super_admin',
        ]);

        $this->command->info('Super admin created: admin@alk-tech.my.id / admin123');

        $events = Event::all();

        if ($events->isEmpty()) {
            $this->command->warn('Tidak ada event, skip assign event admin.');
            return;
        }

        $eventNames = [
            'Admin Pernikahan',
            'Admin Seminar',
            'Admin Gathering',
        ];

        foreach ($events as $i => $event) {
            $name = $eventNames[$i] ?? 'Event Admin ' . ($i + 1);
            $slugPart = explode('-', $event->slug)[0];
            $email = $slugPart . '@alk-tech.my.id';

            $admin = User::create([
                'name' => $name,
                'email' => $email,
                'password' => bcrypt('admin123'),
                'role' => 'event_admin',
            ]);

            $admin->events()->attach($event->id);

            $this->command->info("Event admin created: {$email} / admin123 -> {$event->name}");
        }
    }
}
