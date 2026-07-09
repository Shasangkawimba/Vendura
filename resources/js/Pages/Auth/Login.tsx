import { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-sans bg-slate-50">
            <Head title="Log in" />

            <div className="w-full max-w-sm px-4">
                {/* Brand */}
                <div className="flex justify-center mb-10">
                    <ApplicationLogo theme="light" />
                </div>

                {/* Form Card */}
                <div className="rounded-[var(--radius-card)] bg-white border border-[var(--color-border-subtle)] shadow-sm p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-[14px] font-bold text-slate-700 mb-2" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 text-[14px] border border-slate-300 rounded-[var(--radius-button)] bg-white text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-colors"
                                autoComplete="username"
                                autoFocus
                            />
                            {errors.email && <div className="text-red-500 text-[12px] mt-2 font-medium">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-[14px] font-bold text-slate-700 mb-2" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-3 text-[14px] border border-slate-300 rounded-[var(--radius-button)] bg-white text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-colors"
                                autoComplete="current-password"
                            />
                            {errors.password && <div className="text-red-500 text-[12px] mt-2 font-medium">{errors.password}</div>}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            />
                            <label htmlFor="remember" className="ml-2 block text-[14px] font-medium text-slate-600">Remember me</label>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[var(--color-primary-container)] hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-[var(--radius-button)] transition-default disabled:opacity-50 active:scale-[0.98] text-[14px] shadow-sm"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>

                {/* Demo accounts */}
                <div className="mt-8 text-center">
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">Demo Accounts</p>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                        <code className="font-mono text-[12px] bg-white border border-slate-200 px-1.5 py-0.5 rounded">admin@vendura.test</code>
                        {' '}
                        <code className="font-mono text-[12px] bg-white border border-slate-200 px-1.5 py-0.5 rounded">manager@vendura.test</code>
                    </p>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed mt-2">
                        <code className="font-mono text-[12px] bg-white border border-slate-200 px-1.5 py-0.5 rounded">finance@vendura.test</code>
                        {' '}
                        <code className="font-mono text-[12px] bg-white border border-slate-200 px-1.5 py-0.5 rounded">direktur@vendura.test</code>
                    </p>
                    <p className="text-[13px] text-slate-500 font-medium mt-3">
                        Password: <code className="font-mono text-[12px] bg-white border border-slate-200 px-1.5 py-0.5 rounded">password</code>
                    </p>
                </div>
            </div>
        </div>
    );
}
