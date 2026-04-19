import { Head, Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Writing', href: '/writing' },
];

export default function WritingIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Writing Practice" />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Writing Practice
                    </h1>
                    <p className="text-muted-foreground">
                        Choose a task type to start practicing.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Link href="/writing/task1" className="group">
                        <Card className="h-full transition-shadow group-hover:shadow-md">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <div>
                                    <CardTitle>Writing Task 1</CardTitle>
                                    <CardDescription>
                                        Describe charts, graphs, diagrams and
                                        maps. Write 150+ words.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/writing/task2" className="group">
                        <Card className="h-full transition-shadow group-hover:shadow-md">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <div>
                                    <CardTitle>Writing Task 2</CardTitle>
                                    <CardDescription>
                                        Essay writing with guided step-by-step
                                        structure.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
