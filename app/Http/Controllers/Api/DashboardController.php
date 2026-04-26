<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WritingFeedback;
use App\Models\WritingQuestion;
use App\Models\WritingSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $stats = [];

        $stats['totalWritingQuestions'] = WritingQuestion::count();

        if ($user->isStudent()) {
            $stats['mySubmissions'] = WritingSubmission::where('user_id', $user->id)->count();

            $stats['reviewedSubmissions'] = WritingSubmission::where('user_id', $user->id)
                ->whereHas('feedback')
                ->count();

            $stats['pendingSubmissions'] = WritingSubmission::where('user_id', $user->id)
                ->whereDoesntHave('feedback')
                ->count();

            $stats['averageBandScore'] = WritingFeedback::whereHas('submission', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->avg('band_score');

            $heatmap = ['articles' => 0, 'tenses' => 0, 'prepositions' => 0, 'subject_verb' => 0];
            WritingSubmission::with('feedback')->where('user_id', $user->id)->get()
                ->each(function ($s) use (&$heatmap) {
                    $b = $s->feedback?->grammar_breakdown;
                    if ($b) {
                        $heatmap['articles']     += $b['articles']     ?? 0;
                        $heatmap['tenses']       += $b['tenses']       ?? 0;
                        $heatmap['prepositions'] += $b['prepositions'] ?? 0;
                        $heatmap['subject_verb'] += $b['subject_verb'] ?? 0;
                    }
                });
            $stats['grammarHeatmap'] = $heatmap;
        }

        if ($user->isTutor() || $user->isAdmin()) {
            $stats['submissionsNeedingReview'] = WritingSubmission::whereDoesntHave('feedback')->count();
            $stats['totalReviewedSubmissions'] = WritingSubmission::whereHas('feedback')->count();

            $stats['recentSubmissions'] = WritingSubmission::with([
                'user:id,name',
                'question:id,title,chart_type',
                'feedback:id,writing_submission_id,band_score',
            ])->latest()->take(5)->get();
        }

        if ($user->isAdmin()) {
            $stats['totalUsers'] = User::count();
            $stats['totalStudents'] = User::where('role', 'student')->count();
            $stats['totalTutors'] = User::where('role', 'tutor')->count();
            $stats['totalSubmissions'] = WritingSubmission::count();
        }

        return response()->json(['data' => $stats]);
    }
}
