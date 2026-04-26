<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tutor;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function index(): JsonResponse
    {
        $bookings = Booking::with(['tutor:id,name,specialization'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json(['success' => true, 'data' => $bookings]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();

        $validated = $request->validate([
            'tutor_id'           => ['required', 'exists:tutors,id'],
            'specialization'     => ['required', 'string'],
            'scheduled_at'       => ['required'],
            'payment_method'     => ['required', 'string', 'in:Card,Bank,bKash'],
            'transaction_number' => ['nullable', 'string', 'max:100'],
            'reference_number'   => ['nullable', 'string', 'max:100'],
            'payment_note'       => ['nullable', 'string', 'max:500'],
        ]);

        $isManual    = in_array($validated['payment_method'], ['Bank', 'bKash']);
        $scheduledAt = Carbon::parse($validated['scheduled_at']);

        $conflict = Booking::where('tutor_id', $validated['tutor_id'])
            ->where('scheduled_at', $scheduledAt)
            ->whereIn('payment_status', ['confirmed', 'pending'])
            ->exists();

        if ($conflict) {
            return response()->json(['message' => 'This slot is already booked.'], 422);
        }

        $meetLink = 'https://meet.google.com/'
            . Str::lower(Str::random(3)) . '-'
            . Str::lower(Str::random(4)) . '-'
            . Str::lower(Str::random(3));

        $booking = Booking::create([
            'user_id'            => $user->id,
            'student_name'       => $user->name,
            'student_email'      => $user->email,
            'tutor_id'           => $validated['tutor_id'],
            'specialization'     => $validated['specialization'],
            'scheduled_at'       => $scheduledAt,
            'payment_method'     => $validated['payment_method'],
            'payment_status'     => $isManual ? 'pending' : 'confirmed',
            'meet_link'          => $meetLink,
            'transaction_number' => $validated['transaction_number'] ?? null,
            'reference_number'   => $validated['reference_number'] ?? null,
            'payment_note'       => $validated['payment_note'] ?? null,
        ]);

        return response()->json([
            'success'        => true,
            'payment_status' => $booking->payment_status,
            'message'        => $isManual ? 'Booking submitted for approval.' : 'Booking confirmed.',
            'booking'        => $booking->load('tutor'),
        ]);
    }

    public function tutors(Request $request): JsonResponse
    {
        $type   = $request->query('type', 'speaking');
        $tutors = Tutor::with(['bookings' => function ($q) {
            $q->whereIn('payment_status', ['pending', 'confirmed'])
              ->select('tutor_id', 'scheduled_at');
        }])->where('specialization', 'like', "%{$type}%")->get();

        return response()->json(['success' => true, 'data' => $tutors]);
    }
}
