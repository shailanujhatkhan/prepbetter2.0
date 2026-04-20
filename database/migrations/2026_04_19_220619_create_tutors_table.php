<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tutors', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('email')->unique();

            $table->string('specialization')->nullable();

            $table->decimal('band', 3, 1)->nullable();
            $table->integer('experience')->nullable();
            $table->decimal('rating', 3, 2)->nullable();

            $table->text('availability')->nullable(); 
            // JSON string like:
            // {"Monday":["10am","2pm"],"Tuesday":["9am"]}

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tutors');
    }
};