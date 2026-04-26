import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import {
    BookOpen,
    CalendarCheck,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { Auth, BreadcrumbItem, UserRole } from '@/types';
import type { LucideIcon } from 'lucide-react';

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
        subject_verb: number;
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

            // // Aligns with backend route
            // { 
            //     title: 'Write-up Review', 
            //     description: 'Get AI feedback on your writing submissions', 
            //     href: '/writing/submissions', 
            //     icon: FileText 
            // },
        ],
    },
    {
        heading: 'My Sessions',
        subtitle: 'View and manage your booked speaking sessions.',
        roles: ['student'],
        cards: [
            { title: 'My Bookings', description: 'View upcoming & past speaking sessions', href: '/my-bookings', icon: CalendarCheck },
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
            { title: 'Reading Questions', description: 'Manage reading passage MCQs', href: '/admin/reading', icon: BookOpen },
            { title: 'Bookings', description: 'Review and approve payment bookings', href: '/admin/bookings', icon: CalendarCheck },
        ],
    },
];

function StatCard({
    label,
    value,
    icon: Icon,
    href,
    color = 'blue',
}: {
    label: string;
    value: string | number;
    icon: LucideIcon;
    href?: string;
    color?: 'blue' | 'green' | 'amber' | 'purple' | 'rose';
}) {
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
    const { auth, stats } = usePage<{ auth: Auth; stats: Stats }>().props;
    const role = auth.user.role;
    const visibleSections = sections.filter((s) => s.roles.includes(role));
    const heatmap = stats.grammarHeatmap ?? { articles: 0, tenses: 0, prepositions: 0, subject_verb: 0 };
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

                {/* Stats */}
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
                    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-transparent">
                        <h2 className="text-lg font-semibold mb-1">Grammar Error Heatmap</h2>
                        <p className="text-sm text-muted-foreground mb-4">Total errors across all reviewed submissions</p>

                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart
                                data={[
                                    { name: 'Articles', value: heatmap.articles ?? 0 },
                                    { name: 'Tenses', value: heatmap.tenses ?? 0 },
                                    { name: 'Prepositions', value: heatmap.prepositions ?? 0 },
                                    { name: 'Subject-Verb', value: heatmap.subject_verb ?? 0 },
                                ]}
                                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(v: number) => [v, 'Errors']} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={64}>
                                    {[heatmap.articles, heatmap.tenses, heatmap.prepositions, heatmap.subject_verb].map((v, i) => (
                                        <Cell key={i} fill={v === 0 ? '#86efac' : v <= 2 ? '#4ade80' : v <= 4 ? '#facc15' : v <= 6 ? '#fb923c' : '#f87171'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-green-300" />0 errors</span>
                            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-green-400" />1–2</span>
                            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-yellow-400" />3–4</span>
                            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-orange-400" />5–6</span>
                            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-red-400" />7+</span>
                        </div>
                    </div>
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

                {/* Sections */}
                {visibleSections.map((section) => (
                    <div key={section.heading} className="flex flex-col gap-4">

                        <div>
                            <h2 className="text-lg font-semibold">{section.heading}</h2>
                            <p className="text-muted-foreground text-sm">{section.subtitle}</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {section.cards.map((card) => (
                                <Link key={card.title} href={card.href} className="group">
                                    <Card className="transition-shadow group-hover:shadow-md min-h-30">
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