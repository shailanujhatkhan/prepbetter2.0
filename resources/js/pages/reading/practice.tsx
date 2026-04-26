import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Question = {
    id: number;
    passage: string;
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string | null;
    difficulty: string;
    topic: string | null;
};

type Props = {
    question: Question;
    nextQuestionId: number | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reading', href: '/reading' },
    { title: 'Practice', href: '#' },
];

const optionLetters = ['A', 'B', 'C', 'D'];

const difficultyColor: Record<string, string> = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
};

export default function ReadingPractice({ question, nextQuestionId }: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const isCorrect = submitted && selected === question.correct_answer;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reading Practice" />

            <div className="flex h-full flex-1 flex-col gap-6 max-w-3xl mx-auto w-full">

                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Reading Practice</h1>
                        <div className="flex items-center gap-2 mt-1">
                            {question.topic && (
                                <span className="text-sm text-muted-foreground">{question.topic}</span>
                            )}
                            <Badge className={difficultyColor[question.difficulty] ?? ''} variant="outline">
                                {question.difficulty}
                            </Badge>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/reading">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            All Passages
                        </Link>
                    </Button>
                </div>

                {/* Passage */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Passage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{question.passage}</p>
                    </CardContent>
                </Card>

                {/* Question + MCQ */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">{question.question}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {question.options.map((option, index) => {
                            const letter = optionLetters[index];
                            const isThisCorrect = letter === question.correct_answer;
                            const isThisSelected = letter === selected;

                            let className = 'flex items-start gap-3 rounded-lg border p-3 text-sm transition-all cursor-pointer hover:bg-muted';

                            if (submitted) {
                                if (isThisCorrect) {
                                    className = 'flex items-start gap-3 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950 p-3 text-sm';
                                } else if (isThisSelected) {
                                    className = 'flex items-start gap-3 rounded-lg border-2 border-red-400 bg-red-50 dark:bg-red-950 p-3 text-sm opacity-80';
                                } else {
                                    className = 'flex items-start gap-3 rounded-lg border p-3 text-sm opacity-50 cursor-default';
                                }
                            } else if (isThisSelected) {
                                className = 'flex items-start gap-3 rounded-lg border-2 border-primary bg-primary/5 p-3 text-sm cursor-pointer';
                            }

                            return (
                                <div
                                    key={letter}
                                    className={className}
                                    onClick={() => !submitted && setSelected(letter)}
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                                        {letter}
                                    </span>
                                    <span className="flex-1">{option}</span>
                                    {submitted && isThisCorrect && (
                                        <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                                    )}
                                    {submitted && isThisSelected && !isThisCorrect && (
                                        <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    )}
                                </div>
                            );
                        })}

                        {/* Result */}
                        {submitted && (
                            <div className={`rounded-lg p-4 text-sm space-y-1 ${isCorrect ? 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'}`}>
                                <p className="font-semibold">
                                    {isCorrect ? 'Correct! Well done.' : `Incorrect. The correct answer is ${question.correct_answer}.`}
                                </p>
                                {question.explanation && (
                                    <p className="opacity-90">{question.explanation}</p>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                            {!submitted ? (
                                <Button
                                    onClick={() => setSubmitted(true)}
                                    disabled={selected === null}
                                >
                                    Submit Answer
                                </Button>
                            ) : nextQuestionId ? (
                                <Button asChild>
                                    <Link href={`/reading/${nextQuestionId}/practice`}>Next Question</Link>
                                </Button>
                            ) : (
                                <Button variant="outline" asChild>
                                    <Link href="/reading">All Passages</Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
