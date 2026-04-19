<?php

namespace App\Http\Controllers;

use App\Models\WritingSubmission;
use App\Models\WritingFeedback;
use Illuminate\Support\Facades\Http;

class AIWritingFeedbackController extends Controller
{
    public function generateFeedback($id)
    {
        $submission = WritingSubmission::find($id);

        if (!$submission) {
            return response()->json(['error' => 'Submission not found'], 404);
        }

        $text = $submission->content;

        // Call LanguageTool API
        $response = Http::asForm()->post('https://api.languagetool.org/v2/check', [
            'text' => $text,
            'language' => 'en-US'
        ]);

        $matches = $response->json()['matches'] ?? [];

        $grammarIssues = [];

        foreach ($matches as $match) {
            $grammarIssues[] = [
                'message' => $match['message'],
                'incorrect_text' => substr($text, $match['offset'], $match['length']),
                'suggestions' => $match['replacements'] ?? []
            ];
        }

        // SIMPLE AI-STYLE SCORE (you said default 7)
        $bandScore = 7;

        // SAVE TO DATABASE (THIS WAS MISSING)
        $feedback = WritingFeedback::create([
            'writing_submission_id' => $submission->id,
            'evaluator_type' => 'ai',
            'evaluator_id' => null,
            'band_score' => $bandScore,
            'grammar_feedback' => json_encode($grammarIssues),
            'vocabulary_feedback' => 'Not evaluated',
            'coherence_feedback' => 'Not evaluated',
            'recommendations' => 'Focus on grammar corrections shown.',
        ]);

        return response()->json([
            'message' => 'Feedback generated successfully',
            'feedback' => $feedback,
            'grammar_issues' => $grammarIssues
        ]);
    }
}
