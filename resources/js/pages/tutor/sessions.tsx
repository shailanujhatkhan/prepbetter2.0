import { Head } from '@inertiajs/react';
import { Video, Clock, CheckCircle, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Booking = {
    id: number;
    specialization: string;
    scheduled_at: string;
    payment_method: string;
    payment_status: 'pending' | 'confirmed';
    meet_link: string | null;
    student_name: string;
    student_email: string;
    user: { name: string; email: string } | null;
};

type Props = { bookings: Booking[] };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Sessions', href: '/tutor/sessions' },
];

const fmt = (dt: string) =>
    new Date(dt).toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long',
        day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
    });

const isUpcoming = (dt: string) => new Date(dt) > new Date();

export default function TutorSessions({ bookings }: Props) {
    const upcoming = bookings.filter((b) => isUpcoming(b.scheduled_at));
    const past     = bookings.filter((b) => !isUpcoming(b.scheduled_at));

    const renderCard = (b: Booking) => {
        const confirmed = b.payment_status === 'confirmed';
        const up = isUpcoming(b.scheduled_at);

        return (
            <Card key={b.id} className={up && confirmed ? 'border-primary/40' : ''}>
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {b.student_name}
                                <span className="text-muted-foreground font-normal text-xs">{b.student_email}</span>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {b.specialization} · {fmt(b.scheduled_at)}
                            </p>
                        </div>
                        <Badge
                            variant="outline"
                            className={`shrink-0 text-xs flex items-center gap-1 ${
                                confirmed
                                    ? 'border-green-400 text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-300'
                                    : 'border-amber-400 text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                        >
                            {confirmed
                                ? <><CheckCircle className="h-3 w-3" /> Confirmed</>
                                : <><Clock className="h-3 w-3" /> Pending</>
                            }
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    {confirmed && b.meet_link ? (
                        <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                                <Video className="h-4 w-4 text-green-700 dark:text-green-300 shrink-0" />
                                <span className="text-sm font-medium text-green-800 dark:text-green-200 shrink-0">Meet link:</span>
                                <span className="text-xs text-green-700 dark:text-green-400 font-mono truncate">{b.meet_link}</span>
                            </div>
                            <a href={b.meet_link} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="outline" className="shrink-0 border-green-400 text-green-700 hover:bg-green-100 dark:text-green-300">
                                    Join
                                </Button>
                            </a>
                        </div>
                    ) : confirmed && !b.meet_link ? (
                        <p className="text-xs text-muted-foreground">No Meet link generated for this booking.</p>
                    ) : (
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            Meet link will be available once payment is confirmed.
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Sessions" />

            <div className="flex h-full flex-1 flex-col gap-8 max-w-3xl mx-auto w-full">

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
                    <p className="text-muted-foreground text-sm mt-1">Booked speaking sessions assigned to you</p>
                </div>

                {bookings.length === 0 && (
                    <Card>
                        <CardContent className="py-16 text-center text-muted-foreground">
                            <Video className="h-10 w-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No sessions yet</p>
                            <p className="text-sm mt-1">Sessions will appear here once students book with you.</p>
                        </CardContent>
                    </Card>
                )}

                {upcoming.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Upcoming ({upcoming.length})
                        </h2>
                        {upcoming.map(renderCard)}
                    </div>
                )}

                {past.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Past ({past.length})
                        </h2>
                        {past.map(renderCard)}
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
