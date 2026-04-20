import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle,
    Clock,
    Ear,
    FileText,
    Mic,
    PenTool,
    Settings,
    Star,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { Auth, BreadcrumbItem, UserRole } from '@/types';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

type Submission = {
    id: number;
    word_count: number;
    created_at: string;
    user: { name: string };
    question: { title: string; chart_type: string | null };
    feedback: { band_score: number } | null;
};

type Stats = {
    totalWritingQuestions?: number;
    mySubmissions?: number;
    reviewedSubmissions?: number;
    pendingSubmissions?: number;
    averageBandScore?: number | null;
    grammarHeatmap?: {
    articles: number;
    tenses: number;
    prepositions: number;
};
    submissionsNeedingReview?: number;
    totalReviewedSubmissions?: number;
    recentSubmissions?: Submission[];
    totalUsers?: number;
    totalStudents?: number;
    totalTutors?: number;
    totalSubmissions?: number;
};

type DashboardCard = {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
};

type DashboardSection = {
    heading: string;
    subtitle: string;
    roles: UserRole[];
    cards: DashboardCard[];
};

const sections: DashboardSection[] = [
    {
        heading: 'Practice Modules',
        subtitle: 'Choose a module to start practicing.',
        roles: ['student', 'tutor', 'admin'],
        cards: [
            { title: 'Writing', description: 'Practice Task 1 reports & Task 2 essays', href: '/writing', icon: PenTool },
            { title: 'Listening', description: 'Audio meaning matching exercises', href: '/listening', icon: Ear },
            { title: 'Reading', description: 'Paraphrasing & summarization practice', href: '/reading', icon: BookOpen },
            { title: 'Speaking', description: 'Book sessions with IELTS tutors', href: '/speaking', icon: Mic },
        ],
    },
    {
        heading: 'Tutor Panel',
        subtitle: 'Manage essay reviews and speaking sessions.',
        roles: ['tutor', 'admin'],
        cards: [
            { title: 'Essay Reviews', description: 'Review student essay submissions', href: '/tutor/reviews', icon: FileText },
            { title: 'Availability', description: 'Manage your available time slots', href: '/tutor/availability', icon: Settings },
        ],
    },
    {
        heading: 'Administration',
        subtitle: 'Manage platform content and users.',
        roles: ['admin'],
        cards: [
            { title: 'Users', description: 'Manage users and assign roles', href: '/admin/users', icon: Users },
            { title: 'Writing Questions', description: 'Manage Task 1 & Task 2 questions', href: '/admin/writing-questions', icon: PenTool },
        ],
    },
];

function StatCard({ label, value, icon: Icon, href, color = 'blue' }: { label: string; value: string | number; icon: LucideIcon; href?: string; color?: 'blue' | 'green' | 'amber' | 'purple' | 'rose' }) {
    const colors = {
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
        green: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
        amber: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
        rose: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
    };
    const content = (
        <Card className="transition-shadow hover:shadow-md h-full py-4">
            <CardContent className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${colors[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-muted-foreground text-sm">{label}</p>
                </div>
            </CardContent>
        </Card>
    );
    return href ? <Link href={href}>{content}</Link> : content;
}

export default function Dashboard() {
    
const getColor = (value: number) => {
    if (value === 0) return "bg-green-100 text-green-800";
    if (value <= 2) return "bg-green-200 text-green-900";
    if (value <= 4) return "bg-yellow-200 text-yellow-900";
    if (value <= 6) return "bg-orange-200 text-orange-900";
    return "bg-red-300 text-red-900";
};
    const { auth, stats } = usePage<{ auth: Auth; stats: Stats }>().props;
    const [demoMode, setDemoMode] = useState(false);
    const role = auth.user.role;
    const visibleSections = sections.filter((s) => s.roles.includes(role));
const heatmap = demoMode
    ? { articles: 5, tenses: 2, prepositions: 10 }
    : (stats.grammarHeatmap ?? { articles: 0, tenses: 0, prepositions: 0 });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Welcome back, {auth.user.name}
                    </h1>
                    <p className="text-muted-foreground">
                        {role === 'admin' && 'Full platform access — practice, tutor tools, and admin controls.'}
                        {role === 'tutor' && 'Practice IELTS skills and manage your tutor responsibilities.'}
                        {role === 'student' && 'Track your progress and keep practicing.'}
                    </p>
                </div>

                {/* Stats Overview */}
                
                {role === 'student' && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Total Submissions" value={stats.mySubmissions ?? 0} icon={FileText} color="blue" />
                        <StatCard label="Reviewed" value={stats.reviewedSubmissions ?? 0} icon={CheckCircle} color="green" />
                        <StatCard label="Pending Review" value={stats.pendingSubmissions ?? 0} icon={Clock} color="amber" />
                        <StatCard
                            label="Avg. Band Score"
                            value={stats.averageBandScore != null ? Number(stats.averageBandScore).toFixed(1) : '—'}
                            icon={Star}
                            color="purple"
                        />
                    </div>
                )}
                {role === 'student' && (
                    <>
<button
    onClick={() => setDemoMode(!demoMode)}
    className="mb-3 px-3 py-1 bg-black text-white rounded"
>
    Toggle Demo Heatmap
</button>
                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                        <h2 className="text-lg font-semibold mb-4">
                            Grammar Heatmap Analysis
                        </h2>

                        <div className="grid grid-cols-3 gap-3">
                            <div className={`p-4 rounded-lg text-center transition-all ${getColor(heatmap.articles)}`}>
                                <p className="font-medium">Articles</p>
                                <p className="text-2xl font-bold">{heatmap.articles}</p>
                            </div>

                            <div className={`p-4 rounded-lg text-center transition-all ${getColor(heatmap.tenses)}`}>
                                <p className="font-medium">Tenses</p>
                                <p className="text-2xl font-bold">{heatmap.tenses}</p>
                            </div>

                            <div className={`p-4 rounded-lg text-center transition-all ${getColor(heatmap.prepositions)}`}>
                                <p className="font-medium">Prepositions</p>
                                <p className="text-2xl font-bold">{heatmap.prepositions}</p>
                            </div>
                        </div>
                    </div>
                    </>
                )}

                {role === 'tutor' && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard label="Needs Review" value={stats.submissionsNeedingReview ?? 0} icon={Clock} color="amber" href="/tutor/reviews" />
                        <StatCard label="Reviewed" value={stats.totalReviewedSubmissions ?? 0} icon={CheckCircle} color="green" />
                        <StatCard label="Writing Questions" value={stats.totalWritingQuestions ?? 0} icon={PenTool} color="blue" />
                    </div>
                )}

                {role === 'admin' && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Total Users" value={stats.totalUsers ?? 0} icon={Users} color="blue" href="/admin/users" />
                        <StatCard label="Students" value={stats.totalStudents ?? 0} icon={Users} color="green" />
                        <StatCard label="Tutors" value={stats.totalTutors ?? 0} icon={Users} color="purple" />
                        <StatCard label="Total Submissions" value={stats.totalSubmissions ?? 0} icon={FileText} color="amber" />
                    </div>
                )}

                {role === 'admin' && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard label="Needs Review" value={stats.submissionsNeedingReview ?? 0} icon={Clock} color="rose" href="/tutor/reviews" />
                        <StatCard label="Reviewed" value={stats.totalReviewedSubmissions ?? 0} icon={CheckCircle} color="green" />
                        <StatCard label="Writing Questions" value={stats.totalWritingQuestions ?? 0} icon={PenTool} color="blue" href="/admin/writing-questions" />
                    </div>
                )}

                {/* Recent Submissions - Tutor/Admin */}
                {(role === 'tutor' || role === 'admin') && stats.recentSubmissions && stats.recentSubmissions.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">Recent Submissions</h2>
                            <p className="text-muted-foreground text-sm">Latest student submissions across the platform.</p>
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {stats.recentSubmissions.map((sub) => (
                                        <Link
                                            key={sub.id}
                                            href={`/tutor/reviews/${sub.id}`}
                                            className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium text-sm">{sub.question.title}</span>
                                                <span className="text-muted-foreground text-xs">
                                                    by {sub.user.name} · {sub.word_count} words · {new Date(sub.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {sub.feedback ? (
                                                <Badge variant="default">Band {sub.feedback.band_score}</Badge>
                                            ) : (
                                                <Badge variant="outline">Pending</Badge>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Navigation Sections */}
                {visibleSections.map((section) => (
                    <div key={section.heading} className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">{section.heading}</h2>
                            <p className="text-muted-foreground text-sm">{section.subtitle}</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {section.cards.map((card) => (
                                <Link key={card.title} href={card.href} className="group">
                                    <Card className="transition-shadow group-hover:shadow-md">
                                        <CardHeader className="flex flex-row items-center gap-4">
                                            <div className="bg-primary/10 text-primary rounded-lg p-2">
                                                <card.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <CardTitle>{card.title}</CardTitle>
                                                <CardDescription>{card.description}</CardDescription>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
