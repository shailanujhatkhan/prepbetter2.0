import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, CheckCircle, Ear, GraduationCap, Mic, PenTool, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    const features = [
        { icon: PenTool, title: 'Writing', description: 'Practice Task 1 chart reports and Task 2 essays with expert feedback' },
        { icon: Ear, title: 'Listening', description: 'Audio-based exercises to sharpen your comprehension skills' },
        { icon: BookOpen, title: 'Reading', description: 'Paraphrasing and summarization practice with real passages' },
        { icon: Mic, title: 'Speaking', description: 'Book sessions with experienced IELTS tutors' },
    ];

    return (
        <>
            <Head title="IELTS Preparation Platform" />
            <div className="flex min-h-screen flex-col bg-background text-foreground">
                {/* Header */}
                <header className="border-b bg-card">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-7 w-7 text-primary" />
                            <h1 className="text-xl font-bold text-primary">IELTS Prep</h1>
                        </div>
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href="/login">Log in</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild>
                                            <Link href="/register">Register</Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <section className="bg-primary text-primary-foreground">
                    <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
                        <div className="flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium">
                            <Target className="h-4 w-4" />
                            Aim for Band 7+
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            Prepare for IELTS<br />with Confidence
                        </h2>
                        <p className="max-w-2xl text-lg text-primary-foreground/80">
                            A comprehensive platform to practice all four IELTS modules — Writing, Listening, Reading, and Speaking — with tutor feedback and progress tracking.
                        </p>
                        <div className="flex gap-3 pt-2">
                            {auth.user ? (
                                <Button size="lg" variant="secondary" asChild>
                                    <Link href="/dashboard">Go to Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button size="lg" variant="secondary" asChild>
                                        <Link href="/register">Get Started Free</Link>
                                    </Button>
                                    <Button size="lg" className="border border-white/30 bg-white/10 text-white hover:bg-white/20" asChild>
                                        <Link href="/login">Log in</Link>
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Band score badges */}
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-sm">
                            {['Writing', 'Listening', 'Reading', 'Speaking'].map((mod) => (
                                <span key={mod} className="rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1">
                                    {mod}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-6">
                        <h3 className="mb-2 text-center text-2xl font-bold">Practice All Four Modules</h3>
                        <p className="mb-8 text-center text-muted-foreground">Everything you need to ace the IELTS exam in one place.</p>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((f) => (
                                <Card key={f.title} className="text-center">
                                    <CardHeader className="flex flex-col items-center gap-3">
                                        <div className="bg-primary/10 text-primary rounded-lg p-3">
                                            <f.icon className="h-8 w-8" />
                                        </div>
                                        <CardTitle>{f.title}</CardTitle>
                                        <CardDescription>{f.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="border-t bg-muted/30 py-16">
                    <div className="mx-auto max-w-6xl px-6">
                        <h3 className="mb-2 text-center text-2xl font-bold">How It Works</h3>
                        <p className="mb-8 text-center text-muted-foreground">Three simple steps to start improving your band score.</p>
                        <div className="grid gap-8 sm:grid-cols-3">
                            {[
                                { step: '1', title: 'Sign Up', desc: 'Create your free account and set up your profile.' },
                                { step: '2', title: 'Practice', desc: 'Choose a module and start practicing with real IELTS-style questions.' },
                                { step: '3', title: 'Get Feedback', desc: 'Receive detailed feedback from tutors to improve your band score.' },
                            ].map((item) => (
                                <div key={item.step} className="flex flex-col items-center gap-3 text-center">
                                    <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold">
                                        {item.step}
                                    </div>
                                    <h4 className="text-lg font-semibold">{item.title}</h4>
                                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Highlights */}
                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-6">
                        <h3 className="mb-8 text-center text-2xl font-bold">Why Choose IELTS Prep?</h3>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                { title: 'Expert Tutor Feedback', desc: 'Get band scores and detailed feedback on grammar, vocabulary, and coherence.' },
                                { title: 'Progress Tracking', desc: 'Monitor your improvement over time with detailed analytics.' },
                                { title: 'All Skill Levels', desc: 'Questions range from easy to hard to match your current level.' },
                                { title: 'Real Exam Format', desc: 'Questions designed to mirror actual IELTS exam patterns.' },
                                { title: 'Writing Hints', desc: 'Helpful vocabulary, verbs, and sentence structures for each task.' },
                                { title: 'Instant Submission', desc: 'Submit your work and get feedback without delays.' },
                            ].map((item) => (
                                <div key={item.title} className="flex gap-3">
                                    <CheckCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                                    <div>
                                        <h4 className="font-semibold">{item.title}</h4>
                                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                {!auth.user && (
                    <section className="bg-primary text-primary-foreground py-12">
                        <div className="mx-auto max-w-6xl px-6 text-center">
                            <h3 className="mb-3 text-2xl font-bold">Ready to Achieve Your Target Band Score?</h3>
                            <p className="mb-6 text-primary-foreground/80">Join now and start practicing with real IELTS-style questions.</p>
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/register">Create Free Account</Link>
                            </Button>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t py-6">
                    <div className="mx-auto max-w-6xl px-6 text-center">
                        <p className="text-muted-foreground text-sm">
                            IELTS Preparation Platform — A University Project
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
