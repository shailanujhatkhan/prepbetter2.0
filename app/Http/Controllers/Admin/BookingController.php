<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmedMail;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Booking::with(['user', 'tutor'])
            ->latest();

        if ($request->filled('status')) {
            $query->where('payment_status', $request->status);
        }

        $bookings = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/bookings/index', [
            'bookings' => $bookings,
            'filter'   => $request->status ?? 'all',
        ]);
    }

    public function approve(Booking $booking): RedirectResponse
    {
        if ($booking->payment_status !== 'pending') {
            return back()->with('error', 'Only pending bookings can be approved.');
        }

        // Check if another booking for same tutor+slot is already confirmed
        $conflict = Booking::where('tutor_id', $booking->tutor_id)
            ->where('scheduled_at', $booking->scheduled_at)
            ->where('id', '!=', $booking->id)
            ->where('payment_status', 'confirmed')
            ->exists();

        if ($conflict) {
            return back()->with('error', 'Cannot approve — this slot is already confirmed for another student. Reject this booking first.');
        }

        $booking->update(['payment_status' => 'confirmed']);

        if ($booking->user) {
            Mail::to($booking->user->email)->send(new BookingConfirmedMail($booking));
        }

        return back()->with('success', 'Booking approved and confirmation email sent.');
    }

    public function reject(Booking $booking): RedirectResponse
    {
        $booking->update(['payment_status' => 'rejected']);

        return back()->with('success', 'Booking rejected.');
    }
}
