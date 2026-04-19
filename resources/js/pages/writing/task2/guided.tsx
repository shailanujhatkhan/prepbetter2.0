import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Loader, CheckCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Question = {
    id: number;
    title: string;
    prompt_text: string | null;
    essay_type: string;
    difficulty: string;
};

type GuideStep = {
    id: number;
    module: string;
    task_type: string;
    essay_type: string | null;
    step_order: number;
    title: string;
    description: string;
    guidance: string;
    tips: string[];
    example: string | null;
    is_active: boolean;
};

type Props = {
    question: Question;
};

const essayTypeLabels: Record<string, string> = {
    agree_disagree: 'Agree/Disagree',
    advantage_disadvantage: 'Advantage/Disadvantage',
    discussion: 'Discussion',
    problem_solution: 'Problem/Solution',
    two_part: 'Two-Part',
};

export default function Task2Guided({ question }: Props) {
    const typeLabel =
        essayTypeLabels[question.essay_type] || question.essay_type;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Writing', href: '/writing' },
        { title: 'Task 2', href: '/writing/task2' },
        { title: typeLabel, href: `/writing/task2/${question.essay_type}` },
        { title: question.title, href: '#' },
    ];

    const [activeStep, setActiveStep] = useState(0);
    const [guideSteps, setGuideSteps] = useState<GuideStep[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
    const essayFormRef = useRef<HTMLDivElement>(null);
    const [notes, setNotes] = useState<Record<number, string>>({
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
    });
    const { data, setData, post, processing, errors } = useForm({
        content: '',
    });

    // Fetch guide steps from API
    useEffect(() => {
        const fetchGuideSteps = async () => {
            try {
                const response = await fetch(`/api/writing/guides/task2`);
                const json = await response.json();
                setGuideSteps(json.data || []);
            } catch (error) {
                console.error('Failed to load guide steps:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGuideSteps();
    }, []);

    const currentStep = guideSteps[activeStep];
    const progress =
        guideSteps.length > 0
            ? ((activeStep + 1) / guideSteps.length) * 100
            : 0;

    // Track which steps have been visited
    const handleStepChange = (stepIndex: number) => {
        setVisitedSteps((prev) => new Set([...prev, stepIndex]));
        setActiveStep(stepIndex);
    };

    // Check if all steps have been visited
    const allStepsVisited = visitedSteps.size === guideSteps.length;

    // Scroll to essay form
    const scrollToEssayForm = () => {
        essayFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/writing/${question.id}/submit`);
    };

    const handleStepNoteChange = (value: string) => {
        setNotes((prev) => ({
            ...prev,
            [activeStep]: value,
        }));
    };

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`Guided Essay - ${question.title}`} />
                <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                        <Loader className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">
                            Loading guide steps...
                        </p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (guideSteps.length === 0 || !currentStep) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`Guided Essay - ${question.title}`} />
                <Card>
                    <CardHeader>
                        <CardTitle>Guide Steps Not Available</CardTitle>
                        <CardDescription>
                            The guide steps for this task are currently not
                            available. Please try again later.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Guided Essay - ${question.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div>
                    <div className="mb-2 flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {question.title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Step-by-step guided essay writing • {typeLabel}
                            </p>
                        </div>
                        <Badge variant="outline">{currentStep?.title}</Badge>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                        <div
                            className="h-2 rounded-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <Tabs
                    value={activeStep.toString()}
                    onValueChange={(v) => handleStepChange(Number(v))}
                    className="flex-1"
                >
                    <TabsList className="grid h-auto w-full grid-cols-4 gap-1 p-1 lg:grid-cols-8">
                        {guideSteps.map((step, idx) => (
                            <div key={step.id} className="relative">
                                <TabsTrigger
                                    value={idx.toString()}
                                    className="w-full text-xs data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    {idx + 1}
                                </TabsTrigger>
                                {visitedSteps.has(idx) &&
                                    idx !== activeStep && (
                                        <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white text-green-600" />
                                    )}
                            </div>
                        ))}
                    </TabsList>

                    <div className="mt-4">
                        {guideSteps.map((step, idx) => (
                            <TabsContent
                                key={step.id}
                                value={idx.toString()}
                                className="space-y-4"
                            >
                                <div className="grid gap-4 lg:grid-cols-2">
                                    {/* Left: Guidance */}
                                    <div className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    {step.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    {step.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="prose prose-sm max-w-none">
                                                    <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                                                        {step.guidance}
                                                    </p>
                                                </div>

                                                {step.tips &&
                                                    step.tips.length > 0 && (
                                                        <div>
                                                            <p className="mb-2 text-sm font-medium">
                                                                💡 Tips:
                                                            </p>
                                                            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                                                                {step.tips.map(
                                                                    (
                                                                        tip,
                                                                        i,
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            {
                                                                                tip
                                                                            }
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}

                                                {step.example && (
                                                    <Card className="border-border/50 bg-muted/50">
                                                        <CardHeader className="pb-3">
                                                            <CardTitle className="text-sm">
                                                                📝 Example
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-sm whitespace-pre-wrap text-muted-foreground italic">
                                                                {step.example}
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Right: Question & Notes */}
                                    <div className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">
                                                    Essay Question
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="rounded-lg border border-border/50 bg-muted/50 p-4">
                                                    <p className="text-sm leading-relaxed">
                                                        {question.prompt_text ||
                                                            question.title}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">
                                                    Your Notes
                                                </CardTitle>
                                                <CardDescription>
                                                    Save your planning notes
                                                    here
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <textarea
                                                    className="min-h-[200px] w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                    placeholder={`Write your ${step.title.toLowerCase()} notes here...`}
                                                    value={
                                                        notes[activeStep] || ''
                                                    }
                                                    onChange={(e) =>
                                                        handleStepNoteChange(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center justify-between border-t pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleStepChange(
                                                Math.max(0, activeStep - 1),
                                            )
                                        }
                                        disabled={activeStep === 0}
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Previous
                                    </Button>

                                    {activeStep === guideSteps.length - 1 ? (
                                        <div className="flex gap-2">
                                            <Button variant="outline" asChild>
                                                <Link href="/writing/task2">
                                                    Cancel
                                                </Link>
                                            </Button>
                                            <Button
                                                onClick={scrollToEssayForm}
                                                disabled={!allStepsVisited}
                                                className={
                                                    allStepsVisited
                                                        ? 'bg-green-600 hover:bg-green-700'
                                                        : ''
                                                }
                                            >
                                                {!allStepsVisited ? (
                                                    <>
                                                        <span className="mr-2">
                                                            {guideSteps.length -
                                                                visitedSteps.size}
                                                        </span>
                                                        steps to review
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Start Writing Essay
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                handleStepChange(
                                                    Math.min(
                                                        guideSteps.length - 1,
                                                        activeStep + 1,
                                                    ),
                                                )
                                            }
                                        >
                                            Next
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>

                {/* Full Write Form - After all guidance steps */}
                {activeStep === guideSteps.length - 1 && (
                    <Card
                        ref={essayFormRef}
                        className="scroll-mt-4 border-primary/20 bg-primary/5"
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        Write Your Essay
                                    </CardTitle>
                                    <CardDescription>
                                        Using the guidance above, write your
                                        complete essay (250+ words)
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <textarea
                                    className="min-h-[300px] w-full resize-none rounded-md border border-input bg-background p-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    placeholder="Write your essay here... (aim for 250+ words)"
                                    value={data.content}
                                    onChange={(e) =>
                                        setData('content', e.target.value)
                                    }
                                />
                                <InputError message={errors.content} />

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        {data.content.trim()
                                            ? `${data.content.trim().split(/\s+/).length} words`
                                            : '0 words'}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" asChild>
                                            <Link href="/writing/task2">
                                                Cancel
                                            </Link>
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                !data.content.trim()
                                            }
                                        >
                                            Submit Essay
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
