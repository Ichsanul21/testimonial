<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('new_item_animation', 20)->default('pop-up')->after('animation_out');
            $table->unsignedTinyInteger('new_item_duration')->default(4)->after('new_item_animation');
            $table->string('poll_interval', 20)->default('realtime')->after('new_item_duration');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['new_item_animation', 'new_item_duration', 'poll_interval']);
        });
    }
};
