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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <Link href="/vendors" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        &larr; Back
                    </Link>
                    <h2 className="font-semibold text-xl leading-tight">Vendor Details</h2>
                </div>
            }
        >
            <Head title={vendor.name} />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* Vendor Info Card */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <h3 className="text-2xl font-bold mb-4">{vendor.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <span className="text-gray-500 block mb-1">Contact Person</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{vendor.contact_person}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">Email</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{vendor.email}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">Phone</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{vendor.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Compliance Requirements */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-6">Compliance Requirements</h3>
                    
                    {/* Add Requirement Form (Manager/Admin Only ideally, but we allow it here for demo) */}
                    <form onSubmit={handleAddRequirement} className="mb-8 flex items-end space-x-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex-grow">
                            <label className="block text-sm font-medium mb-1">New Requirement Name</label>
                            <input 
                                type="text" 
                                value={addData.document_name}
                                onChange={e => setAddData('document_name', e.target.value)}
                                className="w-full border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g. NPWP, TDP, SIUP..."
                                required
                            />
                            {addErrors.document_name && <p className="text-red-500 text-xs mt-1">{addErrors.document_name}</p>}
                        </div>
                        <button 
                            type="submit" 
                            disabled={addProcessing}
                            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 px-4 py-2 rounded-sm text-sm font-medium disabled:opacity-50 transition-colors h-[38px]"
                        >
                            Add Requirement
                        </button>
                    </form>

                    {/* Requirements List */}
                    <div className="space-y-4">
                        {!vendor.compliance_requirements || vendor.compliance_requirements.length === 0 ? (
                            <p className="text-gray-500 text-sm">No compliance requirements defined yet.</p>
                        ) : (
                            vendor.compliance_requirements.map(req => {
                                const isExpired = req.is_fulfilled && req.expiry_date && new Date(req.expiry_date) < new Date();
                                const needsUpload = !req.is_fulfilled || isExpired;

                                return (
                                    <div key={req.id} className={`border rounded-sm p-5 ${req.is_fulfilled && !isExpired ? 'border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{req.document_name}</h4>
                                                    {req.is_fulfilled && !isExpired ? (
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-sm font-medium">Fulfilled</span>
                                                    ) : isExpired ? (
                                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-sm font-medium">Expired</span>
                                                    ) : (
                                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-sm font-medium">Missing</span>
                                                    )}
                                                </div>
                                                
                                                {req.is_fulfilled && req.file_path && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                        <p>Valid until: <span className={`font-medium ${isExpired ? 'text-red-600' : ''}`}>{req.expiry_date}</span></p>
                                                        <a href={`/storage/${req.file_path}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline mt-1 inline-block">
                                                            View Document &rarr;
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            {needsUpload && uploadId !== req.id && (
                                                <button 
                                                    onClick={() => setUploadId(req.id)}
                                                    className="text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-sm font-medium transition-colors border border-indigo-200"
                                                >
                                                    Upload Document
                                                </button>
                                            )}
                                        </div>

                                        {/* Upload Form (only visible when requested) */}
                                        {uploadId === req.id && (
                                            <form onSubmit={(e) => handleUpload(e, req.id)} className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Select File (PDF/Image, Max 5MB)</label>
                                                        <input 
                                                            type="file" 
                                                            onChange={e => setUploadData('document', e.target.files ? e.target.files[0] : null)}
                                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            required
                                                        />
                                                        {uploadErrors.document && <p className="text-red-500 text-xs mt-1">{uploadErrors.document}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Expiry Date</label>
                                                        <input 
                                                            type="date" 
                                                            value={uploadData.expiry_date}
                                                            onChange={e => setUploadData('expiry_date', e.target.value)}
                                                            className="w-full border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800 px-3 py-1.5 text-sm"
                                                            required
                                                        />
                                                        {uploadErrors.expiry_date && <p className="text-red-500 text-xs mt-1">{uploadErrors.expiry_date}</p>}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-3">
                                                    <button 
                                                        type="submit" 
                                                        disabled={uploadProcessing || !uploadData.document}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-sm text-sm font-medium disabled:opacity-50 transition-colors"
                                                    >
                                                        Save Document
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            setUploadId(null);
                                                            resetUpload();
                                                        }}
                                                        className="text-gray-600 hover:bg-gray-100 px-4 py-1.5 rounded-sm text-sm font-medium transition-colors border border-transparent"
                                                    >
                                                        Cancel
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
