<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuideStep extends Model
{
    protected $fillable = [
        'module',
        'task_type',
        'essay_type',
        'step_order',
        'title',
        'description',
        'guidance',
        'tips',
        'example',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'tips' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get steps for a specific module and task
     */
    public static function forTask(string $module, string $taskType, ?string $essayType = null)
    {
        return self::where('module', $module)
            ->where('task_type', $taskType)
            ->where('essay_type', $essayType)
            ->where('is_active', true)
            ->orderBy('step_order')
            ->get();
    }
}
