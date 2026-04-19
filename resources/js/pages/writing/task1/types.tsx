import { Head, Link } from '@inertiajs/react';
import { BarChart3, GitBranch, LineChart, Map, PieChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { LucideIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Writing', href: '/writing' },
    { title: 'Task 1', href: '/writing/task1' },
];

const chartTypes: { key: string; label: string; description: string; icon: LucideIcon }[] = [
    { key: 'bar_graph', label: 'Bar Graph', description: 'Compare data across categories', icon: BarChart3 },
    { key: 'line_graph', label: 'Line Graph', description: 'Show trends over time', icon: LineChart },
    { key: 'pie_chart', label: 'Pie Chart', description: 'Show proportions of a whole', icon: PieChart },
    { key: 'map', label: 'Map', description: 'Describe geographical information', icon: Map },
    { key: 'process_diagram', label: 'Process Diagram', description: 'Describe steps in a process', icon: GitBranch },
];

type Props = {
    typeCounts: Record<string, number>;
};

export default function Task1Types({ typeCounts }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Task 1 - Chart Types" />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Task 1 - Chart Types</h1>
                    <p className="text-muted-foreground">Select a chart type to practice.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {chartTypes.map((ct) => {
                        const count = typeCounts[ct.key] || 0;
                        return (
                            <Link
                                key={ct.key}
                                href={count > 0 ? `/writing/task1/${ct.key}` : '#'}
                                className={count > 0 ? 'group' : 'opacity-50 pointer-events-none'}
                            >
                                <Card className="transition-shadow group-hover:shadow-md h-full">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="bg-primary/10 text-primary rounded-lg p-2">
                                            <ct.icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="flex items-center justify-between">
                                                {ct.label}
                                                <Badge variant="secondary">{count}</Badge>
                                            </CardTitle>
                                            <CardDescription>{ct.description}</CardDescription>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
