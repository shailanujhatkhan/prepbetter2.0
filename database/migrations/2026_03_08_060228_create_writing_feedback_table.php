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
        Schema::create('writing_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('writing_submission_id')->constrained()->cascadeOnDelete();
            $table->string('evaluator_type'); // ai or tutor
            $table->foreignId('evaluator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('band_score', 3, 1)->nullable();
            $table->text('grammar_feedback')->nullable();
            $table->text('vocabulary_feedback')->nullable();
            $table->text('coherence_feedback')->nullable();
            $table->text('recommendations')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('writing_feedback');
    }
};
