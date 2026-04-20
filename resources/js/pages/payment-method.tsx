import { router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PaymentMethod() {
  const { props } = usePage<any>();

  const tutorId = props.tutorId;
  const tutorName = props.tutorName;
  const specialization = props.specialization;
  const selectedSlot = props.selectedSlot;

  const createBooking = (method: string) => {
    if (!tutorId || !selectedSlot || !specialization) {
      console.error('Missing booking data');
      return;
    }

    router.post('/bookings', {
      tutor_id: tutorId,
      specialization: specialization,
      scheduled_at: selectedSlot,
      payment_method: method,
    }, {
      onSuccess: () => {
        router.visit('/book-tutor');
      },
      onError: (errors) => {
        console.error('Booking failed:', errors);
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 p-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Payment Method
        </h1>
        <p className="text-muted-foreground text-sm">
          Complete your booking with a payment option
        </p>
      </div>

      {/* SELECTED INFO */}
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        {tutorName && (
          <p>
            <span className="font-medium text-black">Tutor:</span> {tutorName}
          </p>
        )}

        {specialization && (
          <p>
            <span className="font-medium text-black">Subject:</span> {specialization}
          </p>
        )}

        {selectedSlot && (
          <p>
            <span className="font-medium text-black">Slot:</span> {selectedSlot}
          </p>
        )}
      </div>

      {/* PAYMENT CARD */}
      <div className="flex justify-center">
        <Card className="w-[520px] hover:shadow-md transition">

          <CardHeader>
            <CardTitle>Choose Payment Method</CardTitle>
            <CardDescription>
              Select how you want to complete your booking
            </CardDescription>
          </CardHeader>

          <CardContent className="flex gap-4">

            <button
              onClick={() => createBooking("Bkash")}
              className="flex-1 bg-primary text-white py-3 rounded-lg hover:opacity-90 transition"
            >
              Bkash
            </button>

            <button
              onClick={() => createBooking("Bank Transfer")}
              className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Bank Transfer
            </button>

          </CardContent>

        </Card>
      </div>

      {/* BACK */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => router.visit('/book-tutor')}
          className="bg-gray-200 px-4 py-2 rounded-lg text-gray-900 font-semibold hover:bg-gray-300"
        >
          Back
        </button>
      </div>

    </div>
  );
}