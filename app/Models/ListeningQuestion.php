<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListeningQuestion extends Model
{
    protected $fillable = [
        'title',
        'audio_text',
        'options',
        'correct_answer',
    ];

    protected $casts = [
        'options' => 'array',
    ];
}
