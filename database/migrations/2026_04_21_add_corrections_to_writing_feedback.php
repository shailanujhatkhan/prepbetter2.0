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
        Schema::table('writing_feedback', function (Blueprint $table) {
            $table->json('corrections')->nullable()->comment('Detailed grammar corrections from Language Tool');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('writing_feedback', function (Blueprint $table) {
            $table->dropColumn('corrections');
        });
    }
};
