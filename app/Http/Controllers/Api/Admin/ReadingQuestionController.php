<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReadingQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReadingQuestionController extends Controller
{
    public function index(): JsonResponse
    {
        $questions = ReadingQuestion::latest()->paginate(20);
        return response()->json($questions);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'passage'        => ['required', 'string'],
            'question'       => ['required', 'string'],
            'options'        => ['required', 'array', 'size:4'],
            'options.*'      => ['required', 'string'],
            'correct_answer' => ['required', 'in:A,B,C,D'],
            'explanation'    => ['nullable', 'string'],
            'difficulty'     => ['required', 'in:easy,medium,hard'],
            'topic'          => ['nullable', 'string'],
            'is_active'      => ['boolean'],
        ]);

        $q = ReadingQuestion::create($validated);
        return response()->json(['success' => true, 'data' => $q], 201);
    }

    public function show(ReadingQuestion $reading): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $reading]);
    }

    public function update(Request $request, ReadingQuestion $reading): JsonResponse
    {
        $validated = $request->validate([
            'passage'        => ['required', 'string'],
            'question'       => ['required', 'string'],
            'options'        => ['required', 'array', 'size:4'],
            'options.*'      => ['required', 'string'],
            'correct_answer' => ['required', 'in:A,B,C,D'],
            'explanation'    => ['nullable', 'string'],
            'difficulty'     => ['required', 'in:easy,medium,hard'],
            'topic'          => ['nullable', 'string'],
            'is_active'      => ['boolean'],
        ]);

        $reading->update($validated);
        return response()->json(['success' => true, 'data' => $reading]);
    }

    public function destroy(ReadingQuestion $reading): JsonResponse
    {
        $reading->delete();
        return response()->json(['success' => true, 'message' => 'Deleted.']);
    }
}
