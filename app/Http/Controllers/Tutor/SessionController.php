<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tutor;
use Inertia\Inertia;
use Inertia\Response;

class SessionController extends Controller
{
    public function index(): Response
    {
        $user  = auth()->user();
        $tutor = Tutor::where('user_id', $user->id)->first();

        $bookings = $tutor
            ? Booking::with('user')
                ->where('tutor_id', $tutor->id)
                ->whereIn('payment_status', ['confirmed', 'pending'])
                ->orderBy('scheduled_at')
                ->get()
            : collect();

        return Inertia::render('tutor/sessions', [
            'bookings' => $bookings,
        ]);
    }
}
