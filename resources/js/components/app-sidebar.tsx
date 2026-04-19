import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    ClipboardList,
    Ear,
    LayoutGrid,
    MessageSquare,
    Mic,
    PenTool,
    Settings,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { Auth, NavItem, UserRole } from '@/types';

type NavSection = {
    label: string;
    items: NavItem[];
    roles: UserRole[];
};

const navSections: NavSection[] = [
    {
        label: 'Practice',
        roles: ['student', 'tutor', 'admin'],
        items: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            { title: 'Writing', href: '/writing', icon: PenTool },
            { title: 'Listening', href: '/listening', icon: Ear },
            { title: 'Reading', href: '/reading', icon: BookOpen },
            { title: 'Speaking', href: '/speaking', icon: Mic },
            { title: 'Progress', href: '/progress', icon: BarChart3 },
        ],
    },
    {
        label: 'Tutor',
        roles: ['tutor', 'admin'],
        items: [
            { title: 'Essay Reviews', href: '/tutor/reviews', icon: ClipboardList },
            { title: 'Availability', href: '/tutor/availability', icon: Settings },
            { title: 'Sessions', href: '/tutor/sessions', icon: MessageSquare },
        ],
    },
    {
        label: 'Admin',
        roles: ['admin'],
        items: [
            { title: 'Users', href: '/admin/users', icon: Users },
            { title: 'Writing Questions', href: '/admin/writing-questions', icon: PenTool },
            { title: 'Listening Questions', href: '/admin/listening-questions', icon: Ear },
            { title: 'Reading Passages', href: '/admin/reading-passages', icon: BookOpen },
        ],
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth.user.role;

    const visibleSections = navSections.filter((section) => section.roles.includes(role));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {visibleSections.map((section) => (
                    <NavMain key={section.label} label={section.label} items={section.items} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
