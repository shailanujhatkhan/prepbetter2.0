<!DOCTYPE html>
<html>
<head>
    <title>Booking Confirmed</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .body { border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; }
        .meet-link { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 16px; margin: 16px 0; }
        .meet-link a { color: #1d4ed8; word-break: break-all; }
        .detail { margin: 8px 0; }
        .label { font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="margin:0">✓ Booking Confirmed!</h2>
    </div>
    <div class="body">
        <p>Hello {{ $booking->student_name }},</p>
        <p>Your IELTS tutoring session has been successfully booked.</p>

        <div class="detail"><span class="label">Tutor:</span> {{ $booking->tutor?->name ?? 'Your Tutor' }}</div>
        <div class="detail"><span class="label">Subject:</span> {{ $booking->specialization }}</div>
        <div class="detail"><span class="label">Date & Time:</span> {{ \Carbon\Carbon::parse($booking->scheduled_at)->format('l, F j, Y \a\t g:i A') }}</div>
        <div class="detail"><span class="label">Payment:</span> {{ $booking->payment_method }} — Confirmed</div>

        @if($booking->meet_link)
        <div class="meet-link">
            <strong>Google Meet Link</strong><br>
            <a href="{{ $booking->meet_link }}">{{ $booking->meet_link }}</a>
            <p style="margin: 8px 0 0; font-size: 13px; color: #6b7280;">
                Join this link at the scheduled time for your session.
            </p>
        </div>
        @endif

        <p>Thank you for using our platform. Good luck with your IELTS preparation!</p>
    </div>
</body>
</html>
