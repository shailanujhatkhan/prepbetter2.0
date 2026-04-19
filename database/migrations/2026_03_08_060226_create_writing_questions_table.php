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
        Schema::create('writing_questions', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // task1 or task2
            $table->string('title');
            $table->text('prompt_text')->nullable();
            $table->string('chart_type')->nullable(); // bar_graph, line_graph, pie_chart, map, process_diagram
            $table->string('essay_type')->nullable(); // agree_disagree, advantage_disadvantage, etc.
            $table->string('image_path')->nullable();
            $table->string('difficulty')->default('medium'); // easy, medium, hard
            $table->json('hints')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('writing_questions');
    }
};
