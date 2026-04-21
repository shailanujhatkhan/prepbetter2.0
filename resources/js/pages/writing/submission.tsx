import { Head, Link, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';

type Feedback = {
    id: number;
    evaluator_type: string;
    band_score: number | null;
    grammar_feedback: string | null;

    grammar_breakdown?: {
        articles: number;
        tenses: number;
        prepositions: number;
    } | null;

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

export default function SubmissionView({ submission: initialSubmission }: Props) {
    const { props } = usePage<any>();
    const [feedback, setFeedback] = useState<Feedback | null>(initialSubmission.feedback);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateFeedback = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/ai-feedback/${initialSubmission.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': props.csrf_token || '',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to generate feedback');
            }

            const data = await response.json();
            setFeedback(data.feedback);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error generating feedback:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Submission" />

            <div className="flex h-full flex-1 flex-col gap-4">

                {/* HEADER */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {initialSubmission.question.title}
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Submitted {new Date(initialSubmission.created_at).toLocaleString()} &middot; {initialSubmission.word_count} words
                        </p>
                    </div>

                    <div className="flex gap-2">

                        {initialSubmission.question.chart_type && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/writing/task1/${initialSubmission.question.chart_type}`}>
                                    More Questions
                                </Link>
                            </Button>
                        )}

                        {/* AI FEEDBACK BUTTON - GENERATES ON SAME PAGE */}
                        {!feedback && (
                            <Button
                                onClick={generateFeedback}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Generating...' : 'AI Feedback'}
                            </Button>
                        )}

                    </div>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                        <p className="font-medium">Error generating feedback</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* MAIN GRID */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* LEFT SIDE */}
                    <div className="space-y-4">

                        {initialSubmission.question.image_path && (
                            <div className="rounded-lg border overflow-hidden">
                                <img
                                    src={`/storage/${initialSubmission.question.image_path}`}
                                    alt={initialSubmission.question.title}
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
                                    {initialSubmission.content}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT SIDE */}
                    <div>

                        {feedback ? (
                            <Card>

                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center justify-between">

                                        Feedback

                                        <div className="flex items-center gap-2">

                                            <Badge variant={feedback.evaluator_type === 'ai' ? 'default' : 'secondary'}>
                                                {feedback.evaluator_type === 'ai'
                                                    ? 'AI'
                                                    : `Tutor: ${feedback.evaluator?.name}`}
                                            </Badge>

                                            {feedback.band_score && (
                                                <Badge variant="outline" className="text-lg px-3 py-1">
                                                    Band {feedback.band_score}
                                                </Badge>
                                            )}

                                        </div>

                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4 text-sm">

                                    {/* Grammar */}
                                    {feedback.grammar_feedback && (
                                        <div>
                                            <p className="font-medium mb-1">Grammar</p>
                                            <p className="text-muted-foreground">
                                                {feedback.grammar_feedback}
                                            </p>
                                        </div>
                                    )}

                                    {/* Grammar Breakdown */}
                                    {feedback.grammar_breakdown && (
                                        <div>
                                            <p className="font-medium mb-1">Grammar Breakdown</p>
                                            <p className="text-muted-foreground">
                                                Articles: {feedback.grammar_breakdown.articles ?? 0} <br />
                                                Tenses: {feedback.grammar_breakdown.tenses ?? 0} <br />
                                                Prepositions: {feedback.grammar_breakdown.prepositions ?? 0}
                                            </p>
                                        </div>
                                    )}

                                    {/* Vocabulary */}
                                    {feedback.vocabulary_feedback && (
                                        <div>
                                            <p className="font-medium mb-1">Vocabulary</p>
                                            <p className="text-muted-foreground">
                                                {feedback.vocabulary_feedback}
                                            </p>
                                        </div>
                                    )}

                                    {/* Coherence */}
                                    {feedback.coherence_feedback && (
                                        <div>
                                            <p className="font-medium mb-1">
                                                Coherence & Cohesion
                                            </p>
                                            <p className="text-muted-foreground">
                                                {feedback.coherence_feedback}
                                            </p>
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    {feedback.recommendations && (
                                        <div>
                                            <p className="font-medium mb-1">
                                                Recommendations
                                            </p>
                                            <p className="text-muted-foreground">
                                                {feedback.recommendations}
                                            </p>
                                        </div>
                                    )}

                                    {/* VIEW DETAILED FEEDBACK BUTTON */}
                                    {feedback.evaluator_type === 'ai' && (
                                        <div className="pt-4 text-center">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    window.location.href = `/ai-feedback/${initialSubmission.id}`
                                                }
                                            >
                                                View Detailed Feedback
                                            </Button>
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
                                        A tutor will review your submission soon or Click "AI Feedback" to generate AI feedback instantly.
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
