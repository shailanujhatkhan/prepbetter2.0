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
    Schema::create('listening_questions', function (Blueprint $table) {
        $table->id();
        $table->text('text'); // sentence that will be converted to audio
        $table->json('options'); // multiple choices
        $table->integer('correct_answer'); // index (0,1,2,3)
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listening_questions');
    }
};
