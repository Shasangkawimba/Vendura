import { Contract } from '@/types';

const statusConfig: Record<Contract['status'], { bg: string; text: string; border: string; label: string }> = {
    'DRAFT': {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200',
        label: 'Draft',
    },
    'MENUNGGU_MANAGER': {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        border: 'border-amber-200',
        label: 'Waiting Manager',
    },
    'MENUNGGU_FINANCE': {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        border: 'border-amber-200',
        label: 'Waiting Finance',
    },
    'MENUNGGU_DIREKTUR': {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        border: 'border-amber-200',
        label: 'Waiting Direktur',
    },
    'AKTIF': {
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        label: 'Active',
    },
    'DITOLAK': {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        label: 'Rejected',
    },
    'EXPIRED': {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200',
        label: 'Expired',
    },
};

export default function ContractStatusBadge({ status }: { status: Contract['status'] }) {
    const config = statusConfig[status] || statusConfig['DRAFT'];

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-pill)] text-[12px] font-semibold tracking-wide ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
}
