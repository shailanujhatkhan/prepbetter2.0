<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WritingQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WritingQuestionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $questions = WritingQuestion::query()
            ->when($request->type, fn ($q, $t) => $q->where('type', $t))
            ->when($request->chart_type, fn ($q, $ct) => $q->where('chart_type', $ct))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return response()->json($questions);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:task1,task2'],
            'title' => ['required', 'string', 'max:255'],
            'prompt_text' => ['nullable', 'string'],
            'chart_type' => ['required_if:type,task1', 'nullable', 'in:bar_graph,line_graph,pie_chart,map,process_diagram'],
            'difficulty' => ['required', 'in:easy,medium,hard'],
            'image' => ['nullable', 'image', 'max:2048'],
            'hints' => ['nullable', 'array'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('writing-images', 'public');
        }

        unset($validated['image']);

        $question = WritingQuestion::create($validated);

        return response()->json(['data' => $question, 'message' => 'Question created.'], 201);
    }

    public function show(WritingQuestion $writingQuestion): JsonResponse
    {
        return response()->json(['data' => $writingQuestion]);
    }

    public function update(Request $request, WritingQuestion $writingQuestion): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:task1,task2'],
            'title' => ['required', 'string', 'max:255'],
            'prompt_text' => ['nullable', 'string'],
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

        return response()->json(['data' => $writingQuestion, 'message' => 'Question updated.']);
    }

    public function destroy(WritingQuestion $writingQuestion): JsonResponse
    {
        if ($writingQuestion->image_path) {
            Storage::disk('public')->delete($writingQuestion->image_path);
        }

        $writingQuestion->delete();

        return response()->json(['message' => 'Question deleted.']);
    }
}
