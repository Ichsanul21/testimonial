<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            // Animasi tambahan
            $table->string('animation_movement_extra', 30)->nullable()->after('animation_out');
            $table->string('animation_in_extra', 20)->nullable()->after('animation_movement_extra');
            $table->string('animation_out_extra', 20)->nullable()->after('animation_in_extra');
            $table->string('new_item_animation_extra', 20)->nullable()->after('animation_out_extra');

            // Font + Banner
            $table->string('title_font', 30)->default('playfair')->after('new_item_animation_extra');
            $table->string('title_size', 10)->default('lg')->after('title_font');
            $table->string('banner_style', 20)->default('glass')->after('title_size');
            $table->string('banner_position', 15)->default('top')->after('banner_style');

            // Card
            $table->string('card_radius', 10)->default('md')->after('banner_position');
            $table->string('card_style', 20)->default('glass')->after('card_radius');
            $table->string('card_text_color', 20)->default('light')->after('card_style');
            $table->string('text_align', 10)->default('left')->after('card_text_color');
            $table->boolean('show_photo')->default(true)->after('text_align');
            $table->boolean('show_quote')->default(false)->after('show_photo');

            // Display
            $table->string('scroll_speed', 10)->default('normal')->after('show_quote');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'animation_movement_extra',
                'animation_in_extra',
                'animation_out_extra',
                'new_item_animation_extra',
                'title_font',
                'title_size',
                'banner_style',
                'banner_position',
                'card_radius',
                'card_style',
                'card_text_color',
                'text_align',
                'show_photo',
                'show_quote',
                'scroll_speed',
            ]);
        });
    }
};
