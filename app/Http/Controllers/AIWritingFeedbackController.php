<?php

namespace App\Http\Controllers;

use App\Models\WritingSubmission;
use App\Models\WritingFeedback;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

class AIWritingFeedbackController extends Controller
{
    public function generateFeedback($id)
    {
        $submission = WritingSubmission::findOrFail($id);

        $text = $submission->content;

        try {
            $response = Http::withoutVerifying()->asForm()->post('https://api.languagetool.org/v2/check', [
                'text' => $text,
                'language' => 'en-US'
            ]);

            if ($response->failed()) {
                return response()->json(['error' => 'Failed to generate feedback'], 500);
            }

            $matches = $response->json()['matches'] ?? [];
        } catch (\Exception $e) {
            return response()->json(['error' => 'API Error: ' . $e->getMessage()], 500);
        }

        $grammarIssues = [];

        foreach ($matches as $match) {
            $grammarIssues[] = [
                'message' => $match['message'] ?? null,
                'incorrect_text' => isset($match['offset'], $match['length'])
                    ? substr($text, $match['offset'], $match['length'])
                    : null,
                'suggestions' => $match['replacements'] ?? []
            ];
        }

        $bandScore = 7;

        $writingFeedback = WritingFeedback::create([
            'writing_submission_id' => $submission->id,
            'evaluator_type' => 'ai',
            'evaluator_id' => null,
            'band_score' => $bandScore,
            'grammar_feedback' => collect($grammarIssues)
                ->pluck('message')
                ->filter()
                ->implode(' | '),
            'vocabulary_feedback' => null,
            'coherence_feedback' => null,
            'recommendations' => 'Focus on fixing grammar issues highlighted by AI.',
            'corrections' => $grammarIssues,  // Save detailed corrections
        ]);

        return response()->json([
            'success' => true,
            'feedback' => [
                'id' => $writingFeedback->id,
                'evaluator_type' => $writingFeedback->evaluator_type,
                'band_score' => $writingFeedback->band_score,
                'grammar_feedback' => $writingFeedback->grammar_feedback,
                'vocabulary_feedback' => $writingFeedback->vocabulary_feedback,
                'coherence_feedback' => $writingFeedback->coherence_feedback,
                'recommendations' => $writingFeedback->recommendations,
                'evaluator' => null,
                'created_at' => $writingFeedback->created_at,
            ]
        ]);
    }
    public function show($id)
    {
        $submission = WritingSubmission::with('feedback')->findOrFail($id);

        if (!$submission->feedback) {
            return response()->json(['error' => 'No feedback found for this submission'], 404);
        }

        return Inertia::render('writingcheck/AIFeedback', [
            'submission' => $submission,
            'original' => $submission->content,
            'corrections' => $submission->feedback->corrections ?? [],
            'band_score' => $submission->feedback->band_score,
            'recommendations' => $submission->feedback->recommendations,
        ]);
    }
}