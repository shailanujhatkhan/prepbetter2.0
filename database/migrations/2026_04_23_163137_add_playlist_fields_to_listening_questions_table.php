<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('listening_questions', function (Blueprint $table) {
            $table->string('playlist_id')->nullable()->after('youtube_video_id');
            $table->timestamp('synced_at')->nullable()->after('correct_answer');
        });
    }

    public function down(): void
    {
        Schema::table('listening_questions', function (Blueprint $table) {
            $table->dropColumn(['playlist_id', 'synced_at']);
        });
    }
};