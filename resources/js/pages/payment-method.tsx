import { router, usePage, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Payment', href: '/payment-method' },
];

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
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Payment Method" />

      <div className="flex flex-col gap-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Payment Method
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Complete your booking with a payment option
          </p>
        </div>

        {/* INFO CARD */}
        <div className="max-w-2xl mx-auto w-full">
          <Card>

            <CardContent className="p-6 flex flex-col gap-3 text-sm">

              {tutorName && (
                <p>
                  <span className="font-medium">Tutor:</span>{' '}
                  <span className="text-muted-foreground">{tutorName}</span>
                </p>
              )}

              {specialization && (
                <p>
                  <span className="font-medium">Subject:</span>{' '}
                  <span className="text-muted-foreground">{specialization}</span>
                </p>
              )}

              {selectedSlot && (
                <p>
                  <span className="font-medium">Slot:</span>{' '}
                  <span className="text-muted-foreground">{selectedSlot}</span>
                </p>
              )}

            </CardContent>
          </Card>
        </div>

        {/* PAYMENT CARD */}
        <div className="max-w-2xl mx-auto w-full">
          <Card className="hover:shadow-md transition">

            <CardHeader>
              <CardTitle>Choose Payment Method</CardTitle>
              <CardDescription>
                Select how you want to complete your booking
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">

              <Button onClick={() => createBooking("Card")}>
                Pay with Card
              </Button>

            </CardContent>

          </Card>
        </div>

        {/* BACK BUTTON */}
        <div className="fixed bottom-6 right-6">
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </div>

      </div>
    </AppLayout>
  );
}