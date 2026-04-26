<?php

namespace App\Http\Controllers\Api\Tutor;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index(): JsonResponse
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

        return response()->json([
            'success'     => true,
            'tutor'       => $tutor,
            'bookedSlots' => $bookedSlots,
        ]);
    }

    public function update(Request $request): JsonResponse
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

        return response()->json(['success' => true, 'message' => 'Availability updated.', 'tutor' => $tutor]);
    }
}
