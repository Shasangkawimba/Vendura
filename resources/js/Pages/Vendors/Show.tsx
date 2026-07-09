import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Vendor } from '@/types';
import { useState } from 'react';

interface ComplianceRequirement {
    id: number;
    vendor_id: number;
    document_name: string;
    is_fulfilled: boolean;
    file_path: string | null;
    expiry_date: string | null;
    created_at: string;
    updated_at: string;
}

export default function Show({ auth, vendor }: PageProps<{ vendor: Vendor & { compliance_requirements: ComplianceRequirement[] } }>) {

    const { data: addData, setData: setAddData, post: postAdd, processing: addProcessing, reset: resetAdd, errors: addErrors } = useForm({
        document_name: '',
    });

    const [uploadId, setUploadId] = useState<number | null>(null);
    const { data: uploadData, setData: setUploadData, post: postUpload, processing: uploadProcessing, reset: resetUpload, errors: uploadErrors } = useForm({
        document: null as File | null,
        expiry_date: '',
    });

    const handleAddRequirement = (e: React.FormEvent) => {
        e.preventDefault();
        postAdd(`/vendors/${vendor.id}/compliance`, {
            onSuccess: () => resetAdd(),
        });
    };

    const handleUpload = (e: React.FormEvent, reqId: number) => {
        e.preventDefault();
        postUpload(`/compliance/${reqId}/upload`, {
            onSuccess: () => {
                setUploadId(null);
                resetUpload();
            },
        });
    };

    const inputClasses = "w-full px-4 py-3 text-[14px] border border-slate-300 rounded-[var(--radius-button)] bg-white text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-colors";

    const allOptions = ['Izin Usaha', 'NPWP', 'Sertifikat ISO'];
    const existingReqs = vendor.compliance_requirements?.map(r => r.document_name.toLowerCase()) || [];
    const availableOptions = allOptions.filter(opt => !existingReqs.includes(opt.toLowerCase()));

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link
                        href="/vendors"
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] shadow-sm transition-default hover:bg-[var(--color-surface-container-low)] active:scale-[0.96] shrink-0"
                    >
                        <span className="material-symbols-outlined text-[20px] text-[var(--color-secondary)]">arrow_back</span>
                    </Link>
                    <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-[var(--color-on-surface)] truncate max-w-[240px] sm:max-w-xl">{vendor.name}</h2>
                </div>
            }
        >
            <Head title={vendor.name} />

            <div className="space-y-6">

                {/* Vendor Profile */}
                <div className="rounded-xl bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] shadow-[var(--shadow-enterprise)] p-6 sm:p-8">
                    <h3 className="text-[16px] font-bold text-slate-900 mb-6">Vendor Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        <div>
                            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">Contact</span>
                            <span className="text-[16px] font-bold text-slate-900">{vendor.contact_person}</span>
                        </div>
                        <div>
                            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">Email</span>
                            <span className="text-[16px] font-bold text-slate-900 break-all">{vendor.email}</span>
                        </div>
                        <div>
                            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">Phone</span>
                            <span className="text-[16px] font-bold tabular-nums text-slate-900">{vendor.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Compliance Requirements */}
                <div className="rounded-xl bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] shadow-[var(--shadow-enterprise)] p-6 sm:p-8">
                    <h3 className="text-[16px] font-bold text-slate-900 mb-6">Compliance Requirements</h3>

                    {/* Add Requirement Form */}
                    <form onSubmit={handleAddRequirement} className="mb-8 flex flex-col sm:flex-row sm:items-end gap-4 p-5 sm:p-6 rounded-[var(--radius-card)] border border-slate-200 bg-slate-50/50">
                        <div className="flex-grow w-full">
                            <label className="block text-[14px] font-bold text-slate-700 mb-2">New Requirement</label>
                            <select
                                value={addData.document_name}
                                onChange={e => setAddData('document_name', e.target.value)}
                                className={inputClasses + " cursor-pointer pr-10 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.25em_1.25em] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"}
                                required
                                disabled={availableOptions.length === 0}
                            >
                                <option value="" disabled>
                                    {availableOptions.length === 0 ? "All requirements added" : "Select document requirement..."}
                                </option>
                                {availableOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            {addErrors.document_name && <p className="text-red-500 text-[12px] mt-2 font-medium">{addErrors.document_name}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={addProcessing || availableOptions.length === 0}
                            className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-semibold py-3 px-6 rounded-lg transition-default disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed active:scale-[0.98] text-[14px] shadow-sm shrink-0"
                        >
                            Add Requirement
                        </button>
                    </form>

                    {/* Requirements List */}
                    <div className="space-y-4">
                        {!vendor.compliance_requirements || vendor.compliance_requirements.length === 0 ? (
                            <div className="py-16 rounded-xl border-2 border-dashed border-[var(--color-surface-border)] flex flex-col items-center justify-center bg-[var(--color-surface-container-low)]">
                                <div className="w-12 h-12 rounded-full border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] shadow-sm flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-[24px] text-[var(--color-secondary)]">assignment</span>
                                </div>
                                <p className="text-[14px] font-medium text-[var(--color-secondary)]">No compliance requirements defined yet.</p>
                            </div>
                        ) : (
                            vendor.compliance_requirements.map(req => {
                                const isExpired = req.is_fulfilled && req.expiry_date && new Date(req.expiry_date) < new Date();
                                const needsUpload = !req.is_fulfilled || isExpired;

                                const statusDot = req.is_fulfilled && !isExpired
                                    ? 'bg-emerald-500'
                                    : isExpired
                                        ? 'bg-red-500'
                                        : 'bg-amber-500';

                                const statusLabel = req.is_fulfilled && !isExpired
                                    ? 'Fulfilled'
                                    : isExpired
                                        ? 'Expired'
                                        : 'Missing';

                                const statusColor = req.is_fulfilled && !isExpired
                                    ? 'text-emerald-700 bg-emerald-100'
                                    : isExpired
                                        ? 'text-red-700 bg-red-100'
                                        : 'text-amber-700 bg-amber-100';

                                return (
                                    <div
                                        key={req.id}
                                        className="rounded-xl border border-[var(--color-surface-border)] p-6 transition-default hover:border-[var(--color-primary)] hover:shadow-sm bg-[var(--color-surface-container-lowest)]"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="text-[16px] font-bold text-slate-900">{req.document_name}</h4>
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[var(--radius-pill)] text-[12px] font-bold tracking-wide uppercase ${statusColor}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                                                        {statusLabel}
                                                    </span>
                                                </div>

                                                {req.is_fulfilled && req.file_path && (
                                                    <div className="text-[14px] text-slate-500 mt-3 space-y-1">
                                                        <p>
                                                            Valid until:{' '}
                                                            <span className={`font-bold tabular-nums ${isExpired ? 'text-red-600' : 'text-slate-900'}`}>
                                                                {req.expiry_date?.substring(0, 10)}
                                                            </span>
                                                        </p>
                                                        <a
                                                            href={`/storage/${req.file_path}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-[var(--color-primary)] hover:text-blue-700 font-bold transition-colors inline-flex items-center gap-1 mt-1"
                                                        >
                                                            View Document
                                                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            {needsUpload && uploadId !== req.id && (
                                                <button
                                                    onClick={() => setUploadId(req.id)}
                                                    className="shrink-0 text-[14px] font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-[var(--radius-button)] transition-default active:scale-[0.98] shadow-sm bg-white"
                                                >
                                                    Upload Document
                                                </button>
                                            )}
                                        </div>

                                        {/* Upload Form */}
                                        {uploadId === req.id && (
                                            <form onSubmit={(e) => handleUpload(e, req.id)} className="mt-6 pt-6 border-t border-slate-100">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                    <div>
                                                        <label className="block text-[14px] font-bold text-slate-700 mb-2">File (PDF/Image, max 5MB)</label>
                                                        <input
                                                            type="file"
                                                            onChange={e => setUploadData('document', e.target.files ? e.target.files[0] : null)}
                                                            className="w-full text-[14px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-[var(--radius-button)] file:border-0 file:text-[13px] file:font-semibold file:bg-blue-50 file:text-[var(--color-primary)] hover:file:bg-blue-100 transition-colors cursor-pointer"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            required
                                                        />
                                                        {uploadErrors.document && <p className="text-red-500 text-[12px] mt-2 font-medium">{uploadErrors.document}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-[14px] font-bold text-slate-700 mb-2">Expiry Date</label>
                                                        <input
                                                            type="date"
                                                            value={uploadData.expiry_date}
                                                            onChange={e => setUploadData('expiry_date', e.target.value)}
                                                            className={inputClasses}
                                                            required
                                                        />
                                                        {uploadErrors.expiry_date && <p className="text-red-500 text-[12px] mt-2 font-medium">{uploadErrors.expiry_date}</p>}
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setUploadId(null);
                                                            resetUpload();
                                                        }}
                                                        className="px-5 py-2.5 text-[14px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-[var(--radius-button)] transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={uploadProcessing || !uploadData.document}
                                                        className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-semibold py-2.5 px-6 rounded-lg transition-default disabled:opacity-50 active:scale-[0.98] shadow-sm"
                                                    >
                                                        Save Upload
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
