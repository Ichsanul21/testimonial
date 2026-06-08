<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->boolean('show_date')->default(true)->after('scroll_speed');
            $table->boolean('show_relationship')->default(true)->after('show_date');
            $table->string('card_gap', 10)->default('md')->after('show_relationship');
            $table->unsignedTinyInteger('visible_rows')->default(3)->after('card_gap');
            $table->boolean('pause_on_hover')->default(false)->after('visible_rows');
            $table->string('photo_shape', 10)->default('rounded')->after('pause_on_hover');
            $table->string('card_backdrop_blur', 10)->default('md')->after('photo_shape');
            $table->unsignedTinyInteger('card_overlay_opacity')->default(88)->nullable()->after('card_backdrop_blur');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'show_date',
                'show_relationship',
                'card_gap',
                'visible_rows',
                'pause_on_hover',
                'photo_shape',
                'card_backdrop_blur',
                'card_overlay_opacity',
            ]);
        });
    }
};
