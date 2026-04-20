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
            return redirect()->route('login');
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
            'student_name' => $user->name,
            'student_email' => $user->email,
            'tutor_id' => $validated['tutor_id'],
            'specialization' => $validated['specialization'],
            'scheduled_at' => $validated['scheduled_at'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'paid',
        ]);

        // Send confirmation email
        Mail::to($user->email)->send(
            new BookingConfirmedMail($booking)
        );

        // Return back to UI (Inertia-friendly)
        return redirect()->back()->with('success', 'Booking confirmed successfully!');
    }
}