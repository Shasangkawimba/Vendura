import { ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';
import ApplicationLogo from '@/Components/ApplicationLogo';

const navItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        label: 'Contracts',
        href: '/contracts',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        label: 'Vendors & Compliance',
        href: '/vendors',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
    },
];

export default function Authenticated({ user, header, children }: { user: User; header?: ReactNode; children: ReactNode }) {
    const { url } = usePage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-[var(--color-bg-canvas)]">
            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-[240px] flex flex-col bg-[var(--color-primary-container)] text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ background: 'var(--color-primary-container)' }}
            >
                {/* Brand */}
                <div className="h-20 flex items-center px-6 mt-4 mb-2 shrink-0">
                    <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                        <ApplicationLogo theme="dark" />
                        <div className="flex flex-col">
                            <span className="text-[24px] font-extrabold tracking-tight leading-none text-white">Vendura</span>
                            <span className="text-[9px] font-bold tracking-[0.15em] mt-1 uppercase text-slate-300">
                                Enterprise Compliance
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 text-[14px] font-semibold rounded-lg transition-all ${
                                    isActive
                                        ? 'bg-white text-[var(--color-primary-container)] shadow-md translate-x-1'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <header className="bg-[var(--color-surface)]/80 backdrop-blur-md text-[var(--color-primary)] font-medium border-b border-[var(--color-surface-border)] px-4 md:px-8 py-3 flex items-center sticky top-0 z-10 min-h-[64px]">
                    <div className="flex items-center w-full max-w-[1280px] mx-auto gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)] rounded-md transition-colors"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        
                        <div className="flex-1 flex items-center ml-2 md:ml-0 overflow-hidden mr-2">
                            <div className="min-w-0">
                                <p className="text-[13px] sm:text-[14px] font-bold text-[var(--color-on-surface)] leading-tight truncate">
                                    Welcome back, {user.name.split(' ')[0]}! 👋
                                </p>
                                <p className="text-[10px] sm:text-[12px] text-[var(--color-secondary)] font-medium mt-0.5 truncate">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-4 ml-auto shrink-0 relative">
                            {/* Profile Dropdown Toggle */}
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 hover:bg-[var(--color-surface-container-lowest)] p-1.5 pr-3 rounded-full border border-transparent hover:border-[var(--color-surface-border)] transition-all cursor-pointer select-none"
                            >
                                <img 
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[var(--color-surface-border)] shadow-sm" 
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=041638&color=fff`}
                                    alt={user.name} 
                                />
                                <div className="hidden sm:flex flex-col min-w-0 text-left mr-1">
                                    <span className="text-[14px] font-bold text-slate-900 truncate leading-tight">{user.name}</span>
                                    <span className="text-[12px] text-slate-500 font-medium truncate leading-tight">{user.email}</span>
                                </div>
                                <span className={`material-symbols-outlined text-[18px] text-[var(--color-secondary)] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                                        <Link 
                                            href="/profile" 
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)] transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">person</span>
                                            Profile Settings
                                        </Link>
                                        <div className="h-px bg-[var(--color-surface-border)] my-1"></div>
                                        <Link 
                                            href="/logout" 
                                            method="post" 
                                            as="button"
                                            className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--color-error)] hover:bg-[var(--color-error-container)] transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">logout</span>
                                            Sign Out
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 py-6 md:py-8 px-4 md:px-8">
                    <div className="max-w-[1280px] w-full mx-auto">
                        {/* We inject the explicit header passed from pages just above the content if it exists, 
                            but in Stitch design the header actions (like Export) are part of the page content. 
                            We'll keep the dynamic header prop for backwards compatibility but render it cleanly. */}
                        {header && (
                            <div className="mb-6">
                                {header}
                            </div>
                        )}
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
