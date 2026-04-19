import { Head, useForm } from '@inertiajs/react';
import { Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Question = {
    id: number;
    title: string;
    prompt_text: string | null;
    chart_type: string;
    image_path: string | null;
    difficulty: string;
    hints: {
        questions?: string[];
        verbs?: string[];
        adverbs?: string[];
        sentence_structures?: string[];
    } | null;
};

type Props = {
    question: Question;
};

const chartLabels: Record<string, string> = {
    bar_graph: 'Bar Graph',
    line_graph: 'Line Graph',
    pie_chart: 'Pie Chart',
    map: 'Map',
    process_diagram: 'Process Diagram',
};

export default function Task1Practice({ question }: Props) {
    const [showHints, setShowHints] = useState(false);
    const { data, setData, post, processing, errors } = useForm({ content: '' });

    const wordCount = data.content.trim() ? data.content.trim().split(/\s+/).length : 0;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Writing', href: '/writing' },
        { title: 'Task 1', href: '/writing/task1' },
        { title: chartLabels[question.chart_type] || question.chart_type, href: `/writing/task1/${question.chart_type}` },
        { title: question.title, href: '#' },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/writing/${question.id}/submit`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={question.title} />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{question.title}</h1>
                        {question.prompt_text && (
                            <p className="text-muted-foreground mt-1">{question.prompt_text}</p>
                        )}
                    </div>
                    {question.hints && (
                        <Button
                            variant={showHints ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowHints(!showHints)}
                        >
                            <Lightbulb className="h-4 w-4" />
                            Hints
                        </Button>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Left: Image */}
                    <div>
                        {question.image_path ? (
                            <div className="rounded-lg border bg-muted/30 overflow-hidden">
                                <img
                                    src={`/storage/${question.image_path}`}
                                    alt={question.title}
                                    className="w-full h-auto"
                                />
                            </div>
                        ) : (
                            <div className="rounded-lg border bg-muted/30 flex items-center justify-center h-64">
                                <p className="text-muted-foreground">No image available</p>
                            </div>
                        )}

                        {/* Hints panel */}
                        {showHints && question.hints && (
                            <Card className="mt-4">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Writing Hints</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    {question.hints.questions && (
                                        <div>
                                            <p className="font-medium mb-1">Ask yourself:</p>
                                            <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                                                {question.hints.questions.map((q, i) => <li key={i}>{q}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {question.hints.verbs && (
                                        <div>
                                            <p className="font-medium mb-1">Useful verbs:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {question.hints.verbs.map((v) => <Badge key={v} variant="secondary">{v}</Badge>)}
                                            </div>
                                        </div>
                                    )}
                                    {question.hints.adverbs && (
                                        <div>
                                            <p className="font-medium mb-1">Useful adverbs:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {question.hints.adverbs.map((a) => <Badge key={a} variant="secondary">{a}</Badge>)}
                                            </div>
                                        </div>
                                    )}
                                    {question.hints.sentence_structures && (
                                        <div>
                                            <p className="font-medium mb-1">Sentence structures:</p>
                                            <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground italic">
                                                {question.hints.sentence_structures.map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right: Writing area */}
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div className="flex-1">
                            <textarea
                                className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 w-full min-h-[400px] rounded-md border p-4 text-sm outline-none focus-visible:ring-[3px] resize-none"
                                placeholder="Write your report here... (aim for 150+ words)"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                            />
                            <InputError message={errors.content} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-medium ${wordCount >= 150 ? 'text-green-600' : wordCount >= 100 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                                    {wordCount} words
                                </span>
                                {wordCount > 0 && wordCount < 150 && (
                                    <span className="text-xs text-muted-foreground">
                                        (aim for 150+)
                                    </span>
                                )}
                            </div>
                            <Button type="submit" disabled={processing || wordCount < 10}>
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
