import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Edit User', href: '#' },
];

type Props = {
    editUser: {
        id: number;
        name: string;
        email: string;
        role: string;
        tutor?: {
            specialization: string | null;
            band: string | null;
            experience: string | null;
            rating: string | null;
        } | null;
    };
};

export default function EditUser({ editUser }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: editUser.name,
        email: editUser.email,
        password: '',
        role: editUser.role,
        specialization: editUser.tutor?.specialization ?? 'speaking',
        band: editUser.tutor?.band ?? '',
        experience: editUser.tutor?.experience ?? '',
        rating: editUser.tutor?.rating ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${editUser.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${editUser.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
                    <p className="text-muted-foreground text-sm">Update user details and role assignment.</p>
                </div>

                <Card>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Leave blank to keep current"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="tutor">Tutor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            {data.role === 'tutor' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="specialization">Specialization</Label>
                                        <Select value={data.specialization} onValueChange={(v) => setData('specialization', v)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="speaking">Speaking</SelectItem>
                                                <SelectItem value="writing">Writing</SelectItem>
                                                <SelectItem value="listening">Listening</SelectItem>
                                                <SelectItem value="reading">Reading</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={(errors as any).specialization} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="band">Band Score</Label>
                                        <Input
                                            id="band"
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="9"
                                            placeholder="e.g. 8.5"
                                            value={data.band}
                                            onChange={(e) => setData('band', e.target.value)}
                                        />
                                        <InputError message={(errors as any).band} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="experience">Years of Experience</Label>
                                        <Input
                                            id="experience"
                                            type="number"
                                            min="0"
                                            placeholder="e.g. 5"
                                            value={data.experience}
                                            onChange={(e) => setData('experience', e.target.value)}
                                        />
                                        <InputError message={(errors as any).experience} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rating">Rating (0–5)</Label>
                                        <Input
                                            id="rating"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            placeholder="e.g. 4.8"
                                            value={data.rating}
                                            onChange={(e) => setData('rating', e.target.value)}
                                        />
                                        <InputError message={(errors as any).rating} />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    Save Changes
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/users">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
