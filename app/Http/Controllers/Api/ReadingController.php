<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReadingQuestion;
use Illuminate\Http\JsonResponse;

class ReadingController extends Controller
{
    public function index(): JsonResponse
    {
        $questions = ReadingQuestion::where('is_active', true)
            ->select('id', 'question', 'difficulty', 'topic')
            ->latest()
            ->get();

        return response()->json(['success' => true, 'data' => $questions]);
    }

    public function show(ReadingQuestion $reading): JsonResponse
    {
        abort_unless($reading->is_active, 404);

        return response()->json(['success' => true, 'data' => $reading]);
    }
}
