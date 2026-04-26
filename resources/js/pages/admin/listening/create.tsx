import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Listening Questions', href: '/admin/listening' },
    { title: 'Create', href: '#' },
];

export default function AdminListeningCreate() {
    const { data, setData, post, processing, errors } = useForm({
        youtube_video_id: '',
        title: '',
        text: 'Listen to the audio and answer the question.',
        options: ['', '', '', ''],
        correct_answer: 0,
    });

    const setOption = (index: number, value: string) => {
        const opts = [...data.options];
        opts[index] = value;
        setData('options', opts);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/listening');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Listening Question" />

            <div className="flex h-full flex-1 flex-col gap-6 max-w-2xl">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Add Listening Question</h1>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Question Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div className="space-y-2">
                                <Label>YouTube Video ID</Label>
                                <Input
                                    value={data.youtube_video_id}
                                    onChange={(e) => setData('youtube_video_id', e.target.value)}
                                    placeholder="e.g. qI2LxF5sR2c"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    The ID from the YouTube URL: youtube.com/watch?v=<strong>ID_HERE</strong>
                                </p>
                                <InputError message={errors.youtube_video_id} />
                            </div>

                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. IELTS Listening Practice Test 1"
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label>Question Text</Label>
                                <textarea
                                    className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    value={data.text}
                                    onChange={(e) => setData('text', e.target.value)}
                                    required
                                />
                                <InputError message={errors.text} />
                            </div>

                            <div className="space-y-2">
                                <Label>Options (1, 2, 3, 4)</Label>
                                {[1, 2, 3, 4].map((num, i) => (
                                    <div key={num} className="flex items-center gap-2">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                                            {num}
                                        </span>
                                        <Input
                                            value={data.options[i]}
                                            onChange={(e) => setOption(i, e.target.value)}
                                            placeholder={`Option ${num}`}
                                            required
                                        />
                                    </div>
                                ))}
                                <InputError message={(errors as any)['options.0'] || (errors as any).options} />
                            </div>

                            <div className="space-y-2">
                                <Label>Correct Answer</Label>
                                <select
                                    className="w-full rounded-md border border-input bg-background p-2 text-sm"
                                    value={data.correct_answer}
                                    onChange={(e) => setData('correct_answer', Number(e.target.value))}
                                >
                                    {[1, 2, 3, 4].map((num, i) => (
                                        <option key={i} value={i}>Option {num}</option>
                                    ))}
                                </select>
                                <InputError message={errors.correct_answer} />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    Create Question
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/listening">Cancel</Link>
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
