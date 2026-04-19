<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('student_name');
            $table->string('student_email');
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('pending');
            $table->dateTime('scheduled_at');
            $table->unsignedBigInteger('tutor_id');
            $table->string('specialization');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'student_name',
                'student_email',
                'payment_method',
                'payment_status',
                'scheduled_at',
                'tutor_id',
                'specialization'
            ]);
        });
    }
};