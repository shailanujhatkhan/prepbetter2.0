import { Head, Link, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    { title: 'Essay Reviews', href: '/tutor/reviews' },
];

const chartTypeLabels: Record<string, string> = {
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

type Submission = {
    id: number;
    word_count: number;
    created_at: string;
    user: { name: string; email: string };
    question: {
        title: string;
        type: string;
        chart_type: string | null;
        essay_type: string | null;
        prompt_text: string | null;
    };
    feedback: { evaluator_type: string; band_score: number | null } | null;
};

type Props = {
    submissions: {
        data: Submission[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
};

export default function ReviewsIndex({ submissions }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Essay Reviews" />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Essay Reviews
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {submissions.total} submissions
                    </p>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Question</TableHead>
                                <TableHead>Words</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead className="text-right">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No submissions to review.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                submissions.data.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {s.user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {s.user.email}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {s.question.type === 'task1' ? (
                                                <span className="text-xs">
                                                    Task 1 •{' '}
                                                    {chartTypeLabels[
                                                        s.question.chart_type ||
                                                            ''
                                                    ] || 'Unknown'}
                                                </span>
                                            ) : (
                                                <span className="text-xs">
                                                    Task 2 •{' '}
                                                    {essayTypeLabels[
                                                        s.question.essay_type ||
                                                            ''
                                                    ] || 'Unknown'}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">
                                            {s.question.title}
                                        </TableCell>
                                        <TableCell>{s.word_count}</TableCell>
                                        <TableCell>
                                            {s.feedback ? (
                                                <Badge variant="secondary">
                                                    Reviewed{' '}
                                                    {s.feedback.band_score
                                                        ? `(${s.feedback.band_score})`
                                                        : ''}
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive">
                                                    Pending
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                s.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                            >
                                                <Link
                                                    href={`/tutor/reviews/${s.id}`}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {submissions.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {submissions.links.map((link, i) => (
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
