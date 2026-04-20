<?php

namespace App\Http\Controllers;

use App\Models\ListeningQuestion;
use Inertia\Inertia;
use Inertia\Response;

class ListeningController extends Controller
{
    public function index(): Response
    {
        $questions = ListeningQuestion::inRandomOrder()->take(5)->get();

        return Inertia::render('listening/index', [
            'questions' => $questions,
        ]);
    }
}
