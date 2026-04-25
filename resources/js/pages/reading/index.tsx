import { Head, Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Question = {
    id: number;
    question: string;
    difficulty: string;
    topic: string | null;
};

type Props = {
    questions: Question[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reading', href: '/reading' },
];

const difficultyColor: Record<string, string> = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
};

export default function ReadingIndex({ questions }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reading Practice" />

            <div className="flex h-full flex-1 flex-col gap-6">

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Reading Practice</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Read each passage and select the best summary
                    </p>
                </div>

                {questions.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center">
                        <p className="text-muted-foreground">No reading questions available yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {questions.map((q) => (
                            <Link key={q.id} href={`/reading/${q.id}/practice`}>
                                <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                                    <CardHeader className="flex flex-row items-start gap-3 pb-3">
                                        <div className="bg-primary/10 text-primary rounded-lg p-2 mt-0.5">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-sm leading-snug line-clamp-2">
                                                {q.question}
                                            </CardTitle>
                                            {q.topic && (
                                                <CardDescription className="mt-1">{q.topic}</CardDescription>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Badge className={difficultyColor[q.difficulty] ?? ''} variant="outline">
                                            {q.difficulty}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
