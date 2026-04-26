import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Question = {
    id: number;
    youtube_video_id: string;
    title: string;
    text: string;
    options: string[];
    correct_answer: number;
};

type Props = {
    questions: Question[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Listening', href: '/listening' },
];

export default function Listening({ questions }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const current = questions[currentIndex];

    const handleNext = () => {
        setCurrentIndex((i) => i + 1);
        setSelectedAnswer(null);
        setSubmitted(false);
    };

    const handlePrev = () => {
        setCurrentIndex((i) => i - 1);
        setSelectedAnswer(null);
        setSubmitted(false);
    };

    const isCorrect = submitted && selectedAnswer === current.correct_answer;

    if (!questions.length) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Listening" />
                <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No listening questions available.</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Listening Practice" />

            <div className="flex h-full flex-1 flex-col gap-6 max-w-3xl mx-auto w-full">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Listening Practice</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Watch the video then answer the question below
                        </p>
                    </div>
                    <Badge variant="outline">
                        {currentIndex + 1} / {questions.length}
                    </Badge>
                </div>

                {/* YouTube Embed */}
                <div className="rounded-xl overflow-hidden border bg-black aspect-video w-full">
                    <iframe
                        key={current.youtube_video_id}
                        src={`https://www.youtube.com/embed/${current.youtube_video_id}?rel=0`}
                        title={current.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>

                {/* Question Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">{current.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{current.text}</p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {current.options.map((option, index) => {
                            let variant = 'border bg-background hover:bg-muted cursor-pointer';

                            if (submitted) {
                                if (index === current.correct_answer) {
                                    variant = 'border-2 border-green-500 bg-green-50 dark:bg-green-950';
                                } else if (index === selectedAnswer) {
                                    variant = 'border-2 border-red-400 bg-red-50 dark:bg-red-950';
                                } else {
                                    variant = 'border bg-muted opacity-60 cursor-default';
                                }
                            } else if (selectedAnswer === index) {
                                variant = 'border-2 border-primary bg-primary/5 cursor-pointer';
                            }

                            return (
                                <div
                                    key={index}
                                    onClick={() => !submitted && setSelectedAnswer(index)}
                                    className={`flex items-center gap-3 rounded-lg p-3 text-sm transition-all ${variant}`}
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="flex-1">{option}</span>
                                    {submitted && index === current.correct_answer && (
                                        <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                    )}
                                    {submitted && index === selectedAnswer && index !== current.correct_answer && (
                                        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                                    )}
                                </div>
                            );
                        })}

                        {/* Result message */}
                        {submitted && (
                            <div className={`rounded-lg p-3 text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                {isCorrect
                                    ? 'Correct! Well done.'
                                    : `Incorrect. The correct answer is "${current.options[current.correct_answer]}".`}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>

                            <div className="flex gap-2">
                                {!submitted && (
                                    <Button
                                        size="sm"
                                        onClick={() => setSubmitted(true)}
                                        disabled={selectedAnswer === null}
                                    >
                                        Submit Answer
                                    </Button>
                                )}
                                {submitted && currentIndex < questions.length - 1 && (
                                    <Button size="sm" onClick={handleNext}>
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                )}
                                {submitted && currentIndex === questions.length - 1 && (
                                    <Badge variant="secondary" className="px-3 py-1.5">
                                        All questions done!
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}