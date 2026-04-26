import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tutors', href: '/book-tutor' },
];

export default function TutorList({ type, tutors }: any) {
    const [selectedSlot, setSelectedSlot] = useState<Record<number, string>>({});
    const [selectedDate, setSelectedDate] = useState<Record<number, string>>({});

    const getSlots = (tutor: any, date: string): string[] => {
        try {
            const data =
                typeof tutor.availability === 'string'
                    ? JSON.parse(tutor.availability)
                    : tutor.availability;
            if (!data) return [];
            if (!date) return (Object.values(data) as string[][]).flat();
            const dayName = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
            return (data[dayName] ?? []) as string[];
        } catch {
            return [];
        }
    };

    // Convert "2pm" / "10am" → "14:00" / "10:00"
    const slotTo24h = (slot: string): string => {
        const match = slot.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
        if (!match) return slot;
        let h = parseInt(match[1], 10);
        const m = match[2] ? parseInt(match[2], 10) : 0;
        const period = match[3].toLowerCase();
        if (period === 'pm' && h !== 12) h += 12;
        if (period === 'am' && h === 12) h = 0;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const isSlotBooked = (tutor: any, date: string, slot: string): boolean => {
        if (!date || !slot) return false;
        const slot24 = slotTo24h(slot);
        return (tutor.bookings ?? []).some((b: any) => {
            const d = new Date(b.scheduled_at);
            const bDate = d.toISOString().split('T')[0];
            const bTime = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
            return bDate === date && bTime === slot24;
        });
    };

    const filteredTutors = (tutors ?? []).filter((tutor: any) =>
        tutor.specialization?.toLowerCase().includes(type?.toLowerCase())
    );

    const handleBooking = (tutor: any) => {
        if (!selectedSlot[tutor.id]) {
            alert('Please select a time slot first');
            return;
        }
        if (!selectedDate[tutor.id]) {
            alert('Please select a date first');
            return;
        }

        const scheduledAt = `${selectedDate[tutor.id]}T${slotTo24h(selectedSlot[tutor.id])}:00`;

        router.get('/payment-method', {
            tutorId: tutor.id,
            tutorName: tutor.name,
            specialization: tutor.specialization,
            selectedSlot: selectedSlot[tutor.id],
            selectedDate: selectedDate[tutor.id],
            scheduledAt,
        });
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tutors" />

            <div className="flex flex-col gap-8">

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {type?.toUpperCase()} Tutors
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Select a tutor, date, and available time slot
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {filteredTutors?.length === 0 && (
                        <p className="text-muted-foreground">No tutors available.</p>
                    )}

                    {filteredTutors?.map((tutor: any) => {
                        const date  = selectedDate[tutor.id] || '';
                        const slots = getSlots(tutor, date);

                        return (
                            <Card key={tutor.id} className="hover:shadow-md transition">

                                <CardHeader>
                                    <CardTitle className="text-lg">{tutor.name}</CardTitle>
                                    <CardDescription>
                                        {tutor.specialization} · ⭐ {tutor.rating ?? 'N/A'} · {tutor.experience} yrs
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-4">

                                    {/* Date picker */}
                                    <div className="space-y-1">
                                        <Label htmlFor={`date-${tutor.id}`} className="text-sm font-medium">
                                            Select Date
                                        </Label>
                                        <Input
                                            id={`date-${tutor.id}`}
                                            type="date"
                                            min={today}
                                            value={date}
                                            onChange={(e) => {
                                                setSelectedDate((prev) => ({ ...prev, [tutor.id]: e.target.value }));
                                                setSelectedSlot((prev) => ({ ...prev, [tutor.id]: '' }));
                                            }}
                                        />
                                    </div>

                                    {/* Time slots */}
                                    <div>
                                        <p className="text-sm font-medium mb-2">
                                            {date ? 'Available Time Slots' : 'Pick a date to see slots'}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {!date ? null : !slots.length ? (
                                                <p className="text-muted-foreground text-sm">No slots for this day</p>
                                            ) : (
                                                slots.map((slot: string, i: number) => {
                                                    const booked = isSlotBooked(tutor, date, slot);
                                                    const selected = selectedSlot[tutor.id] === slot;
                                                    return (
                                                        <button
                                                            key={i}
                                                            disabled={booked}
                                                            onClick={() =>
                                                                !booked && setSelectedSlot((prev) => ({
                                                                    ...prev,
                                                                    [tutor.id]: slot,
                                                                }))
                                                            }
                                                            className={`px-3 py-1 rounded-full text-sm border transition ${
                                                                booked
                                                                    ? 'bg-muted text-muted-foreground border-border cursor-not-allowed line-through'
                                                                    : selected
                                                                        ? 'bg-primary text-white border-primary'
                                                                        : 'bg-background text-foreground border-border hover:bg-muted'
                                                            }`}
                                                        >
                                                            {slot}{booked ? ' (booked)' : ''}
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleBooking(tutor)}
                                        disabled={!selectedSlot[tutor.id] || !date}
                                    >
                                        Confirm Booking
                                    </Button>

                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="fixed bottom-6 right-6">
                    <Button variant="secondary" onClick={() => window.history.back()}>
                        Back
                    </Button>
                </div>

            </div>
        </AppLayout>
    );
}
