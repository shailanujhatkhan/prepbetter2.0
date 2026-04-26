<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listening_questions', function (Blueprint $table) {
            $table->string('youtube_video_id')->nullable()->after('id');
            $table->string('title')->nullable()->after('youtube_video_id');
        });
    }

    public function down(): void
    {
        Schema::table('listening_questions', function (Blueprint $table) {
            $table->dropColumn(['youtube_video_id', 'title']);
        });
    }
};
