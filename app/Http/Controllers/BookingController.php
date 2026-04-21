<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmedMail;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        // Ensure user is logged in (safe guard)
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Validate incoming booking data
        $validated = $request->validate([
            'tutor_id' => ['required', 'exists:tutors,id'],
            'specialization' => ['required', 'string'],
            'scheduled_at' => ['required'],
            'payment_method' => ['required', 'string'],
        ]);

        // Create booking
        $booking = Booking::create([
            'user_id' => $user->id,
            'student_name' => $user->name,
            'student_email' => $user->email,
            'tutor_id' => $validated['tutor_id'],
            'specialization' => $validated['specialization'],
            'scheduled_at' => \Carbon\Carbon::parse($validated['scheduled_at']),
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'confirmed',
        ]);

        // Send confirmation email
        // Mail::to($user->email)->send(
        //     new BookingConfirmedMail($booking)
        // );

        // Return JSON response for Inertia
        return response()->json([
            'success' => true,
            'message' => 'Booking confirmed successfully!',
            'booking' => $booking,
        ]);
    }
}