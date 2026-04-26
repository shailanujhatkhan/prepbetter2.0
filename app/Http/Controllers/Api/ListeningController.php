<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ListeningQuestion;
use Illuminate\Http\JsonResponse;

class ListeningController extends Controller
{
    /**
     * Get all listening questions
     */
    public function index(): JsonResponse
    {
        $questions = ListeningQuestion::whereNotNull('youtube_video_id')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $questions,
            'count' => $questions->count(),
        ]);
    }

    /**
     * Get a specific listening question
     */
    public function show(ListeningQuestion $listening): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $listening,
        ]);
    }
}
