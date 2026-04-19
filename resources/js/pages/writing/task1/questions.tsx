import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Question = {
    id: number;
    title: string;
    difficulty: string;
    chart_type: string;
};

type Props = {
    chartType: string;
    questions: Question[];
};

const chartLabels: Record<string, string> = {
    bar_graph: 'Bar Graph',
    line_graph: 'Line Graph',
    pie_chart: 'Pie Chart',
    map: 'Map',
    process_diagram: 'Process Diagram',
};

const difficultyColor = (d: string) => {
    switch (d) {
        case 'easy': return 'secondary' as const;
        case 'hard': return 'destructive' as const;
        default: return 'outline' as const;
    }
};

export default function Task1Questions({ chartType, questions }: Props) {
    const label = chartLabels[chartType] || chartType;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Writing', href: '/writing' },
        { title: 'Task 1', href: '/writing/task1' },
        { title: label, href: `/writing/task1/${chartType}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Task 1 - ${label}`} />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{label} Questions</h1>
                    <p className="text-muted-foreground">{questions.length} questions available</p>
                </div>

                <div className="grid gap-3">
                    {questions.map((q, i) => (
                        <Link key={q.id} href={`/writing/task1/${q.id}/practice`} className="group">
                            <Card className="transition-shadow group-hover:shadow-md">
                                <CardHeader className="flex flex-row items-center justify-between py-4">
                                    <div>
                                        <CardTitle className="text-base">
                                            {i + 1}. {q.title}
                                        </CardTitle>
                                    </div>
                                    <Badge variant={difficultyColor(q.difficulty)}>{q.difficulty}</Badge>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
