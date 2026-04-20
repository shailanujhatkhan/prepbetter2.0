import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TutorList({ type, tutors }: any) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const filteredTutors = (tutors ?? []).filter((tutor: any) =>
    tutor.specialization?.toLowerCase().includes(type?.toLowerCase())
  );

  const handleBooking = (tutor: any) => {
    if (!selectedSlot) {
      alert("Please select a slot first");
      return;
    }

    // 
    router.get('/payment-method', {
      tutorId: tutor.id,
      tutorName: tutor.name,
      specialization: tutor.specialization,
      selectedSlot,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-8">

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {type?.toUpperCase()} Tutors
        </h1>
        <p className="text-muted-foreground text-sm">
          Select a tutor and available time slot
        </p>
      </div>

      <div className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2">

        {filteredTutors?.length === 0 && (
          <p className="text-muted-foreground">
            No tutors available.
          </p>
        )}

        {filteredTutors?.map((tutor: any) => (
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

              <div>
                <p className="text-sm font-medium mb-2">
                  Available Slots
                </p>

                <div className="flex flex-wrap gap-2">

                  {(() => {
                    try {
                      const data =
                        typeof tutor.availability === "string"
                          ? JSON.parse(tutor.availability)
                          : tutor.availability;

                      const slots = Object.values(data || {}).flat();

                      if (!slots.length) {
                        return (
                          <p className="text-muted-foreground text-sm">
                            No slots available
                          </p>
                        );
                      }

                      return slots.map((slot: string, i: number) => {
                        const key = `${tutor.id}-${slot}`;

                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedSlot(key)}
                            className={`
                              px-3 py-1 rounded-full text-sm border transition
                              ${
                                selectedSlot === key
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-muted"
                              }
                            `}
                          >
                            {slot}
                          </button>
                        );
                      });

                    } catch {
                      return (
                        <p className="text-muted-foreground text-sm">
                          Invalid availability
                        </p>
                      );
                    }
                  })()}

                </div>
              </div>

              <button
                onClick={() => handleBooking(tutor)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Confirm Booking
              </button>

            </CardContent>
          </Card>
        ))}
      </div>

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
