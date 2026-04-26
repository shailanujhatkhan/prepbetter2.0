<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ListeningQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ListeningQuestionController extends Controller
{
    public function index()
    {
        $questions = ListeningQuestion::latest()->paginate(20);

        return Inertia::render('admin/listening/index', [
            'questions' => $questions,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/listening/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'youtube_video_id' => 'required|string|max:255',
            'title'            => 'required|string|max:255',
            'text'             => 'required|string',
            'options'          => 'required|array|size:4',
            'options.*'        => 'required|string|max:255',
            'correct_answer'   => 'required|integer|min:0|max:3',
        ]);

        ListeningQuestion::create($validated);

        return redirect()->route('admin.listening.index')
            ->with('success', 'Listening question created.');
    }

    public function edit(ListeningQuestion $listening)
    {
        return Inertia::render('admin/listening/edit', [
            'question' => $listening,
        ]);
    }

    public function update(Request $request, ListeningQuestion $listening)
    {
        $validated = $request->validate([
            'youtube_video_id' => 'required|string|max:255',
            'title'            => 'required|string|max:255',
            'text'             => 'required|string',
            'options'          => 'required|array|size:4',
            'options.*'        => 'required|string|max:255',
            'correct_answer'   => 'required|integer|min:0|max:3',
        ]);

        $listening->update($validated);

        return redirect()->route('admin.listening.index')
            ->with('success', 'Listening question updated.');
    }

    public function destroy(ListeningQuestion $listening)
    {
        $listening->delete();

        return redirect()->route('admin.listening.index')
            ->with('success', 'Listening question deleted.');
    }
}
