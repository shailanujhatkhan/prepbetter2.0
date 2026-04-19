<?php

namespace App\Http\Controllers\Api\Tutor;

use App\Http\Controllers\Controller;
use App\Models\WritingFeedback;
use App\Models\WritingSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(): JsonResponse
    {
        $submissions = WritingSubmission::with([
            'user:id,name,email',
            'question:id,title,type,chart_type',
            'feedback',
        ])->latest()->paginate(15);

        return response()->json($submissions);
    }

    public function show(WritingSubmission $submission): JsonResponse
    {
        $submission->load(['user', 'question', 'feedback.evaluator']);

        return response()->json(['data' => $submission]);
    }

    public function store(Request $request, WritingSubmission $submission): JsonResponse
    {
        $validated = $request->validate([
            'band_score' => ['required', 'numeric', 'min:0', 'max:9'],
            'grammar_feedback' => ['required', 'string'],
            'vocabulary_feedback' => ['required', 'string'],
            'coherence_feedback' => ['required', 'string'],
            'recommendations' => ['required', 'string'],
        ]);

        $feedback = WritingFeedback::updateOrCreate(
            ['writing_submission_id' => $submission->id, 'evaluator_type' => 'tutor'],
            [...$validated, 'evaluator_id' => auth()->id()]
        );

        return response()->json(['data' => $feedback, 'message' => 'Feedback submitted.']);
    }
}
