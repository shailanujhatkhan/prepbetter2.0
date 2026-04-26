import { useState } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Payment', href: '/payment-method' },
];

type Method = 'Card' | 'Bank' | 'bKash' | null;

type BookingResult = {
    tutor_name: string;
    specialization: string;
    scheduled_at: string;
    meet_link: string;
    payment_method: string;
    payment_status: string;
};

const BANK_INFO = {
    bank_name: 'Dutch-Bangla Bank Ltd.',
    account_name: 'IELTS Platform Ltd.',
    account_number: '1011 2345 6789 01',
    branch: 'Gulshan Branch, Dhaka',
    routing: '090274526',
};

const BKASH_INFO = {
    number: '01712-345678',
    type: 'Merchant / Send Money',
};

export default function PaymentMethod() {
    const { props } = usePage<any>();

    const [selectedMethod, setSelectedMethod] = useState<Method>(null);
    const [txn, setTxn] = useState({ transaction_number: '', reference_number: '', payment_note: '' });
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [booking, setBooking] = useState<BookingResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const tutorId      = props.tutorId;
    const tutorName    = props.tutorName;
    const specialization = props.specialization;
    const selectedSlot = props.selectedSlot;
    const selectedDate = props.selectedDate;
    const scheduledAt  = props.scheduledAt;

    const isManual = selectedMethod === 'Bank' || selectedMethod === 'bKash';

    const submit = async () => {
        if (!tutorId || !scheduledAt || !specialization || !selectedMethod) {
            setError('Missing booking data. Go back and try again.');
            return;
        }
        if (isManual && !txn.transaction_number.trim()) {
            setError('Transaction number is required.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

            const response = await fetch('/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    tutor_id: tutorId,
                    specialization,
                    scheduled_at: scheduledAt,
                    payment_method: selectedMethod,
                    ...(isManual ? txn : {}),
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Booking failed');

            setBooking({
                tutor_name: tutorName,
                specialization,
                scheduled_at: scheduledAt,
                meet_link: data.booking?.meet_link || '',
                payment_method: selectedMethod,
                payment_status: data.payment_status,
            });
            setConfirmed(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dt: string) => {
        try {
            return new Date(dt).toLocaleString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long',
                day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
            });
        } catch { return dt; }
    };

    const formatDate = (d: string) => {
        try {
            return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            });
        } catch { return d; }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Method" />

            <div className="flex flex-col gap-6">

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Payment Method</h1>
                    <p className="text-muted-foreground text-sm mt-1">Complete your booking</p>
                </div>

                <div className="max-w-2xl mx-auto w-full space-y-4">

                    {/* Booking summary */}
                    <Card>
                        <CardContent className="p-5 flex flex-col gap-2 text-sm">
                            {tutorName    && <p><span className="font-medium">Tutor:</span> <span className="text-muted-foreground">{tutorName}</span></p>}
                            {specialization && <p><span className="font-medium">Subject:</span> <span className="text-muted-foreground">{specialization}</span></p>}
                            {selectedDate && <p><span className="font-medium">Date:</span> <span className="text-muted-foreground">{formatDate(selectedDate)}</span></p>}
                            {selectedSlot && <p><span className="font-medium">Time:</span> <span className="text-muted-foreground">{selectedSlot}</span></p>}
                        </CardContent>
                    </Card>

                    {/* Method selector */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Choose Payment Method</CardTitle>
                            <CardDescription>Select one option to proceed</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">

                            {/* Card */}
                            <button
                                type="button"
                                onClick={() => setSelectedMethod('Card')}
                                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${selectedMethod === 'Card' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                            >
                                <span className="text-2xl">💳</span>
                                <div>
                                    <p className="font-medium text-sm">Pay with Card</p>
                                    <p className="text-xs text-muted-foreground">Instant confirmation</p>
                                </div>
                            </button>

                            {/* Bank */}
                            <button
                                type="button"
                                onClick={() => setSelectedMethod('Bank')}
                                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${selectedMethod === 'Bank' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                            >
                                <span className="text-2xl">🏦</span>
                                <div>
                                    <p className="font-medium text-sm">Bank Transfer</p>
                                    <p className="text-xs text-muted-foreground">Manual — pending admin approval</p>
                                </div>
                            </button>

                            {/* bKash */}
                            <button
                                type="button"
                                onClick={() => setSelectedMethod('bKash')}
                                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${selectedMethod === 'bKash' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                            >
                                <span className="text-2xl">📱</span>
                                <div>
                                    <p className="font-medium text-sm">bKash</p>
                                    <p className="text-xs text-muted-foreground">Manual — pending admin approval</p>
                                </div>
                            </button>
                        </CardContent>
                    </Card>

                    {/* Bank instructions */}
                    {selectedMethod === 'Bank' && (
                        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-blue-800 dark:text-blue-200">Bank Transfer Details</CardTitle>
                                <CardDescription className="text-blue-700 dark:text-blue-300 text-xs">
                                    Transfer to the account below, then fill in your transaction info.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-xs space-y-1 text-blue-900 dark:text-blue-100">
                                <p><span className="font-semibold">Bank:</span> {BANK_INFO.bank_name}</p>
                                <p><span className="font-semibold">Account Name:</span> {BANK_INFO.account_name}</p>
                                <p><span className="font-semibold">Account Number:</span> {BANK_INFO.account_number}</p>
                                <p><span className="font-semibold">Branch:</span> {BANK_INFO.branch}</p>
                                <p><span className="font-semibold">Routing Number:</span> {BANK_INFO.routing}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* bKash instructions */}
                    {selectedMethod === 'bKash' && (
                        <Card className="border-pink-200 bg-pink-50 dark:bg-pink-950 dark:border-pink-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-pink-800 dark:text-pink-200">bKash Payment Details</CardTitle>
                                <CardDescription className="text-pink-700 dark:text-pink-300 text-xs">
                                    Send money to the number below, then fill in your transaction info.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-xs space-y-1 text-pink-900 dark:text-pink-100">
                                <p><span className="font-semibold">bKash Number:</span> {BKASH_INFO.number}</p>
                                <p><span className="font-semibold">Type:</span> {BKASH_INFO.type}</p>
                                <p className="pt-1 text-pink-700 dark:text-pink-300">
                                    Open bKash app → Send Money → Enter number → Complete payment → Copy the TrxID shown on screen.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Transaction form — manual only */}
                    {isManual && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Transaction Information</CardTitle>
                                <CardDescription className="text-xs">
                                    {selectedMethod === 'Bank'
                                        ? 'Enter your bank transaction ID and journal/reference number from your bank receipt.'
                                        : 'Enter the TrxID shown in your bKash confirmation message.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="txn_no">
                                        {selectedMethod === 'Bank' ? 'Bank Transaction ID' : 'bKash TrxID'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="txn_no"
                                        placeholder={selectedMethod === 'Bank' ? 'e.g. TXN20240422001234' : 'e.g. BK24042212345'}
                                        value={txn.transaction_number}
                                        onChange={(e) => setTxn(p => ({ ...p, transaction_number: e.target.value }))}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {selectedMethod === 'Bank'
                                            ? 'Found on your bank receipt or online banking confirmation.'
                                            : 'Found in the bKash SMS or app notification after payment.'}
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="ref_no">
                                        {selectedMethod === 'Bank' ? 'Journal / Reference Number' : 'Sender bKash Number'} (optional)
                                    </Label>
                                    <Input
                                        id="ref_no"
                                        placeholder={selectedMethod === 'Bank' ? 'e.g. JNL-2024-09871' : 'e.g. 01712-345678'}
                                        value={txn.reference_number}
                                        onChange={(e) => setTxn(p => ({ ...p, reference_number: e.target.value }))}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {selectedMethod === 'Bank'
                                            ? 'The journal or reference number from your bank statement.'
                                            : 'The bKash number you sent money from.'}
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="note">Additional Note (optional)</Label>
                                    <textarea
                                        id="note"
                                        className="w-full rounded-md border border-input bg-background p-3 text-sm resize-none min-h-15 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        placeholder="Any extra info for the admin..."
                                        value={txn.payment_note}
                                        onChange={(e) => setTxn(p => ({ ...p, payment_note: e.target.value }))}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
                    )}

                    {/* Submit */}
                    {selectedMethod && (
                        <Button
                            className="w-full"
                            onClick={submit}
                            disabled={loading || (isManual && !txn.transaction_number.trim())}
                        >
                            {loading
                                ? 'Submitting...'
                                : selectedMethod === 'Card'
                                    ? 'Confirm & Pay'
                                    : 'Submit for Approval'}
                        </Button>
                    )}
                </div>

                <div className="fixed bottom-6 right-6">
                    <Button variant="secondary" onClick={() => window.history.back()}>Back</Button>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Dialog open={confirmed} onOpenChange={() => {}}>
                <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className={`flex items-center gap-2 ${booking?.payment_status === 'confirmed' ? 'text-green-700' : 'text-amber-600'}`}>
                            {booking?.payment_status === 'confirmed' ? '✓ Booking Confirmed!' : '⏳ Awaiting Approval'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 text-sm">

                        {booking?.payment_status === 'pending' && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800 space-y-1">
                                <p className="font-semibold">Payment under review</p>
                                <p className="text-xs">
                                    Admin will verify your {booking.payment_method} transaction and approve within 24 hours.
                                    You will receive a confirmation email once approved.
                                </p>
                            </div>
                        )}

                        <div className={`rounded-lg border p-4 space-y-2 ${booking?.payment_status === 'confirmed' ? 'bg-green-50 border-green-200' : 'bg-muted'}`}>
                            {booking?.tutor_name     && <p><span className="font-medium">Tutor:</span> {booking.tutor_name}</p>}
                            {booking?.specialization && <p><span className="font-medium">Subject:</span> {booking.specialization}</p>}
                            {booking?.scheduled_at   && <p><span className="font-medium">Session:</span> {formatDateTime(booking.scheduled_at)}</p>}
                            {booking?.payment_method && (
                                <p>
                                    <span className="font-medium">Payment:</span> {booking.payment_method}{' '}
                                    <Badge variant={booking.payment_status === 'confirmed' ? 'default' : 'outline'} className="ml-1 text-xs">
                                        {booking.payment_status === 'confirmed' ? 'Confirmed' : 'Pending Approval'}
                                    </Badge>
                                </p>
                            )}
                        </div>

                        {booking?.payment_status === 'confirmed' && booking?.meet_link && (
                            <div className="rounded-lg border p-4 space-y-2">
                                <p className="font-medium">Google Meet Link</p>
                                <a
                                    href={booking.meet_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline break-all text-xs"
                                >
                                    {booking.meet_link}
                                </a>
                            </div>
                        )}

                        <Button className="w-full" asChild>
                            <Link href="/dashboard">Back to Dashboard</Link>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
