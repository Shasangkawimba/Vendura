import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { User } from '@/types';

export default function Authenticated({ user, header, children }: { user: User, header?: ReactNode, children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-xl font-semibold tracking-tight text-indigo-600 dark:text-indigo-400">Vendura</span>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-sm bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400"
                    >
                        Dashboard
                    </Link>
                    
                    <Link
                        href="#"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        Contracts
                    </Link>

                    {/* Conditional rendering based on role */}
                    {['MANAGER', 'FINANCE', 'DIREKTUR'].includes(user.role) && (
                        <Link
                            href="#"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            Approvals
                        </Link>
                    )}

                    <Link
                        href="#"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        Compliance
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500 mb-4">{user.role}</div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full text-left text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                        Log Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {header && (
                    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}
                <div className="flex-1 p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
