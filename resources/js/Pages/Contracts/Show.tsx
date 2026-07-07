import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Contract } from '@/types';
import ContractStatusBadge from '@/Components/ContractStatusBadge';

export default function Show({ auth, contract }: PageProps<{ contract: Contract }>) {
    const latestVersion = contract.versions && contract.versions.length > 0 
        ? contract.versions[contract.versions.length - 1] 
        : null;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <Link href="/contracts" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        &larr; Back
                    </Link>
                    <h2 className="font-semibold text-xl leading-tight">Contract Details</h2>
                </div>
            }
        >
            <Head title={contract.title} />

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content: Info & Vendor */}
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

                    {/* Document Version Area Placeholder (Phase 5) */}
                    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-medium mb-4">Contract Documents</h3>
                        {latestVersion ? (
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-sm">
                                <div>
                                    <p className="font-medium text-sm">Version {latestVersion.version_number}</p>
                                    <p className="text-xs text-gray-500 mt-1">Uploaded by {latestVersion.uploader?.name} on {new Date(latestVersion.created_at).toLocaleDateString()}</p>
                                </div>
                                <a 
                                    href={`/storage/${latestVersion.file_path}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-sm text-indigo-600 font-medium hover:underline"
                                >
                                    Download
                                </a>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No documents uploaded.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar: Approval History (Phase 4 Placeholder) */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-medium mb-4">Approval History</h3>
                        {contract.approvalHistories && contract.approvalHistories.length > 0 ? (
                            <div className="space-y-4">
                                {contract.approvalHistories.map(history => (
                                    <div key={history.id} className="border-l-2 border-indigo-200 pl-4 py-1">
                                        <p className="text-sm font-medium">{history.stage} - {history.decision}</p>
                                        <p className="text-xs text-gray-500 mt-1">By {history.approver?.name}</p>
                                        {history.note && <p className="text-xs mt-2 italic text-gray-600 bg-gray-50 p-2 rounded">{history.note}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No approval history yet.</p>
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
