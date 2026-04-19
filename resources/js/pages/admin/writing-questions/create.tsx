import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Writing Questions', href: '/admin/writing-questions' },
    { title: 'Create', href: '#' },
];

export default function CreateWritingQuestion() {
    const { data, setData, post, processing, errors } = useForm<{
        type: string;
        title: string;
        prompt_text: string;
        chart_type: string;
        essay_type: string;
        difficulty: string;
        image: File | null;
    }>({
        type: 'task1',
        title: '',
        prompt_text: '',
        chart_type: 'bar_graph',
        essay_type: 'agree_disagree',
        difficulty: 'medium',
        image: null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/writing-questions', { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Writing Question" />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Create Writing Question
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Add a new writing question.
                    </p>
                </div>

                <Card>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="type">Task Type</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(v) => setData('type', v)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="task1">
                                            Task 1 - Chart Description
                                        </SelectItem>
                                        <SelectItem value="task2">
                                            Task 2 - Essay Writing
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder={
                                        data.type === 'task1'
                                            ? 'e.g. Total Revenue of ABC Corp., 2018-2022'
                                            : 'e.g. Remote Work Benefits'
                                    }
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="prompt_text">
                                    Prompt / Instructions
                                </Label>
                                <textarea
                                    id="prompt_text"
                                    className="min-h-20 w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    value={data.prompt_text}
                                    onChange={(e) =>
                                        setData('prompt_text', e.target.value)
                                    }
                                    placeholder={
                                        data.type === 'task1'
                                            ? 'Summarise the information by selecting and reporting the main features...'
                                            : 'Write the essay question or prompt...'
                                    }
                                />
                                <InputError message={errors.prompt_text} />
                            </div>

                            {data.type === 'task1' && (
                                <div className="space-y-2">
                                    <Label>Chart Type</Label>
                                    <Select
                                        value={data.chart_type}
                                        onValueChange={(v) =>
                                            setData('chart_type', v)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bar_graph">
                                                Bar Graph
                                            </SelectItem>
                                            <SelectItem value="line_graph">
                                                Line Graph
                                            </SelectItem>
                                            <SelectItem value="pie_chart">
                                                Pie Chart
                                            </SelectItem>
                                            <SelectItem value="map">
                                                Map
                                            </SelectItem>
                                            <SelectItem value="process_diagram">
                                                Process Diagram
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.chart_type} />
                                </div>
                            )}

                            {data.type === 'task2' && (
                                <div className="space-y-2">
                                    <Label>Essay Type</Label>
                                    <Select
                                        value={data.essay_type}
                                        onValueChange={(v) =>
                                            setData('essay_type', v)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="agree_disagree">
                                                Agree/Disagree
                                            </SelectItem>
                                            <SelectItem value="advantage_disadvantage">
                                                Advantage/Disadvantage
                                            </SelectItem>
                                            <SelectItem value="discussion">
                                                Discussion
                                            </SelectItem>
                                            <SelectItem value="problem_solution">
                                                Problem/Solution
                                            </SelectItem>
                                            <SelectItem value="two_part">
                                                Two-Part
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.essay_type} />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select
                                    value={data.difficulty}
                                    onValueChange={(v) =>
                                        setData('difficulty', v)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="easy">
                                            Easy
                                        </SelectItem>
                                        <SelectItem value="medium">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="hard">
                                            Hard
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.difficulty} />
                            </div>

                            {data.type === 'task1' && (
                                <div className="space-y-2">
                                    <Label htmlFor="image">Chart Image</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setData(
                                                'image',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                    />
                                    <InputError message={errors.image} />
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    Create Question
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/writing-questions">
                                        Cancel
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
