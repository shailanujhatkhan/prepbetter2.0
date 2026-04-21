import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Tutors', href: '/book-tutor' },
];

export default function TutorList({ type, tutors }: any) {
  const [selectedSlot, setSelectedSlot] = useState<Record<number, string>>({});

  // ✅ clean helper (fixes red underline issue + improves structure)
  const getSlots = (tutor: any): string[] => {
    try {
      const data =
        typeof tutor.availability === 'string'
          ? JSON.parse(tutor.availability)
          : tutor.availability;

      return Object.values(data || {}).flat() as string[];
    } catch {
      return [];
    }
  };

  const filteredTutors = (tutors ?? []).filter((tutor: any) =>
    tutor.specialization?.toLowerCase().includes(type?.toLowerCase())
  );

  const handleBooking = (tutor: any) => {
    if (!selectedSlot[tutor.id]) {
      alert('Please select a slot first');
      return;
    }

    router.get('/payment-method', {
      tutorId: tutor.id,
      tutorName: tutor.name,
      specialization: tutor.specialization,
      selectedSlot: selectedSlot[tutor.id],
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tutors" />

      <div className="flex flex-col gap-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {type?.toUpperCase()} Tutors
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Select a tutor and available time slot
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {filteredTutors?.length === 0 && (
            <p className="text-muted-foreground">
              No tutors available.
            </p>
          )}

          {filteredTutors?.map((tutor: any) => {
            const slots = getSlots(tutor);

            return (
              <Card key={tutor.id} className="hover:shadow-md transition">

                <CardHeader>
                  <CardTitle className="text-lg">
                    {tutor.name}
                  </CardTitle>

                  <CardDescription>
                    {tutor.specialization} · ⭐ {tutor.rating ?? 'N/A'} · {tutor.experience} yrs
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">

                  {/* SLOTS */}
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Available Slots
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {!slots.length ? (
                        <p className="text-muted-foreground text-sm">
                          No slots available
                        </p>
                      ) : (
                        slots.map((slot: string, i: number) => (
                          <button
                            key={i}
                            onClick={() =>
                              setSelectedSlot((prev) => ({
                                ...prev,
                                [tutor.id]: slot,
                              }))
                            }
                            className={`
                              px-3 py-1 rounded-full text-sm border transition
                              ${
                                selectedSlot[tutor.id] === slot
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-background text-foreground border-border hover:bg-muted'
                              }
                            `}
                          >
                            {slot}
                          </button>
                        ))
                      )}

                    </div>
                  </div>

                  {/* ACTION */}
                  <Button onClick={() => handleBooking(tutor)}>
                    Confirm Booking
                  </Button>

                </CardContent>
              </Card>
            );
          })}
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