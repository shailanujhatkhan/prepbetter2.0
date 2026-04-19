import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Question = {
    id: number;
    title: string;
    difficulty: string;
    essay_type: string;
};

type Props = {
    essayType: string;
    questions: Question[];
};

const essayTypeLabels: Record<string, string> = {
    agree_disagree: 'Agree/Disagree',
    advantage_disadvantage: 'Advantage/Disadvantage',
    discussion: 'Discussion',
    problem_solution: 'Problem/Solution',
    two_part: 'Two-Part',
};

const difficultyColors: Record<string, { bg: string; text: string }> = {
    easy: { bg: 'bg-green-100', text: 'text-green-800' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    hard: { bg: 'bg-red-100', text: 'text-red-800' },
};

export default function Task2Questions({ essayType, questions }: Props) {
    const typeLabel =
        essayTypeLabels[essayType] ||
        essayType.replace(/_/g, ' ').toUpperCase();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Writing', href: '/writing' },
        { title: 'Task 2', href: '/writing/task2' },
        { title: typeLabel, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${typeLabel} Essays`} />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {typeLabel} Essays
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {questions.length}{' '}
                            {questions.length === 1 ? 'question' : 'questions'}{' '}
                            available
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/writing/task2">Back</Link>
                    </Button>
                </div>

                <div className="grid gap-3">
                    {questions.length === 0 ? (
                        <Card>
                            <CardHeader className="py-8 text-center">
                                <p className="text-muted-foreground">
                                    No questions available for this essay type
                                    yet.
                                </p>
                            </CardHeader>
                        </Card>
                    ) : (
                        questions.map((question) => {
                            const diffColor =
                                difficultyColors[question.difficulty] ||
                                difficultyColors.medium;

                            return (
                                <Link
                                    key={question.id}
                                    href={`/writing/task2/${question.id}/guided`}
                                    className="group"
                                >
                                    <Card className="transition-all group-hover:border-primary group-hover:shadow-md">
                                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs font-medium ${diffColor.bg} ${diffColor.text}`}
                                                    >
                                                        {question.difficulty
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            question.difficulty.slice(
                                                                1,
                                                            )}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-lg transition-colors group-hover:text-primary">
                                                    {question.title}
                                                </CardTitle>
                                            </div>
                                            <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                        </CardHeader>
                                    </Card>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
