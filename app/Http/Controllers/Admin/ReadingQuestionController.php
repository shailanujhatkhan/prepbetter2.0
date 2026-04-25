<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReadingQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReadingQuestionController extends Controller
{
    public function index(): Response
    {
        $questions = ReadingQuestion::latest()->paginate(20);

        return Inertia::render('admin/reading/index', [
            'questions' => $questions,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/reading/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'passage' => ['required', 'string'],
            'question' => ['required', 'string'],
            'options' => ['required', 'array', 'size:4'],
            'options.*' => ['required', 'string'],
            'correct_answer' => ['required', 'in:A,B,C,D'],
            'explanation' => ['nullable', 'string'],
            'difficulty' => ['required', 'in:easy,medium,hard'],
            'topic' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        ReadingQuestion::create($validated);

        return redirect()->route('admin.reading.index')->with('success', 'Question created.');
    }

    public function edit(ReadingQuestion $reading): Response
    {
        return Inertia::render('admin/reading/edit', [
            'question' => $reading,
        ]);
    }

    public function update(Request $request, ReadingQuestion $reading): RedirectResponse
    {
        $validated = $request->validate([
            'passage' => ['required', 'string'],
            'question' => ['required', 'string'],
            'options' => ['required', 'array', 'size:4'],
            'options.*' => ['required', 'string'],
            'correct_answer' => ['required', 'in:A,B,C,D'],
            'explanation' => ['nullable', 'string'],
            'difficulty' => ['required', 'in:easy,medium,hard'],
            'topic' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $reading->update($validated);

        return redirect()->route('admin.reading.index')->with('success', 'Question updated.');
    }

    public function destroy(ReadingQuestion $reading): RedirectResponse
    {
        $reading->delete();

        return redirect()->route('admin.reading.index')->with('success', 'Question deleted.');
    }
}
