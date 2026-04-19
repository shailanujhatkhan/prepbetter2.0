<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WritingSubmission extends Model
{
    protected $fillable = [
        'user_id',
        'writing_question_id',
        'content',
        'word_count',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(WritingQuestion::class, 'writing_question_id');
    }

    public function feedback(): HasOne
    {
        return $this->hasOne(WritingFeedback::class);
    }
}
