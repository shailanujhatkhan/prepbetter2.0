import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Admin', href: '#' },
    { title: 'Bookings', href: '/admin/bookings' },
];

type Booking = {
    id: number;
    student_name: string;
    student_email: string;
    specialization: string;
    scheduled_at: string;
    payment_method: string;
    payment_status: string;
    transaction_number: string | null;
    reference_number: string | null;
    payment_note: string | null;
    meet_link: string | null;
    created_at: string;
    user: { name: string; email: string } | null;
    tutor: { name: string } | null;
};

type Props = {
    bookings: { data: Booking[]; current_page: number; last_page: number };
    filter: string;
};

const statusBadge: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
    pending:   { label: 'Pending',   class: 'border-amber-400 text-amber-700 bg-amber-50',  icon: <Clock className="h-3 w-3" /> },
    confirmed: { label: 'Confirmed', class: 'border-green-400 text-green-700 bg-green-50',  icon: <CheckCircle className="h-3 w-3" /> },
    rejected:  { label: 'Rejected',  class: 'border-red-400 text-red-700 bg-red-50',        icon: <XCircle className="h-3 w-3" /> },
};

const methodIcon: Record<string, string> = {
    Card: '💳',
    Bank: '🏦',
    bKash: '📱',
};

export default function AdminBookingsIndex({ bookings, filter }: Props) {
    const { props } = usePage<any>();
    const flash = (props as any).flash;

    const approve = (id: number) => {
        router.post(`/admin/bookings/${id}/approve`);
    };

    const reject = (id: number) => {
        if (!confirm('Reject this booking?')) return;
        router.post(`/admin/bookings/${id}/reject`);
    };

    const filters = ['all', 'pending', 'confirmed', 'rejected'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings" />

            <div className="flex h-full flex-1 flex-col gap-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Review and approve manual payment bookings
                        </p>
                    </div>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                        {flash.error}
                    </div>
                )}

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {filters.map((f) => (
                        <Link
                            key={f}
                            href={f === 'all' ? '/admin/bookings' : `/admin/bookings?status=${f}`}
                            className={`px-4 py-1.5 rounded-full text-sm border transition capitalize ${
                                filter === f || (f === 'all' && filter === 'all')
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background border-border hover:bg-muted'
                            }`}
                        >
                            {f}
                        </Link>
                    ))}
                </div>

                {/* List */}
                <div className="flex flex-col gap-3">
                    {bookings.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No bookings found.
                            </CardContent>
                        </Card>
                    ) : (
                        bookings.data.map((b) => {
                            const status = statusBadge[b.payment_status] ?? statusBadge['pending'];
                            const isPending = b.payment_status === 'pending';
                            const isManual = b.payment_method === 'Bank' || b.payment_method === 'bKash';

                            return (
                                <Card key={b.id} className={isPending && isManual ? 'border-amber-300' : ''}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-0.5">
                                                <CardTitle className="text-sm font-semibold">
                                                    {b.student_name}
                                                    <span className="text-muted-foreground font-normal ml-2 text-xs">{b.student_email}</span>
                                                </CardTitle>
                                                <p className="text-xs text-muted-foreground">
                                                    Tutor: <span className="font-medium text-foreground">{b.tutor?.name ?? '—'}</span>
                                                    {' · '}Subject: {b.specialization}
                                                    {' · '}Session: {new Date(b.scheduled_at).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <span className="text-base">{methodIcon[b.payment_method] ?? '💰'}</span>
                                                <Badge variant="outline" className={`text-xs flex items-center gap-1 ${status.class}`}>
                                                    {status.icon}
                                                    {status.label}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        {/* Transaction info — only for manual */}
                                        {isManual && (
                                            <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1">
                                                <p className="font-semibold text-sm flex items-center gap-1.5">
                                                    <CreditCard className="h-3.5 w-3.5" />
                                                    {b.payment_method} Transaction Details
                                                </p>
                                                <p>
                                                    <span className="font-medium">
                                                        {b.payment_method === 'Bank' ? 'Transaction ID:' : 'TrxID:'}
                                                    </span>{' '}
                                                    <span className="font-mono">{b.transaction_number ?? '—'}</span>
                                                </p>
                                                <p>
                                                    <span className="font-medium">
                                                        {b.payment_method === 'Bank' ? 'Reference / Journal:' : 'Sender Number:'}
                                                    </span>{' '}
                                                    {b.reference_number ?? '—'}
                                                </p>
                                                {b.payment_note && (
                                                    <p><span className="font-medium">Note:</span> {b.payment_note}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        {isPending && isManual && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => approve(b.id)}
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                                    onClick={() => reject(b.id)}
                                                >
                                                    <XCircle className="h-3.5 w-3.5 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        )}

                                        {b.meet_link && b.payment_status === 'confirmed' && (
                                            <p className="text-xs text-muted-foreground">
                                                Meet: <a href={b.meet_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{b.meet_link}</a>
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {bookings.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: bookings.last_page }, (_, i) => i + 1).map((page) => (
                            <Link
                                key={page}
                                href={`/admin/bookings?page=${page}${filter !== 'all' ? `&status=${filter}` : ''}`}
                                className={`px-3 py-1 rounded border text-sm ${bookings.current_page === page ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                            >
                                {page}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
