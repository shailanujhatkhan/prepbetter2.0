<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_name',
        'student_email',
        'tutor_id',
        'specialization',
        'scheduled_at',
        'payment_method',
        'payment_status',
        'meet_link',
    ];
}