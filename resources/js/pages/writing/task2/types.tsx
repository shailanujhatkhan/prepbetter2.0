import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Props = {
    typeCounts: Record<string, number>;
};

const essayTypeLabels: Record<string, { label: string; description: string }> =
    {
        agree_disagree: {
            label: 'Agree/Disagree',
            description:
                'Express your opinion on a statement and provide reasons.',
        },
        advantage_disadvantage: {
            label: 'Advantage/Disadvantage',
            description: 'Discuss the advantages and disadvantages of a topic.',
        },
        discussion: {
            label: 'Discussion',
            description:
                'Present different views on an issue and give your opinion.',
        },
        problem_solution: {
            label: 'Problem/Solution',
            description: 'Identify problems and suggest solutions.',
        },
        two_part: {
            label: 'Two-Part',
            description: 'Answer two related questions about a topic.',
        },
    };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Writing', href: '/writing' },
    { title: 'Task 2', href: '#' },
];

export default function Task2Types({ typeCounts }: Props) {
    const types = Object.entries(typeCounts).sort(([, a], [, b]) => b - a);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Writing Task 2 - Essay Types" />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Writing Task 2: Guided Essay
                    </h1>
                    <p className="text-muted-foreground">
                        Select an essay type to begin step-by-step guidance.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {types.length === 0 ? (
                        <Card className="md:col-span-2">
                            <CardHeader className="text-center">
                                <p className="text-muted-foreground">
                                    No essay types available yet.
                                </p>
                            </CardHeader>
                        </Card>
                    ) : (
                        types.map(([essayType, count]) => {
                            const info = essayTypeLabels[essayType] || {
                                label: essayType
                                    .replace(/_/g, ' ')
                                    .toUpperCase(),
                                description: 'Practice this essay type.',
                            };

                            return (
                                <Link
                                    key={essayType}
                                    href={`/writing/task2/${essayType}`}
                                    className="group"
                                >
                                    <Card className="h-full transition-all group-hover:border-primary group-hover:shadow-md">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle>
                                                        {info.label}
                                                    </CardTitle>
                                                    <CardDescription className="mt-2">
                                                        {info.description}
                                                    </CardDescription>
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                            </div>
                                            <div className="mt-4 border-t pt-4">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {count}{' '}
                                                    {count === 1
                                                        ? 'question'
                                                        : 'questions'}
                                                </p>
                                            </div>
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
