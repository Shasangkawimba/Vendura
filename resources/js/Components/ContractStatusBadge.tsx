import { Contract } from '@/types';

export default function ContractStatusBadge({ status }: { status: Contract['status'] }) {
    const statusConfig = {
        'DRAFT': { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-300', label: 'Draft' },
        'MENUNGGU_MANAGER': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-300', label: 'Waiting Manager' },
        'MENUNGGU_FINANCE': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-300', label: 'Waiting Finance' },
        'MENUNGGU_DIREKTUR': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-300', label: 'Waiting Direktur' },
        'AKTIF': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-300', label: 'Active' },
        'DITOLAK': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-300', label: 'Rejected' },
        'EXPIRED': { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-300', label: 'Expired' },
    };

    const config = statusConfig[status] || statusConfig['DRAFT'];

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
}
