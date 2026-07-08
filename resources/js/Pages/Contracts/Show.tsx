import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Contract } from '@/types';
import ContractStatusBadge from '@/Components/ContractStatusBadge';
import ApprovalTimeline from '@/Components/ApprovalTimeline';
import { useState } from 'react';

export default function Show({ auth, contract }: PageProps<{ contract: Contract }>) {
    const latestVersion = contract.versions && contract.versions.length > 0 
        ? contract.versions[contract.versions.length - 1] 
        : null;

    const { data, setData, post: postForm, processing, reset, errors } = useForm({
        note: '',
    });

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);

    const pendingStage = contract.status === 'MENUNGGU_MANAGER' ? 'MANAGER' :
                         contract.status === 'MENUNGGU_FINANCE' ? 'FINANCE' :
                         contract.status === 'MENUNGGU_DIREKTUR' ? 'DIREKTUR' : null;

    const canApprove = pendingStage === auth.user.role;
    const canSubmit = contract.status === 'DRAFT' && contract.created_by === auth.user.id;

    const submitContract = () => {
        if(confirm('Are you sure you want to submit this contract for approval?')) {
            router.post(`/contracts/${contract.id}/submit`);
        }
    };

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        postForm(`/contracts/${contract.id}/approve`, {
            onSuccess: () => {
                setShowApproveModal(false);
                reset('note');
            },
        });
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        postForm(`/contracts/${contract.id}/reject`, {
            onSuccess: () => {
                setShowRejectModal(false);
                reset('note');
            },
        });
    };

    const { data: versionData, setData: setVersionData, post: postVersion, processing: versionProcessing, reset: resetVersion, errors: versionErrors } = useForm({
        document: null as File | null,
    });

    const handleUploadVersion = (e: React.FormEvent) => {
        e.preventDefault();
        postVersion(`/contracts/${contract.id}/versions`, {
            onSuccess: () => resetVersion('document'),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href="/contracts" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            &larr; Back
                        </Link>
                        <h2 className="font-semibold text-xl leading-tight">Contract Details</h2>
                    </div>
                    {canSubmit && (
                        <button onClick={submitContract} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium rounded-sm">
                            Submit for Approval
                        </button>
                    )}
                </div>
            }
        >
            <Head title={contract.title} />

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{contract.title}</h1>
                                <p className="text-sm text-gray-500">Created by {contract.creator?.name}</p>
                            </div>
                            <ContractStatusBadge status={contract.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Vendor Information</h3>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900 dark:text-white">{contract.vendor?.name}</p>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">{contract.vendor?.contact_person}</p>
                                    <p className="text-gray-600 dark:text-gray-400">{contract.vendor?.email}</p>
                                    <p className="text-gray-600 dark:text-gray-400">{contract.vendor?.phone}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contract Details</h3>
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Value:</span>
                                        <span className="font-medium">Rp {parseInt(contract.value).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Start Date:</span>
                                        <span className="font-medium">{contract.start_date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">End Date:</span>
                                        <span className="font-medium">{contract.end_date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-medium mb-4">Contract Documents</h3>
                        {contract.versions && contract.versions.length > 0 ? (
                            <div className="space-y-3">
                                {contract.versions.slice().reverse().map(version => (
                                    <div key={version.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-sm border border-gray-100 dark:border-gray-700">
                                        <div>
                                            <p className="font-medium text-sm">Version {version.version_number}</p>
                                            <p className="text-xs text-gray-500 mt-1">Uploaded by {version.uploader?.name} on {new Date(version.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <a 
                                            href={`/storage/${version.file_path}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-sm text-indigo-600 font-medium hover:underline"
                                        >
                                            Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No documents uploaded.</p>
                        )}

                        {contract.status === 'DRAFT' && contract.created_by === auth.user.id && (
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-medium mb-3">Upload Revised Document</h4>
                                <form onSubmit={handleUploadVersion} className="flex items-start space-x-4">
                                    <div className="flex-grow">
                                        <input
                                            type="file"
                                            onChange={(e) => setVersionData('document', e.target.files ? e.target.files[0] : null)}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            accept=".pdf,.doc,.docx,.jpg,.png"
                                            required
                                        />
                                        {versionErrors.document && <div className="text-red-500 text-xs mt-1">{versionErrors.document}</div>}
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={versionProcessing || !versionData.document}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium rounded-sm disabled:opacity-50 transition-colors whitespace-nowrap"
                                    >
                                        Upload
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Action Panel for Approver */}
                    {canApprove && (
                        <div className="bg-white dark:bg-gray-800 rounded border border-indigo-200 dark:border-indigo-900 p-6 shadow-sm">
                            <h3 className="text-lg font-medium mb-2 text-indigo-900 dark:text-indigo-100">Pending Your Action</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">This contract requires your approval as {auth.user.role}.</p>
                            <div className="flex flex-col space-y-3">
                                <button 
                                    onClick={() => setShowApproveModal(true)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-sm text-sm font-medium transition-colors"
                                >
                                    Approve Contract
                                </button>
                                <button 
                                    onClick={() => setShowRejectModal(true)}
                                    className="w-full bg-white dark:bg-gray-800 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 py-2 rounded-sm text-sm font-medium transition-colors"
                                >
                                    Reject Contract
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-medium mb-4">Approval History</h3>
                        <ApprovalTimeline histories={contract.approvalHistories || []} />
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-bold mb-4">Reject Contract</h3>
                        <form onSubmit={handleReject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Reason for Rejection (Required)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={data.note}
                                    onChange={e => setData('note', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-sm bg-transparent"
                                    placeholder="Please provide details..."
                                ></textarea>
                                {errors.note && <div className="text-red-500 text-xs mt-1">{errors.note}</div>}
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm bg-red-600 text-white rounded-sm hover:bg-red-700 disabled:opacity-50">Confirm Rejection</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Approve Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-bold mb-4">Approve Contract</h3>
                        <form onSubmit={handleApprove}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Approval Note (Optional)</label>
                                <textarea
                                    rows={3}
                                    value={data.note}
                                    onChange={e => setData('note', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-sm bg-transparent"
                                    placeholder="Add any notes..."
                                ></textarea>
                                {errors.note && <div className="text-red-500 text-xs mt-1">{errors.note}</div>}
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowApproveModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm bg-green-600 text-white rounded-sm hover:bg-green-700 disabled:opacity-50">Confirm Approval</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
