<?php

namespace App\Http\Controllers;

use App\Models\WritingQuestion;
use App\Models\WritingSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WritingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('writing/index');
    }

    public function task1Types(): Response
    {
        $types = WritingQuestion::where('type', 'task1')
            ->selectRaw('chart_type, count(*) as count')
            ->groupBy('chart_type')
            ->pluck('count', 'chart_type');

        return Inertia::render('writing/task1/types', [
            'typeCounts' => $types,
        ]);
    }

    public function task1Questions(string $chartType): Response
    {
        $questions = WritingQuestion::where('type', 'task1')
            ->where('chart_type', $chartType)
            ->latest()
            ->get(['id', 'title', 'difficulty', 'chart_type']);

        return Inertia::render('writing/task1/questions', [
            'chartType' => $chartType,
            'questions' => $questions,
        ]);
    }

    public function task1Practice(WritingQuestion $question): Response
    {
        return Inertia::render('writing/task1/practice', [
            'question' => $question,
        ]);
    }

    public function submit(Request $request, WritingQuestion $question): RedirectResponse
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

        return redirect()
            ->route('writing.submission', $submission)
            ->with('success', 'Essay submitted successfully.');
    }

    public function submission(WritingSubmission $submission): Response
    {
        $submission->load(['question', 'feedback.evaluator']);

        abort_unless(
            $submission->user_id === auth()->id() ||
            auth()->user()->isTutor() ||
            auth()->user()->isAdmin(),
            403
        );

        return Inertia::render('writing/submission', [
            'submission' => $submission,
        ]);
    }

    // ── Task 2: Guided Essay Flow ─────────────────────────────────────────

    public function task2Types(): Response
    {
        $types = WritingQuestion::where('type', 'task2')
            ->selectRaw('essay_type, count(*) as count')
            ->groupBy('essay_type')
            ->pluck('count', 'essay_type');

        return Inertia::render('writing/task2/types', [
            'typeCounts' => $types,
        ]);
    }

    public function task2Questions(string $essayType): Response
    {
        $questions = WritingQuestion::where('type', 'task2')
            ->where('essay_type', $essayType)
            ->latest()
            ->get(['id', 'title', 'difficulty', 'essay_type']);

        return Inertia::render('writing/task2/questions', [
            'essayType' => $essayType,
            'questions' => $questions,
        ]);
    }

    public function task2Guided(WritingQuestion $question): Response
    {
        return Inertia::render('writing/task2/guided', [
            'question' => $question,
        ]);
    }
}