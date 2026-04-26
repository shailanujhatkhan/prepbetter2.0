import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Question = {
    id: number;
    title: string;
    youtube_video_id: string;
    text: string;
    options: string[];
    correct_answer: number;
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
    { title: 'Listening Questions', href: '/admin/listening' },
];

export default function AdminListeningIndex({ questions }: Props) {
    const destroy = (id: number) => {
        if (!confirm('Delete this question?')) return;
        router.delete(`/admin/listening/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Listening Questions" />

            <div className="flex h-full flex-1 flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Listening Questions</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            {questions.data.length} question{questions.data.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/listening/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-3">
                    {questions.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No listening questions yet. Add one to get started.
                            </CardContent>
                        </Card>
                    ) : (
                        questions.data.map((q) => (
                            <Card key={q.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-4">
                                        <CardTitle className="text-sm font-medium leading-snug">
                                            {q.title}
                                        </CardTitle>
                                        <div className="flex shrink-0 gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/listening/${q.id}/edit`}>
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
                                <CardContent className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>YouTube: {q.youtube_video_id}</span>
                                    <span>·</span>
                                    <span>Correct: Option {q.correct_answer + 1}</span>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {questions.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-2">
                        {Array.from({ length: questions.last_page }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === questions.current_page ? 'default' : 'outline'}
                                size="sm"
                                asChild
                            >
                                <Link href={`/admin/listening?page=${page}`}>{page}</Link>
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
