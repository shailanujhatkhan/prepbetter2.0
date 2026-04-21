<?php

namespace App\Http\Controllers;

use App\Models\WritingSubmission;
use App\Models\WritingFeedback;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class AIWritingFeedbackController extends Controller
{
    public function generateFeedback($id)
    {
        // Fetch submission safely
        $submission = WritingSubmission::findOrFail($id);

        $text = $submission->content;

        // Call LanguageTool API
        $response = Http::withoutVerifying()->asForm()->post('https://api.languagetool.org/v2/check', [
            'text' => $text,
            'language' => 'en-US'
        ]);

        $matches = $response->json()['matches'] ?? [];

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

        // Simple band score (placeholder logic)
        $bandScore = 7;

        // Store AI feedback in DB (clean + consistent)
        WritingFeedback::create([
            'writing_submission_id' => $submission->id,
            'evaluator_type' => 'ai',
            'evaluator_id' => null,
            'band_score' => $bandScore,

            // Store as readable string (safe for now)
            'grammar_feedback' => collect($grammarIssues)
                ->pluck('message')
                ->filter()
                ->implode(' | '),

            'vocabulary_feedback' => null,
            'coherence_feedback' => null,
            'recommendations' => 'Focus on fixing grammar issues highlighted by AI.',
        ]);

        // Send data to frontend (Inertia page)
        return Inertia::render('writingcheck/AIFeedback', [
            'submission' => $submission,
            'original' => $text,
            'corrections' => $grammarIssues,
            'band_score' => $bandScore,
        ]);
    }
}