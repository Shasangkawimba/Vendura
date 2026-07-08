import { ApprovalHistory } from '@/types';

export default function ApprovalTimeline({ histories }: { histories: ApprovalHistory[] }) {
    if (!histories || histories.length === 0) {
        return <p className="text-sm text-gray-500">No approval history yet.</p>;
    }

    return (
        <div className="space-y-6">
            {histories.map((history) => (
                <div key={history.id} className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                    <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${
                        history.decision === 'APPROVED' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                {history.stage}
                            </h4>
                            <span className="text-xs text-gray-500">
                                {new Date(history.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {history.decision === 'APPROVED' ? 'Approved by ' : 'Rejected by '} 
                            <span className="font-medium text-gray-900 dark:text-gray-200">{history.approver?.name}</span>
                        </p>
                        {history.note && (
                            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-sm italic border-l-4 border-gray-300 dark:border-gray-600">
                                "{history.note}"
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
