import { ApprovalHistory } from '@/types';

export default function ApprovalTimeline({ histories }: { histories: ApprovalHistory[] }) {
    if (!histories || histories.length === 0) {
        return (
            <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-3">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-[14px] text-slate-500">No approval history yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-0">
            {histories.map((history, index) => {
                const isApproved = history.decision === 'APPROVED';
                const isLast = index === histories.length - 1;

                return (
                    <div key={history.id} className="relative flex gap-4">
                        {/* Timeline connector */}
                        <div className="flex flex-col items-center">
                            <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                                isApproved ? 'bg-emerald-500' : 'bg-red-500'
                            }`} />
                            {!isLast && (
                                <div className="w-px flex-1 my-1.5 bg-slate-200" />
                            )}
                        </div>

                        {/* Content */}
                        <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                            <div className="flex items-center gap-2.5 mb-1">
                                <h4 className="text-[14px] font-semibold text-slate-900">
                                    {history.stage}
                                </h4>
                                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                                    isApproved ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                    {history.decision}
                                </span>
                            </div>
                            <p className="text-[12px] text-slate-500 font-medium">
                                by <span className="text-slate-700">{history.approver?.name}</span>
                                <span className="mx-2 text-slate-300">|</span>
                                <span className="tabular-nums">
                                    {new Date(history.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'short', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </p>
                            {history.note && (
                                <div className="mt-3 text-[13px] text-slate-600 bg-slate-50 border border-slate-100 pl-4 pr-3 py-2.5 rounded-[var(--radius-card)]">
                                    <span className="italic">"{history.note}"</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
