<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReadingQuestion extends Model
{
    protected $fillable = [
        'passage',
        'question',
        'options',
        'correct_answer',
        'explanation',
        'difficulty',
        'topic',
        'is_active',
    ];

    protected $casts = [
        'options' => 'array',
        'is_active' => 'boolean',
    ];
}
