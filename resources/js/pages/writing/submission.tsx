import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Feedback = {
    id: number;
    evaluator_type: string;
    band_score: number | null;
    grammar_feedback: string | null;
    vocabulary_feedback: string | null;
    coherence_feedback: string | null;
    recommendations: string | null;
    evaluator: { name: string } | null;
    created_at: string;
};

type Submission = {
    id: number;
    content: string;
    word_count: number;
    created_at: string;
    question: {
        id: number;
        title: string;
        chart_type: string | null;
        type: string;
        image_path: string | null;
    };
    feedback: Feedback | null;
};

type Props = {
    submission: Submission;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Writing', href: '/writing' },
    { title: 'Submission', href: '#' },
];

export default function SubmissionView({ submission }: Props) {
    const fb = submission.feedback;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Submission" />

            <div className="flex h-full flex-1 flex-col gap-4">

                {/* HEADER */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {submission.question.title}
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Submitted {new Date(submission.created_at).toLocaleString()} &middot; {submission.word_count} words
                        </p>
                    </div>

                    <div className="flex gap-2">

                        {/* existing button */}
                        {submission.question.chart_type && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/writing/task1/${submission.question.chart_type}`}>
                                    More Questions
                                </Link>
                            </Button>
                        )}

                        {/* ✅ ADDED: AI FEEDBACK BUTTON (SAFE) */}
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/ai-feedback/${submission.id}`}>
                                AI Feedback
                            </Link>
                        </Button>

                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* LEFT SIDE */}
                    <div className="space-y-4">

                        {submission.question.image_path && (
                            <div className="rounded-lg border overflow-hidden">
                                <img
                                    src={`/storage/${submission.question.image_path}`}
                                    alt={submission.question.title}
                                    className="w-full h-auto"
                                />
                            </div>
                        )}

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                    Your Response
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {submission.content}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT SIDE */}
                    <div>

                        {fb ? (
                            <Card>

                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center justify-between">

                                        Feedback

                                        <div className="flex items-center gap-2">

                                            <Badge variant={fb.evaluator_type === 'ai' ? 'default' : 'secondary'}>
                                                {fb.evaluator_type === 'ai'
                                                    ? 'AI'
                                                    : `Tutor: ${fb.evaluator?.name}`}
                                            </Badge>

                                            {fb.band_score && (
                                                <Badge variant="outline" className="text-lg px-3 py-1">
                                                    Band {fb.band_score}
                                                </Badge>
                                            )}

                                        </div>

                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4 text-sm">

                                    {fb.grammar_feedback && (
                                        <div>
                                            <p className="font-medium mb-1">Grammar</p>
                                            <p className="text-muted-foreground">
                                                {fb.grammar_feedback}
                                            </p>
                                        </div>
                                    )}

                                    {fb.vocabulary_feedback && (
                                        <div>
                                            <p className="font-medium mb-1">Vocabulary</p>
                                            <p className="text-muted-foreground">
                                                {fb.vocabulary_feedback}
                                            </p>
                                        </div>
                                    )}

                                    {fb.coherence_feedback && (
                                        <div>
                                            <p className="font-medium mb-1">
                                                Coherence & Cohesion
                                            </p>
                                            <p className="text-muted-foreground">
                                                {fb.coherence_feedback}
                                            </p>
                                        </div>
                                    )}

                                    {fb.recommendations && (
                                        <div>
                                            <p className="font-medium mb-1">
                                                Recommendations
                                            </p>
                                            <p className="text-muted-foreground">
                                                {fb.recommendations}
                                            </p>
                                        </div>
                                    )}

                                </CardContent>

                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">
                                        No feedback yet.
                                    </p>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        A tutor will review your submission soon.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}