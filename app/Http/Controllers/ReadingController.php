<?php

namespace App\Http\Controllers;

use App\Models\ReadingQuestion;
use Inertia\Inertia;
use Inertia\Response;

class ReadingController extends Controller
{
    public function index(): Response
    {
        $questions = ReadingQuestion::where('is_active', true)
            ->select('id', 'question', 'difficulty', 'topic')
            ->latest()
            ->get();

        return Inertia::render('reading/index', [
            'questions' => $questions,
        ]);
    }

    public function practice(ReadingQuestion $question): Response
    {
        abort_unless($question->is_active, 404);

        $nextId = ReadingQuestion::where('is_active', true)
            ->where('id', '>', $question->id)
            ->orderBy('id')
            ->value('id');

        return Inertia::render('reading/practice', [
            'question'       => $question,
            'nextQuestionId' => $nextId,
        ]);
    }
}
