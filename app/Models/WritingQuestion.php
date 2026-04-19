<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WritingQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'prompt_text',
        'chart_type',
        'essay_type',
        'image_path',
        'difficulty',
        'hints',
    ];

    protected function casts(): array
    {
        return [
            'hints' => 'array',
        ];
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(WritingSubmission::class);
    }
}
