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
    { title: 'Reading Questions', href: '/admin/reading' },
    { title: 'Create', href: '#' },
];

export default function AdminReadingCreate() {
    const { data, setData, post, processing, errors } = useForm({
        passage: '',
        question: 'Which option best summarizes the passage?',
        options: ['', '', '', ''],
        correct_answer: 'A',
        explanation: '',
        difficulty: 'medium',
        topic: '',
        is_active: true,
    });

    const setOption = (index: number, value: string) => {
        const opts = [...data.options];
        opts[index] = value;
        setData('options', opts);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/reading');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Reading Question" />

            <div className="flex h-full flex-1 flex-col gap-6 max-w-2xl">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Add Reading Question</h1>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Question Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div className="space-y-2">
                                <Label>Passage</Label>
                                <textarea
                                    className="min-h-[160px] w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    value={data.passage}
                                    onChange={(e) => setData('passage', e.target.value)}
                                    placeholder="Paste the reading passage here..."
                                    required
                                />
                                <InputError message={errors.passage} />
                            </div>

                            <div className="space-y-2">
                                <Label>Question</Label>
                                <Input
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    required
                                />
                                <InputError message={errors.question} />
                            </div>

                            <div className="space-y-2">
                                <Label>Options (A, B, C, D)</Label>
                                {['A', 'B', 'C', 'D'].map((letter, i) => (
                                    <div key={letter} className="flex items-center gap-2">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                                            {letter}
                                        </span>
                                        <Input
                                            value={data.options[i]}
                                            onChange={(e) => setOption(i, e.target.value)}
                                            placeholder={`Option ${letter}`}
                                            required
                                        />
                                    </div>
                                ))}
                                <InputError message={(errors as any)['options.0'] || (errors as any).options} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Correct Answer</Label>
                                    <select
                                        className="w-full rounded-md border border-input bg-background p-2 text-sm"
                                        value={data.correct_answer}
                                        onChange={(e) => setData('correct_answer', e.target.value)}
                                    >
                                        {['A', 'B', 'C', 'D'].map((l) => (
                                            <option key={l} value={l}>{l}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.correct_answer} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Difficulty</Label>
                                    <select
                                        className="w-full rounded-md border border-input bg-background p-2 text-sm"
                                        value={data.difficulty}
                                        onChange={(e) => setData('difficulty', e.target.value)}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                    <InputError message={errors.difficulty} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Topic (optional)</Label>
                                <Input
                                    value={data.topic}
                                    onChange={(e) => setData('topic', e.target.value)}
                                    placeholder="e.g. Environment, History, Technology"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Explanation (optional)</Label>
                                <textarea
                                    className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    value={data.explanation}
                                    onChange={(e) => setData('explanation', e.target.value)}
                                    placeholder="Why is this the correct answer?"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded"
                                />
                                <Label htmlFor="is_active">Active (visible to students)</Label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    Create Question
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/reading">Cancel</Link>
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
