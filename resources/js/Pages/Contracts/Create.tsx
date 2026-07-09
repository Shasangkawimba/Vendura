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

    const inputClasses = "w-full px-4 py-3 text-[14px] border border-slate-300 rounded-[var(--radius-button)] bg-white text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-colors";
    const labelClasses = "block text-[14px] font-bold text-slate-700 mb-2";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href="/contracts"
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm transition-default hover:bg-slate-50 active:scale-[0.96]"
                    >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <h2 className="text-[24px] font-bold tracking-tight text-slate-900">Create Contract</h2>
                </div>
            }
        >
            <Head title="Create Contract" />

            <div className="max-w-3xl mx-auto rounded-[var(--radius-card)] bg-white border border-[var(--color-border-subtle)] shadow-sm p-8">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className={labelClasses}>Contract Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={inputClasses}
                        />
                        {errors.title && <div className="text-red-500 text-[12px] mt-2 font-medium">{errors.title}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Vendor</label>
                            <select
                                value={data.vendor_id}
                                onChange={(e) => setData('vendor_id', e.target.value)}
                                className={inputClasses}
                            >
                                <option value="" disabled>Select Vendor</option>
                                {vendors.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                            {errors.vendor_id && <div className="text-red-500 text-[12px] mt-2 font-medium">{errors.vendor_id}</div>}
                        </div>
                        <div>
                            <label className={labelClasses}>Value (IDR)</label>
                            <input
                                type="number"
                                min="0"
                                value={data.value}
                                onChange={(e) => setData('value', e.target.value)}
                                className={inputClasses}
                            />
                            {errors.value && <div className="text-red-500 text-[12px] mt-2 font-medium">{errors.value}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Start Date</label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className={inputClasses}
                            />
                            {errors.start_date && <div className="text-red-500 text-[12px] mt-2 font-medium">{errors.start_date}</div>}
                        </div>
                        <div>
                            <label className={labelClasses}>End Date</label>
                            <input
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className={inputClasses}
                            />
                            {errors.end_date && <div className="text-red-500 text-[12px] mt-2 font-medium">{errors.end_date}</div>}
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Initial Document</label>
                        <input
                            type="file"
                            onChange={(e) => setData('document', e.target.files ? e.target.files[0] : null)}
                            className="w-full text-[14px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-[var(--radius-button)] file:border-0 file:text-[13px] file:font-semibold file:bg-blue-50 file:text-[var(--color-primary)] hover:file:bg-blue-100 transition-colors cursor-pointer"
                            accept=".pdf,.doc,.docx,.jpg,.png"
                        />
                        {errors.document && <div className="text-red-500 text-[12px] mt-2 font-medium">{errors.document}</div>}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--color-primary-container)] hover:bg-slate-800 text-white font-semibold py-2.5 px-8 rounded-[var(--radius-button)] transition-default disabled:opacity-50 active:scale-[0.98] text-[14px] shadow-sm"
                        >
                            Save Contract
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
