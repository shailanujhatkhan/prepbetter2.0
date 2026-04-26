import { Head, Link } from '@inertiajs/react';
import { CalendarCheck, Clock, CheckCircle, XCircle, Video } from 'lucide-react';
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
    payment_status: 'pending' | 'confirmed' | 'rejected';
    meet_link: string | null;
    tutor: { name: string } | null;
};

type Props = { bookings: Booking[] };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Bookings', href: '/my-bookings' },
];

const statusConfig = {
    confirmed: { label: 'Confirmed', icon: CheckCircle, cls: 'border-green-400 text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-300' },
    pending:   { label: 'Pending Approval', icon: Clock, cls: 'border-amber-400 text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300' },
    rejected:  { label: 'Rejected', icon: XCircle, cls: 'border-red-400 text-red-700 bg-red-50 dark:bg-red-950 dark:text-red-300' },
};

const methodIcon: Record<string, string> = { Card: '💳', Bank: '🏦', bKash: '📱' };

const fmt = (dt: string) =>
    new Date(dt).toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long',
        day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
    });

const isUpcoming = (dt: string) => new Date(dt) > new Date();

export default function MyBookings({ bookings }: Props) {
    const upcoming = bookings.filter((b) => isUpcoming(b.scheduled_at) && b.payment_status !== 'rejected');
    const past     = bookings.filter((b) => !isUpcoming(b.scheduled_at) || b.payment_status === 'rejected');

    const renderCard = (b: Booking) => {
        const status = statusConfig[b.payment_status];
        const StatusIcon = status.icon;
        const up = isUpcoming(b.scheduled_at) && b.payment_status !== 'rejected';

        return (
            <Card key={b.id} className={up ? 'border-primary/30' : ''}>
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <CardTitle className="text-sm font-semibold">
                                {b.tutor?.name ?? 'Tutor'} — {b.specialization}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {fmt(b.scheduled_at)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span>{methodIcon[b.payment_method] ?? '💰'}</span>
                            <Badge variant="outline" className={`text-xs flex items-center gap-1 ${status.cls}`}>
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                {b.payment_status === 'confirmed' && b.meet_link && (
                    <CardContent className="pt-0">
                        <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                                <Video className="h-4 w-4 shrink-0" />
                                <span className="font-medium">Google Meet</span>
                                <span className="text-xs text-green-600 dark:text-green-400 font-mono break-all">{b.meet_link}</span>
                            </div>
                            <a
                                href={b.meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button size="sm" variant="outline" className="shrink-0 border-green-400 text-green-700 hover:bg-green-100">
                                    Join
                                </Button>
                            </a>
                        </div>
                    </CardContent>
                )}

                {b.payment_status === 'pending' && (
                    <CardContent className="pt-0">
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            Payment under review. Admin will confirm within 24 hours.
                        </p>
                    </CardContent>
                )}
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookings" />

            <div className="flex h-full flex-1 flex-col gap-8 max-w-3xl mx-auto w-full">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
                        <p className="text-muted-foreground text-sm mt-1">Your speaking sessions with tutors</p>
                    </div>
                    <Button asChild>
                        <Link href="/speaking">
                            <CalendarCheck className="h-4 w-4 mr-2" />
                            Book New Session
                        </Link>
                    </Button>
                </div>

                {bookings.length === 0 && (
                    <Card>
                        <CardContent className="py-16 text-center text-muted-foreground">
                            <CalendarCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No bookings yet</p>
                            <p className="text-sm mt-1">Book a speaking session with a tutor to get started.</p>
                            <Button className="mt-4" asChild>
                                <Link href="/speaking">Book a Session</Link>
                            </Button>
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
                            Past / Rejected ({past.length})
                        </h2>
                        {past.map(renderCard)}
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
