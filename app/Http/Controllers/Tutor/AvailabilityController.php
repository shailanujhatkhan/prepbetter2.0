<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvailabilityController extends Controller
{
    public function index()
    {
        $user  = auth()->user();
        $tutor = Tutor::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();

        if ($tutor && !$tutor->user_id) {
            $tutor->update(['user_id' => $user->id]);
        }

        $bookedSlots = $tutor
            ? $tutor->bookings()
                ->whereIn('payment_status', ['pending', 'confirmed'])
                ->get(['scheduled_at'])
                ->map(fn($b) => $b->scheduled_at->toIso8601String())
            : collect();

        return Inertia::render('tutor/availability', [
            'tutor'       => $tutor,
            'bookedSlots' => $bookedSlots,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'availability' => ['required', 'array'],
        ]);

        $user  = auth()->user();
        $tutor = Tutor::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->firstOrFail();

        if (!$tutor->user_id) {
            $tutor->update(['user_id' => $user->id]);
        }

        $tutor->update(['availability' => $validated['availability']]);

        return back()->with('success', 'Availability updated.');
    }
}
