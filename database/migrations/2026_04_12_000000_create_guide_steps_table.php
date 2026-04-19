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
        Schema::create('guide_steps', function (Blueprint $table) {
            $table->id();
            $table->string('module'); // writing, reading, listening, speaking
            $table->string('task_type'); // task1, task2, etc
            $table->string('essay_type')->nullable(); // for task2: agree_disagree, advantage_disadvantage, etc
            $table->integer('step_order'); // 1-8 for ordering
            $table->string('title');
            $table->string('description');
            $table->text('guidance');
            $table->json('tips'); // array of tips
            $table->text('example')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['module', 'task_type', 'essay_type']);
            $table->unique(['module', 'task_type', 'essay_type', 'step_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guide_steps');
    }
};
