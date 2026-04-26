import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Question = {
    id: number;
    question: string;
    difficulty: string;
    topic: string | null;
    is_active: boolean;
    created_at: string;
};

type Props = {
    questions: {
        data: Question[];
        current_page: number;
        last_page: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Admin', href: '#' },
    { title: 'Reading Questions', href: '/admin/reading' },
];

const difficultyColor: Record<string, string> = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
};

export default function AdminReadingIndex({ questions }: Props) {
    const destroy = (id: number) => {
        if (!confirm('Delete this question?')) return;
        router.delete(`/admin/reading/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reading Questions" />

            <div className="flex h-full flex-1 flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Reading Questions</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            {questions.data.length} question{questions.data.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/reading/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-3">
                    {questions.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No reading questions yet. Add one to get started.
                            </CardContent>
                        </Card>
                    ) : (
                        questions.data.map((q) => (
                            <Card key={q.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-4">
                                        <CardTitle className="text-sm font-medium leading-snug">
                                            {q.question}
                                        </CardTitle>
                                        <div className="flex shrink-0 gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/reading/${q.id}/edit`}>
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => destroy(q.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex items-center gap-2">
                                    <Badge className={difficultyColor[q.difficulty] ?? ''} variant="outline">
                                        {q.difficulty}
                                    </Badge>
                                    {q.topic && (
                                        <Badge variant="secondary">{q.topic}</Badge>
                                    )}
                                    {!q.is_active && (
                                        <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
