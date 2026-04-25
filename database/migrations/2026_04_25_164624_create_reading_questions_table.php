<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reading_questions', function (Blueprint $table) {
            $table->id();
            $table->text('passage');
            $table->string('question')->default('Which option best summarizes the passage?');
            $table->json('options');
            $table->string('correct_answer');
            $table->text('explanation')->nullable();
            $table->string('difficulty')->default('medium');
            $table->string('topic')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reading_questions');
    }
};
