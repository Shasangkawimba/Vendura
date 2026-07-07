import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

export default function Dashboard({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        Welcome back, <span className="font-semibold">{auth.user.name}</span>! You are logged in as <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{auth.user.role}</span>.
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
