<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WritingFeedback extends Model
{
    protected $table = 'writing_feedback';

    protected $fillable = [
        'writing_submission_id',
        'evaluator_type',
        'evaluator_id',
        'band_score',
        'grammar_feedback',
        'vocabulary_feedback',
        'coherence_feedback',
        'recommendations',
    ];

    protected $casts = [
        'grammar_breakdown' => 'array',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(WritingSubmission::class, 'writing_submission_id');
    }
    public function evaluator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }
}
