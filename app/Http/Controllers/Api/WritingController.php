<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GuideStep;
use App\Models\WritingQuestion;
use App\Models\WritingSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WritingController extends Controller
{
    public function task1Types(): JsonResponse
    {
        $types = WritingQuestion::where('type', 'task1')
            ->selectRaw('chart_type, count(*) as count')
            ->groupBy('chart_type')
            ->pluck('count', 'chart_type');

        return response()->json(['data' => $types]);
    }

    public function task1Questions(string $chartType): JsonResponse
    {
        $questions = WritingQuestion::where('type', 'task1')
            ->where('chart_type', $chartType)
            ->latest()
            ->get(['id', 'title', 'difficulty', 'chart_type']);

        return response()->json(['data' => $questions]);
    }

    public function task1Practice(WritingQuestion $question): JsonResponse
    {
        return response()->json(['data' => $question]);
    }

    public function submit(Request $request, WritingQuestion $question): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'min:10'],
        ]);

        $wordCount = str_word_count($validated['content']);

        $submission = WritingSubmission::create([
            'user_id' => auth()->id(),
            'writing_question_id' => $question->id,
            'content' => $validated['content'],
            'word_count' => $wordCount,
        ]);

        return response()->json([
            'data' => $submission,
            'message' => 'Essay submitted successfully.',
        ], 201);
    }

    public function mySubmissions(): JsonResponse
    {
        $submissions = WritingSubmission::with([
            'question:id,title,chart_type,type',
            'feedback:id,writing_submission_id,band_score,evaluator_type',
        ])
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(15);

        return response()->json($submissions);
    }

    public function submission(WritingSubmission $submission): JsonResponse
    {
        abort_unless(
            $submission->user_id === auth()->id()
                || auth()->user()->isTutor()
                || auth()->user()->isAdmin(),
            403,
            'You do not have permission to view this submission.'
        );

        $submission->load(['question', 'feedback.evaluator']);

        return response()->json(['data' => $submission]);
    }

    public function task2Types(): JsonResponse
    {
        $types = WritingQuestion::where('type', 'task2')
            ->selectRaw('essay_type, count(*) as count')
            ->groupBy('essay_type')
            ->pluck('count', 'essay_type');

        return response()->json(['data' => $types]);
    }

    public function task2Questions(string $essayType): JsonResponse
    {
        $questions = WritingQuestion::where('type', 'task2')
            ->where('essay_type', $essayType)
            ->latest()
            ->get(['id', 'title', 'difficulty', 'essay_type']);

        return response()->json(['data' => $questions]);
    }

    public function task2Detail(WritingQuestion $question): JsonResponse
    {
        abort_unless($question->type === 'task2', 404);

        return response()->json(['data' => $question->only([
            'id', 'title', 'prompt_text', 'essay_type', 'difficulty',
        ])]);
    }

    /**
     * Get guide steps for a specific task
     */
    public function guideSteps(string $taskType, ?string $essayType = null): JsonResponse
    {
        $query = GuideStep::where('module', 'writing')
            ->where('task_type', $taskType)
            ->where('is_active', true);

        if ($essayType === null) {
            $query->whereNull('essay_type');
        } else {
            $query->where('essay_type', $essayType);
        }

        $steps = $query->orderBy('step_order')->get();

        return response()->json(['data' => $steps]);
    }
}
