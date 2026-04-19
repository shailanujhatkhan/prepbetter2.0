<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WritingQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class WritingQuestionController extends Controller
{
    public function index(Request $request): Response
    {
        $questions = WritingQuestion::query()
            ->when($request->type, fn ($q, $type) => $q->where('type', $type))
            ->when($request->chart_type, fn ($q, $ct) => $q->where('chart_type', $ct))
            ->when($request->essay_type, fn ($q, $et) => $q->where('essay_type', $et))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/writing-questions/index', [
            'questions' => $questions,
            'filters' => $request->only(['type', 'chart_type', 'essay_type']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/writing-questions/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:task1,task2'],
            'title' => ['required', 'string', 'max:255'],
            'prompt_text' => ['nullable', 'string'],
            'chart_type' => ['required_if:type,task1', 'nullable', 'in:bar_graph,line_graph,pie_chart,map,process_diagram'],
            'essay_type' => ['required_if:type,task2', 'nullable', 'in:agree_disagree,advantage_disadvantage,discussion,problem_solution,two_part'],
            'difficulty' => ['required', 'in:easy,medium,hard'],
            'image' => ['nullable', 'image', 'max:2048'],
            'hints' => ['nullable', 'array'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('writing-images', 'public');
        }

        unset($validated['image']);

        WritingQuestion::create($validated);

        return redirect()->route('admin.writing-questions.index')->with('success', 'Question created.');
    }

    public function edit(WritingQuestion $writingQuestion): Response
    {
        return Inertia::render('admin/writing-questions/edit', [
            'question' => $writingQuestion,
        ]);
    }

    public function update(Request $request, WritingQuestion $writingQuestion): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:task1,task2'],
            'title' => ['required', 'string', 'max:255'],
            'prompt_text' => ['nullable', 'string'],
            'essay_type' => ['required_if:type,task2', 'nullable', 'in:agree_disagree,advantage_disadvantage,discussion,problem_solution,two_part'],
            'chart_type' => ['required_if:type,task1', 'nullable', 'in:bar_graph,line_graph,pie_chart,map,process_diagram'],
            'difficulty' => ['required', 'in:easy,medium,hard'],
            'image' => ['nullable', 'image', 'max:2048'],
            'hints' => ['nullable', 'array'],
        ]);

        if ($request->hasFile('image')) {
            if ($writingQuestion->image_path) {
                Storage::disk('public')->delete($writingQuestion->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('writing-images', 'public');
        }

        unset($validated['image']);

        $writingQuestion->update($validated);

        return redirect()->route('admin.writing-questions.index')->with('success', 'Question updated.');
    }

    public function destroy(WritingQuestion $writingQuestion): RedirectResponse
    {
        if ($writingQuestion->image_path) {
            Storage::disk('public')->delete($writingQuestion->image_path);
        }

        $writingQuestion->delete();

        return redirect()->route('admin.writing-questions.index')->with('success', 'Question deleted.');
    }
}
