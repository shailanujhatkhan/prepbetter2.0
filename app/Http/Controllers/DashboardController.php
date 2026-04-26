<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\WritingFeedback;
use App\Models\WritingQuestion;
use App\Models\WritingSubmission;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $stats = [];

        // Stats for all roles
        $stats['totalWritingQuestions'] = WritingQuestion::count();

        // Student stats
        if ($user->isStudent()) {
            $stats['mySubmissions'] = WritingSubmission::where('user_id', $user->id)->count();

            $stats['reviewedSubmissions'] = WritingSubmission::where('user_id', $user->id)
                ->whereHas('feedback')
                ->count();

            $stats['pendingSubmissions'] = WritingSubmission::where('user_id', $user->id)
                ->whereDoesntHave('feedback')
                ->count();

            $submissions = WritingSubmission::with('feedback')
                ->where('user_id', $user->id)
                ->get();

            $heatmap = [
                'articles' => 0,
                'tenses' => 0,
                'prepositions' => 0,
                'subject_verb' => 0,
            ];

            foreach ($submissions as $submission) {
                $breakdown = $submission->feedback?->grammar_breakdown;
                if ($breakdown) {
                    $heatmap['articles'] += $breakdown['articles'] ?? 0;
                    $heatmap['tenses'] += $breakdown['tenses'] ?? 0;
                    $heatmap['prepositions'] += $breakdown['prepositions'] ?? 0;
                    $heatmap['subject_verb'] += $breakdown['subject_verb'] ?? 0;
                }
            }

            $stats['grammarHeatmap'] = $heatmap;

            $stats['averageBandScore'] = WritingFeedback::whereHas('submission', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->avg('band_score');
        }

        // Tutor and admin stats
        if ($user->isTutor() || $user->isAdmin()) {
            $stats['submissionsNeedingReview'] = WritingSubmission::whereDoesntHave('feedback')->count();

            $stats['totalReviewedSubmissions'] = WritingSubmission::whereHas('feedback')->count();

            $stats['recentSubmissions'] = WritingSubmission::with(['user', 'question', 'feedback'])
                ->latest()
                ->take(5)
                ->get();
        }

        // Admin-only stats
        if ($user->isAdmin()) {
            $stats['totalUsers'] = User::count();
            $stats['totalStudents'] = User::where('role', 'student')->count();
            $stats['totalTutors'] = User::where('role', 'tutor')->count();
            $stats['totalSubmissions'] = WritingSubmission::count();
        }

        return Inertia::render('dashboard', ['stats' => $stats]);
    }
}
