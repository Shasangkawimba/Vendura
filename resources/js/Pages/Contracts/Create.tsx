import { FormEventHandler } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Vendor } from '@/types';

export default function Create({ auth, vendors }: PageProps<{ vendors: Vendor[] }>) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        vendor_id: '',
        value: '',
        start_date: '',
        end_date: '',
        document: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/contracts');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <Link href="/contracts" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        &larr; Back
                    </Link>
                    <h2 className="font-semibold text-xl leading-tight">Create Contract</h2>
                </div>
            }
        >
            <Head title="Create Contract" />

            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-6">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Contract Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Vendor</label>
                            <select
                                value={data.vendor_id}
                                onChange={(e) => setData('vendor_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="" disabled>Select Vendor</option>
                                {vendors.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                            {errors.vendor_id && <div className="text-red-500 text-xs mt-1">{errors.vendor_id}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Value (IDR)</label>
                            <input
                                type="number"
                                min="0"
                                value={data.value}
                                onChange={(e) => setData('value', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            {errors.value && <div className="text-red-500 text-xs mt-1">{errors.value}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date</label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            {errors.start_date && <div className="text-red-500 text-xs mt-1">{errors.start_date}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Date</label>
                            <input
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            {errors.end_date && <div className="text-red-500 text-xs mt-1">{errors.end_date}</div>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Initial Document</label>
                        <input
                            type="file"
                            onChange={(e) => setData('document', e.target.files ? e.target.files[0] : null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            accept=".pdf,.doc,.docx,.jpg,.png"
                        />
                        {errors.document && <div className="text-red-500 text-xs mt-1">{errors.document}</div>}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            Save Contract
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
