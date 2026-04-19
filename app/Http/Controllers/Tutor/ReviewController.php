<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\WritingFeedback;
use App\Models\WritingSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(): Response
    {
        $submissions = WritingSubmission::with(['user', 'question', 'feedback'])
            ->latest()
            ->paginate(15);

        return Inertia::render('tutor/reviews/index', [
            'submissions' => $submissions,
        ]);
    }

    public function show(WritingSubmission $submission): Response
    {
        $submission->load(['user', 'question', 'feedback.evaluator']);

        return Inertia::render('tutor/reviews/show', [
            'submission' => $submission,
        ]);
    }

    public function store(Request $request, WritingSubmission $submission): RedirectResponse
    {
        $validated = $request->validate([
            'band_score' => ['required', 'numeric', 'min:0', 'max:9'],
            'grammar_feedback' => ['required', 'string'],
            'vocabulary_feedback' => ['required', 'string'],
            'coherence_feedback' => ['required', 'string'],
            'recommendations' => ['required', 'string'],
        ]);

        WritingFeedback::updateOrCreate(
            [
                'writing_submission_id' => $submission->id,
                'evaluator_type' => 'tutor',
            ],
            [
                ...$validated,
                'evaluator_id' => auth()->id(),
            ]
        );

        return redirect()->route('tutor.reviews.index')->with('success', 'Feedback submitted.');
    }
}
