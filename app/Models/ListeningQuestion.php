<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListeningQuestion extends Model
{
    protected $fillable = [
        'youtube_video_id',
        'playlist_id',
        'title',
        'text',
        'options',
        'correct_answer',
        'synced_at',
    ];

    protected $casts = [
        'options'   => 'array',
        'synced_at' => 'datetime',
    ];
}
