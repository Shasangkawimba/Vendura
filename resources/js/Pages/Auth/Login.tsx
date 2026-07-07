import { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';

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
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-[#111827] text-gray-900 dark:text-gray-100 font-sans">
            <Head title="Log in" />

            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-[#1F2937] rounded border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Vendura</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            autoComplete="username"
                            autoFocus
                        />
                        {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            autoComplete="current-password"
                        />
                        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="remember"
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm">Remember me</label>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            Sign In
                        </button>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center border-t border-gray-200 dark:border-gray-800 pt-4">
                        <p>Demo accounts (password: password):</p>
                        <p className="mt-1">admin@vendura.test, manager@vendura.test<br/>finance@vendura.test, direktur@vendura.test</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
