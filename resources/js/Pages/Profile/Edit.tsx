import { FormEventHandler } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Edit({ auth, status }: PageProps<{ status?: string }>) {
    const user = auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<{ name: string; email: string }>({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/profile');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profile Settings" />

            <div className="max-w-2xl mx-auto space-y-6 lg:space-y-8 mt-4">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)] leading-none">Profile Settings</h2>
                    <p className="text-sm text-[var(--color-secondary)] mt-2">Update your account's profile information and email address.</p>
                </div>

                <div className="bg-[var(--color-surface-container-lowest)] p-6 sm:p-8 shadow-sm rounded-xl border border-[var(--color-surface-border)]">
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-[var(--color-on-surface)] mb-2">Name</label>
                            <input
                                id="name"
                                type="text"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoFocus
                                autoComplete="name"
                            />
                            {errors.name && <div className="text-xs text-[var(--color-error)] mt-1.5">{errors.name}</div>}
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-on-surface)] mb-2">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                            />
                            {errors.email && <div className="text-xs text-[var(--color-error)] mt-1.5">{errors.email}</div>}
                        </div>

                        {/* Submit Button & Status */}
                        <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-surface-border)]">
                            <button 
                                disabled={processing}
                                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                            >
                                Save Changes
                            </button>

                            {recentlySuccessful && (
                                <p className="text-sm font-medium text-[var(--color-status-active)]">Saved successfully.</p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
