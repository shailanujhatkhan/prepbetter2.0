import { useState } from 'react';
import { router, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tutor', href: '/tutor' },
    { title: 'Availability', href: '/tutor/availability' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// "17:00" → "5:00pm",  "09:30" → "9:30am"
const to12h = (val: string): string => {
    const [hStr, mStr] = val.split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr ?? '0', 10);
    const period = h >= 12 ? 'pm' : 'am';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h}:${String(m).padStart(2, '0')}${period}`;
};

// "5:00pm" → "17:00" for isBooked comparison
const to24h = (slot: string): string => {
    const match = slot.trim().match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
    if (!match) return slot;
    let h = parseInt(match[1], 10);
    const m = match[2];
    const period = match[3].toLowerCase();
    if (period === 'pm' && h !== 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${m}`;
};

type Availability = Record<string, string[]>;

type BookedSlot = string; // ISO datetime string

type Props = {
    tutor: {
        id: number;
        name: string;
        specialization: string;
        availability: Availability | null;
    } | null;
    bookedSlots: BookedSlot[];
};

export default function TutorAvailability() {
    const { props } = usePage<any>();
    const { tutor, bookedSlots = [] }: Props = props;

    const [availability, setAvailability] = useState<Availability>(
        tutor?.availability ?? {}
    );
    const [newSlot, setNewSlot] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [flash, setFlash] = useState<string | null>(null);

    const addSlot = (day: string) => {
        const val = newSlot[day]?.trim();
        if (!val) return;
        const slot = to12h(val); // store as "5:00pm" not "17:00"
        if ((availability[day] ?? []).includes(slot)) return; // no duplicates
        setAvailability(prev => ({
            ...prev,
            [day]: [...(prev[day] ?? []), slot],
        }));
        setNewSlot(prev => ({ ...prev, [day]: '' }));
    };

    const removeSlot = (day: string, slot: string) => {
        setAvailability(prev => ({
            ...prev,
            [day]: (prev[day] ?? []).filter(s => s !== slot),
        }));
    };

    const isBooked = (day: string, slot: string): boolean => {
        // Normalize slot to 24h for comparison (handles both "5:00pm" and legacy "17:00")
        const slot24 = slot.match(/am|pm/i) ? to24h(slot) : slot;
        return bookedSlots.some(iso => {
            const d = new Date(iso);
            const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
            const time = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
            return dayName === day && time === slot24;
        });
    };

    const save = () => {
        setSaving(true);
        router.put(
            '/tutor/availability',
            { availability },
            {
                onSuccess: () => { setFlash('Availability saved!'); setSaving(false); },
                onError: () => { setFlash('Failed to save.'); setSaving(false); },
            }
        );
    };

    if (!tutor) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Availability" />
                <div className="p-6 text-muted-foreground">
                    No tutor profile linked to your account. Contact an admin.
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Availability" />

            <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manage Availability</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {tutor.name} · {tutor.specialization}
                    </p>
                </div>

                {flash && (
                    <div className={`rounded-lg border p-3 text-sm ${flash.includes('Failed') ? 'border-red-200 bg-red-50 text-red-800' : 'border-green-200 bg-green-50 text-green-800'}`}>
                        {flash}
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    {DAYS.map(day => (
                        <Card key={day}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">{day}</CardTitle>
                                <CardDescription className="text-xs">
                                    {(availability[day]?.length ?? 0)} slot(s) set
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">

                                <div className="flex flex-wrap gap-2 min-h-6">
                                    {(availability[day] ?? []).map(slot => {
                                        // Normalise display: legacy "17:00" → "5:00pm"
                                        const display = slot.match(/am|pm/i) ? slot : to12h(slot);
                                        return (
                                        <div key={slot} className="flex items-center gap-1">
                                            <Badge
                                                variant={isBooked(day, slot) ? 'default' : 'outline'}
                                                className="text-xs"
                                            >
                                                {display}
                                                {isBooked(day, slot) && <span className="ml-1 text-[10px]">booked</span>}
                                            </Badge>
                                            {!isBooked(day, slot) && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSlot(day, slot)}
                                                    className="text-muted-foreground hover:text-red-500 text-xs leading-none"
                                                    aria-label="Remove slot"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                        );
                                    })}
                                    {!(availability[day]?.length) && (
                                        <span className="text-xs text-muted-foreground">No slots</span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label htmlFor={`slot-${day}`} className="sr-only">Add time slot</Label>
                                        <Input
                                            id={`slot-${day}`}
                                            type="time"
                                            value={newSlot[day] ?? ''}
                                            onChange={e => setNewSlot(prev => ({ ...prev, [day]: e.target.value }))}
                                            className="text-sm"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addSlot(day)}
                                        disabled={!newSlot[day]}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button onClick={save} disabled={saving} className="self-start">
                    {saving ? 'Saving…' : 'Save Availability'}
                </Button>
            </div>
        </AppLayout>
    );
}
