<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('display_name')->nullable()->after('color');
            $table->string('display_logo')->nullable()->after('display_name');
            $table->string('background_type', 20)->default('theme')->after('display_logo');
            $table->text('background_value')->nullable()->after('background_type');
            $table->string('animation_movement', 30)->default('scroll-left')->after('background_value');
            $table->string('animation_in', 20)->default('fade')->after('animation_movement');
            $table->string('animation_out', 20)->default('fade')->after('animation_in');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'display_name',
                'display_logo',
                'background_type',
                'background_value',
                'animation_movement',
                'animation_in',
                'animation_out',
            ]);
        });
    }
};
