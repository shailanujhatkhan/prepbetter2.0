import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Writing Questions', href: '/admin/writing-questions' },
];

type Question = {
    id: number;
    type: string;
    title: string;
    chart_type: string | null;
    essay_type: string | null;
    difficulty: string;
    image_path: string | null;
    created_at: string;
};

type Props = {
    questions: {
        data: Question[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { type?: string; chart_type?: string; essay_type?: string };
};

const chartLabels: Record<string, string> = {
    bar_graph: 'Bar Graph',
    line_graph: 'Line Graph',
    pie_chart: 'Pie Chart',
    map: 'Map',
    process_diagram: 'Process Diagram',
};

const essayTypeLabels: Record<string, string> = {
    agree_disagree: 'Agree/Disagree',
    advantage_disadvantage: 'Advantage/Disadvantage',
    discussion: 'Discussion',
    problem_solution: 'Problem/Solution',
    two_part: 'Two-Part',
};

export default function WritingQuestionsIndex({ questions, filters }: Props) {
    const handleDelete = (q: Question) => {
        router.delete(`/admin/writing-questions/${q.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Writing Questions" />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Writing Questions
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {questions.total} total questions
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/writing-questions/create">
                            <Plus className="h-4 w-4" />
                            Add Question
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Select
                        value={filters.type || 'all'}
                        onValueChange={(v) => {
                            router.get(
                                '/admin/writing-questions',
                                {
                                    type: v === 'all' ? undefined : v,
                                    chart_type: undefined,
                                    essay_type: undefined,
                                },
                                { preserveState: false, replace: true },
                            );
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All task types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All tasks</SelectItem>
                            <SelectItem value="task1">
                                Task 1 - Charts
                            </SelectItem>
                            <SelectItem value="task2">
                                Task 2 - Essays
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {filters.type === 'task1' && (
                        <Select
                            value={filters.chart_type || 'all'}
                            onValueChange={(v) => {
                                router.get(
                                    '/admin/writing-questions',
                                    {
                                        type: 'task1',
                                        chart_type: v === 'all' ? undefined : v,
                                    },
                                    { preserveState: true, replace: true },
                                );
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All chart types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All chart types
                                </SelectItem>
                                {Object.entries(chartLabels).map(([k, v]) => (
                                    <SelectItem key={k} value={k}>
                                        {v}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {filters.type === 'task2' && (
                        <Select
                            value={filters.essay_type || 'all'}
                            onValueChange={(v) => {
                                router.get(
                                    '/admin/writing-questions',
                                    {
                                        type: 'task2',
                                        essay_type: v === 'all' ? undefined : v,
                                    },
                                    { preserveState: true, replace: true },
                                );
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All essay types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All essay types
                                </SelectItem>
                                {Object.entries(essayTypeLabels).map(
                                    ([k, v]) => (
                                        <SelectItem key={k} value={k}>
                                            {v}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Chart/Essay Type</TableHead>
                                <TableHead>Difficulty</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No questions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                questions.data.map((q) => (
                                    <TableRow key={q.id}>
                                        <TableCell className="max-w-[250px] truncate font-medium">
                                            {q.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {q.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {q.type === 'task1'
                                                ? q.chart_type
                                                    ? chartLabels[
                                                          q.chart_type
                                                      ] || q.chart_type
                                                    : '-'
                                                : q.essay_type
                                                  ? essayTypeLabels[
                                                        q.essay_type
                                                    ] || q.essay_type
                                                  : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {q.difficulty}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {q.image_path ? 'Yes' : 'No'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/admin/writing-questions/${q.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <ConfirmDeleteDialog
                                                    title={`Delete "${q.title}"?`}
                                                    description="This will permanently delete this question and all related submissions."
                                                    onConfirm={() =>
                                                        handleDelete(q)
                                                    }
                                                    trigger={
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    }
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {questions.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {questions.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() =>
                                    link.url &&
                                    router.get(
                                        link.url,
                                        {},
                                        { preserveState: true },
                                    )
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
