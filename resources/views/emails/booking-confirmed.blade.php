<!DOCTYPE html>
<html>
<head>
    <title>Booking Confirmed</title>
</head>
<body>
    <h2>Booking Confirmed 🎉</h2>

    <p>Hello {{ $booking->student_name }},</p>

    <p>Your booking has been successfully confirmed.</p>

    <p>
        <strong>Tutor ID:</strong> {{ $booking->tutor_id }} <br>
        <strong>Subject:</strong> {{ $booking->specialization }} <br>
        <strong>Scheduled At:</strong> {{ $booking->scheduled_at }} <br>
        <strong>Payment Method:</strong> {{ $booking->payment_method }}
    </p>

    <p>Thank you for using our platform!</p>
</body>
</html>