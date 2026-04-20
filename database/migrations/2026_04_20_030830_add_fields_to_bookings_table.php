<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {

            $table->string('student_name')->nullable();
            $table->string('student_email')->nullable();

            $table->foreignId('tutor_id')->nullable()->constrained()->onDelete('cascade');

            $table->string('specialization')->nullable();
            $table->timestamp('scheduled_at')->nullable();

            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('pending');

            $table->string('meet_link')->nullable();

        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'student_name',
                'student_email',
                'tutor_id',
                'specialization',
                'scheduled_at',
                'payment_method',
                'payment_status',
                'meet_link'
            ]);
        });
    }
};