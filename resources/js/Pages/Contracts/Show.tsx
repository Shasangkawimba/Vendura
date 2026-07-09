import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Contract } from '@/types';
import { useState } from 'react';

export default function Show({ auth, contract }: PageProps<{ contract: Contract }>) {
    const latestVersion = contract.versions && contract.versions.length > 0
        ? contract.versions[contract.versions.length - 1]
        : null;

    const { data, setData, post: postForm, processing, reset, errors } = useForm({
        note: '',
    });

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
                reset('note');
            },
        });
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        postForm(`/contracts/${contract.id}/reject`, {
            onSuccess: () => {
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

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'AKTIF':
                return 'bg-[var(--color-status-active)]/10 text-[var(--color-status-active)] border-[var(--color-status-active)]/20';
            case 'DITOLAK':
            case 'EXPIRED':
                return 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)] border-[var(--color-error-container)]';
            case 'DRAFT':
                return 'bg-[var(--color-surface-container-high)] text-[var(--color-secondary)] border-[var(--color-surface-border)]';
            default: // Pending
                return 'bg-[var(--color-status-pending)]/10 text-[var(--color-status-pending)] border-[var(--color-status-pending)]/20';
        }
    };

    const getStatusLabel = (status: string) => {
        if (status.startsWith('MENUNGGU_')) return 'Pending Approval';
        return status;
    };

    const stages = ['MANAGER', 'FINANCE', 'DIREKTUR'];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={null} // Header rendered inside for full width control
        >
            <Head title={contract.title} />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold border ${getStatusStyle(contract.status)}`}>
                            {getStatusLabel(contract.status)}
                        </span>
                        <span className="font-mono text-[13px] text-[var(--color-secondary)]">ID: C-{contract.id.toString().padStart(4, '0')}</span>
                    </div>
                    <h2 className="text-[24px] sm:text-[30px] font-bold text-[var(--color-on-surface)] tracking-tight leading-none">{contract.title}</h2>
                    <p className="text-[14px] sm:text-[16px] text-[var(--color-secondary)] mt-2">Vendor: {contract.vendor?.name} • Initiated by: {contract.creator?.name}</p>
                </div>
                {canSubmit && (
                    <button
                        onClick={submitContract}
                        className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] px-5 py-2.5 text-[14px] font-semibold rounded-lg transition-colors shadow-sm"
                    >
                        Submit for Approval
                    </button>
                )}
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-12 gap-6">
                
                {/* Left Column: Document Preview & Details (8 columns) */}
                <div className="col-span-12 xl:col-span-8 space-y-6">
                    
                    {/* Document Preview Card */}
                    <div className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-surface-border)] shadow-[var(--shadow-enterprise)] overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 border-b border-[var(--color-surface-border)] flex justify-between items-center bg-[var(--color-surface-bright)]">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[var(--color-secondary)]">picture_as_pdf</span>
                                <h3 className="text-[14px] font-semibold text-[var(--color-on-surface)]">
                                    {latestVersion ? `Version ${latestVersion.version_number}` : 'No Document'}
                                </h3>
                            </div>
                            {latestVersion && (
                                <div className="flex gap-2">
                                    <a
                                        href={`/storage/${latestVersion.file_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-1.5 text-[var(--color-secondary)] hover:text-[var(--color-primary)] rounded hover:bg-[var(--color-surface-container)] transition-colors ml-2"
                                        title="Download"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">download</span>
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 bg-[var(--color-surface-container)] flex items-center justify-center p-8 overflow-y-auto relative">
                            {latestVersion ? (
                                (() => {
                                    const path = `/storage/${latestVersion.file_path}`;
                                    const isPdf = /\.pdf$/i.test(path);
                                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(path);

                                    if (isPdf) {
                                        return (
                                            <iframe 
                                                src={path} 
                                                className="w-full h-full min-h-[800px] rounded border border-[var(--color-surface-border)] shadow-sm bg-white" 
                                                title="Document Preview"
                                            />
                                        );
                                    } else if (isImage) {
                                        return (
                                            <div className="w-full h-full min-h-[800px] flex items-center justify-center bg-[var(--color-surface-container-lowest)] rounded border border-[var(--color-surface-border)] shadow-sm p-4">
                                                <img 
                                                    src={path} 
                                                    alt="Document Preview" 
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className="text-center space-y-3">
                                                <span className="material-symbols-outlined text-[48px] text-[var(--color-surface-border)]">insert_drive_file</span>
                                                <p className="text-[14px] text-[var(--color-secondary)]">Preview not available for this file type.</p>
                                                <a
                                                    href={path}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-block mt-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-2 rounded-lg text-sm font-semibold"
                                                >
                                                    Download to View
                                                </a>
                                            </div>
                                        );
                                    }
                                })()
                            ) : (
                                <div className="text-center space-y-3">
                                    <span className="material-symbols-outlined text-[48px] text-[var(--color-surface-border)]">description</span>
                                    <p className="text-[14px] text-[var(--color-secondary)]">No document uploaded.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contract Details Grid */}
                    <div className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-surface-border)] shadow-[var(--shadow-enterprise)] p-6">
                        <h3 className="text-[20px] font-semibold mb-4 border-b border-[var(--color-surface-border)] pb-2 text-[var(--color-on-surface)]">Contract Meta Data</h3>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <span className="block text-[12px] font-semibold text-[var(--color-secondary)] mb-1">Contract Value</span>
                                <span className="text-[14px] text-[var(--color-on-surface)]">Rp {parseInt(contract.value).toLocaleString('id-ID')}</span>
                            </div>
                            <div>
                                <span className="block text-[12px] font-semibold text-[var(--color-secondary)] mb-1">Effective Date</span>
                                <span className="text-[14px] text-[var(--color-on-surface)]">{new Date(contract.start_date).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="block text-[12px] font-semibold text-[var(--color-secondary)] mb-1">Expiration Date</span>
                                <span className="text-[14px] text-[var(--color-on-surface)]">{new Date(contract.end_date).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="block text-[12px] font-semibold text-[var(--color-secondary)] mb-1">Vendor Contact</span>
                                <span className="text-[14px] text-[var(--color-on-surface)]">{contract.vendor?.contact_person}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Workflow, Actions, History (4 columns) */}
                <div className="col-span-12 xl:col-span-4 space-y-6">
                    
                    {/* Action / Review Card */}
                    {canApprove && (
                        <div className="bg-[var(--color-surface-container-lowest)] rounded-xl border-2 border-[var(--color-primary-fixed)] shadow-[var(--shadow-enterprise)] p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-primary)]"></div>
                            <h3 className="text-[20px] font-semibold mb-4 text-[var(--color-on-surface)]">Your Action Required</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[14px] font-semibold text-[var(--color-on-surface)] mb-2">Review Notes (Audit Trail)</label>
                                    <textarea
                                        value={data.note}
                                        onChange={e => setData('note', e.target.value)}
                                        className="w-full border border-[var(--color-surface-border)] rounded-md p-3 text-[14px] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-[var(--color-surface-bright)]"
                                        placeholder="Enter compliance or financial notes..."
                                        rows={3}
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleApprove}
                                        disabled={processing}
                                        className="flex-1 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[14px] font-semibold py-2.5 rounded border-b border-[var(--color-primary-container)] hover:bg-[var(--color-primary)]/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                        Approve
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={processing}
                                        className="flex-1 bg-[var(--color-surface-container-lowest)] text-[var(--color-status-rejected)] text-[14px] font-semibold py-2.5 rounded border border-[var(--color-status-rejected)]/30 hover:bg-[var(--color-error-container)]/20 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">cancel</span>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Approval Workflow Timeline */}
                    <div className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-surface-border)] shadow-[var(--shadow-enterprise)] p-6">
                        <h3 className="text-[20px] font-semibold mb-6 text-[var(--color-on-surface)]">Approval Workflow</h3>
                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[var(--color-surface-border)]"></div>
                            
                            {stages.map((stage) => {
                                const history = contract.approval_histories?.find(h => h.stage === stage);
                                const isCurrent = pendingStage === stage;
                                const isWaiting = !history && !isCurrent;
                                const isApproved = history?.decision === 'APPROVED';
                                const isRejected = history?.decision === 'REJECTED';
                                
                                return (
                                    <div key={stage} className={`relative flex items-start gap-4 ${stage !== 'DIREKTUR' ? 'mb-6' : ''}`}>
                                        
                                        {/* Node Icon */}
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border-2 mt-0.5 ${
                                            isApproved ? 'bg-[var(--color-status-active)] border-[var(--color-surface-container-lowest)]' :
                                            isRejected ? 'bg-[var(--color-status-rejected)] border-[var(--color-surface-container-lowest)]' :
                                            isCurrent ? 'bg-[var(--color-surface-container-lowest)] border-[var(--color-status-pending)]' :
                                            'bg-[var(--color-surface-container-lowest)] border-[var(--color-surface-border)]'
                                        }`}>
                                            {isApproved && <span className="material-symbols-outlined text-[14px] text-[var(--color-on-primary)] font-bold">check</span>}
                                            {isRejected && <span className="material-symbols-outlined text-[14px] text-[var(--color-on-primary)] font-bold">close</span>}
                                            {isCurrent && <div className="w-2 h-2 rounded-full bg-[var(--color-status-pending)]"></div>}
                                        </div>

                                        {/* Node Content */}
                                        {isCurrent ? (
                                            <div className="flex-1 bg-[var(--color-surface-bright)] border border-[var(--color-status-pending)]/20 rounded p-3 -mt-2">
                                                <div className="flex items-baseline justify-between w-full gap-4 mb-1">
                                                    <span className="text-[14px] font-semibold text-[var(--color-on-surface)] capitalize">{stage.toLowerCase()} Review</span>
                                                    <span className="px-2 py-0.5 bg-[var(--color-status-pending)]/10 text-[var(--color-status-pending)] text-[10px] uppercase font-bold rounded">Current</span>
                                                </div>
                                                <p className="text-[12px] text-[var(--color-secondary)]">Awaiting {stage.toLowerCase()} review.</p>
                                            </div>
                                        ) : (
                                            <div className="flex-1 w-full">
                                                <div className="flex items-baseline justify-between w-full gap-4">
                                                    <span className={`text-[14px] font-semibold capitalize ${isWaiting ? 'text-[var(--color-secondary)]' : 'text-[var(--color-on-surface)]'}`}>
                                                        {stage.toLowerCase()} {isWaiting ? 'Director' : 'Review'}
                                                    </span>
                                                    {history && <span className="font-mono text-[13px] text-[var(--color-secondary)] text-xs">{new Date(history.created_at).toLocaleDateString()}</span>}
                                                </div>
                                                <p className={`text-[12px] mt-1 ${isWaiting ? 'text-[var(--color-surface-border)]' : 'text-[var(--color-secondary)]'}`}>
                                                    {history ? (
                                                        <>
                                                            {history.decision === 'APPROVED' ? 'Approved' : 'Rejected'} by {history.approver?.name}
                                                            {history.note && <span className="block italic mt-1 bg-[var(--color-surface-container)] p-2 rounded">"{history.note}"</span>}
                                                        </>
                                                    ) : (
                                                        'Waiting'
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Version History */}
                    <div className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-surface-border)] shadow-[var(--shadow-enterprise)] p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[20px] font-semibold text-[var(--color-on-surface)]">Version History</h3>
                            {contract.status === 'DRAFT' && contract.created_by === auth.user.id && (
                                <form onSubmit={handleUploadVersion} className="flex gap-2 items-center">
                                    <label className="text-[var(--color-primary)] text-[12px] font-semibold hover:underline cursor-pointer">
                                        Upload New
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx,.jpg,.png"
                                            onChange={(e) => {
                                                if(e.target.files && e.target.files[0]) {
                                                    setVersionData('document', e.target.files[0]);
                                                    // Trigger submit immediately after file select for better UX, or rely on a button. Let's just use a submit button.
                                                }
                                            }}
                                        />
                                    </label>
                                    {versionData.document && (
                                        <button type="submit" className="px-2 py-1 bg-[var(--color-surface-container-low)] text-[12px] rounded border border-[var(--color-surface-border)] hover:bg-[var(--color-surface-container-high)]">
                                            Save
                                        </button>
                                    )}
                                </form>
                            )}
                        </div>
                        <ul className="space-y-3">
                            {!contract.versions || contract.versions.length === 0 ? (
                                <li className="text-[12px] text-[var(--color-secondary)]">No versions yet.</li>
                            ) : (
                                contract.versions.slice().reverse().map((version, index) => {
                                    const isCurrent = index === 0;
                                    return (
                                        <li key={version.id} className="flex items-center justify-between p-2 rounded hover:bg-[var(--color-surface-bright)] transition-colors group cursor-pointer border border-transparent hover:border-[var(--color-surface-border)]">
                                            <div className="flex items-center gap-3">
                                                <span className={`material-symbols-outlined text-[20px] ${isCurrent ? 'text-[var(--color-secondary)]' : 'text-[var(--color-surface-border)]'}`}>description</span>
                                                <div>
                                                    <span className={`block text-[12px] font-semibold ${isCurrent ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-secondary)]'}`}>
                                                        v{version.version_number}.0 {isCurrent && '(Current)'}
                                                    </span>
                                                    <span className={`block text-[12px] ${isCurrent ? 'text-[var(--color-secondary)]' : 'text-[var(--color-surface-border)]'}`}>
                                                        {new Date(version.created_at).toLocaleDateString()} • {version.uploader?.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <a href={`/storage/${version.file_path}`} target="_blank" rel="noreferrer" className="font-mono text-[13px] text-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                                                View
                                            </a>
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
