import { Head, Link, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Essay Reviews', href: '/tutor/reviews' },
    { title: 'Review', href: '#' },
];

const essayTypeLabels: Record<string, string> = {
    agree_disagree: 'Agree/Disagree',
    advantage_disadvantage: 'Advantage/Disadvantage',
    discussion: 'Discussion',
    problem_solution: 'Problem/Solution',
    two_part: 'Two-Part',
};

type Feedback = {
    id: number;
    evaluator_type: string;
    band_score: number | null;
    grammar_feedback: string | null;
    vocabulary_feedback: string | null;
    coherence_feedback: string | null;
    recommendations: string | null;
    evaluator: { name: string } | null;
};

type Submission = {
    id: number;
    content: string;
    word_count: number;
    created_at: string;
    user: { name: string; email: string };
    question: {
        title: string;
        type: string;
        chart_type: string | null;
        essay_type: string | null;
        image_path: string | null;
        prompt_text: string | null;
    };
    feedback: Feedback | null;
};

type Props = {
    submission: Submission;
};

export default function ReviewShow({ submission }: Props) {
    const existing = submission.feedback;

    const { data, setData, post, processing, errors } = useForm({
        band_score: existing?.band_score?.toString() || '',
        grammar_feedback: existing?.grammar_feedback || '',
        vocabulary_feedback: existing?.vocabulary_feedback || '',
        coherence_feedback: existing?.coherence_feedback || '',
        recommendations: existing?.recommendations || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/tutor/reviews/${submission.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review - ${submission.question.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Review Submission
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        By {submission.user.name} &middot;{' '}
                        {submission.word_count} words &middot;{' '}
                        {new Date(submission.created_at).toLocaleString()}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {/* Left: question and response */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                    {submission.question.title}
                                </CardTitle>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {submission.question.type === 'task1'
                                        ? 'Task 1 - Chart Description'
                                        : `Task 2 - ${essayTypeLabels[submission.question.essay_type || ''] || 'Essay'}`}
                                </p>
                            </CardHeader>
                            {submission.question.image_path &&
                                submission.question.type === 'task1' && (
                                    <CardContent className="pt-0">
                                        <img
                                            src={`/storage/${submission.question.image_path}`}
                                            alt={submission.question.title}
                                            className="h-auto w-full rounded-lg"
                                        />
                                    </CardContent>
                                )}
                            {submission.question.prompt_text &&
                                submission.question.type === 'task2' && (
                                    <CardContent className="pt-0">
                                        <div className="rounded-lg bg-muted/50 p-4 text-sm">
                                            <p className="whitespace-pre-wrap">
                                                {
                                                    submission.question
                                                        .prompt_text
                                                }
                                            </p>
                                        </div>
                                    </CardContent>
                                )}
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                    Student Response
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {submission.content}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: feedback form */}
                    <form onSubmit={submit} className="space-y-5">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                    {existing
                                        ? 'Update Feedback'
                                        : 'Provide Feedback'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="band_score">
                                        Band Score (0-9)
                                    </Label>
                                    <Input
                                        id="band_score"
                                        type="number"
                                        min="0"
                                        max="9"
                                        step="0.5"
                                        value={data.band_score}
                                        onChange={(e) =>
                                            setData(
                                                'band_score',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={errors.band_score} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="grammar">
                                        Grammar Feedback
                                    </Label>
                                    <textarea
                                        id="grammar"
                                        className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        value={data.grammar_feedback}
                                        onChange={(e) =>
                                            setData(
                                                'grammar_feedback',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.grammar_feedback}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vocabulary">
                                        Vocabulary Feedback
                                    </Label>
                                    <textarea
                                        id="vocabulary"
                                        className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        value={data.vocabulary_feedback}
                                        onChange={(e) =>
                                            setData(
                                                'vocabulary_feedback',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.vocabulary_feedback}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="coherence">
                                        Coherence & Cohesion
                                    </Label>
                                    <textarea
                                        id="coherence"
                                        className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        value={data.coherence_feedback}
                                        onChange={(e) =>
                                            setData(
                                                'coherence_feedback',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.coherence_feedback}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="recommendations">
                                        Recommendations
                                    </Label>
                                    <textarea
                                        id="recommendations"
                                        className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        value={data.recommendations}
                                        onChange={(e) =>
                                            setData(
                                                'recommendations',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.recommendations}
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button type="submit" disabled={processing}>
                                        {existing
                                            ? 'Update Feedback'
                                            : 'Submit Feedback'}
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/tutor/reviews">Back</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
