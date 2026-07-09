import { Contract } from '@/types';
import { Link } from '@inertiajs/react';
import ContractStatusBadge from './ContractStatusBadge';

export default function ContractCard({ contract }: { contract: Contract }) {
    return (
        <Link
            href={`/contracts/${contract.id}`}
            className="block rounded-xl bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] transition-default hover:border-[var(--color-primary)] active:scale-[0.99] group hover:shadow-[var(--shadow-enterprise)]"
        >
            <div className="p-5">
                {/* Header: title + badge */}
                <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="min-w-0">
                        <h3 className="text-[16px] font-bold text-[var(--color-on-surface)] line-clamp-1 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                            {contract.title}
                        </h3>
                        <p className="text-[14px] text-[var(--color-secondary)] mt-1">{contract.vendor?.name}</p>
                    </div>
                    <div className="shrink-0">
                        <ContractStatusBadge status={contract.status} />
                    </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="block text-[var(--color-secondary)] text-[12px] uppercase tracking-wider font-semibold mb-1">Value</span>
                        <span className="text-[14px] font-bold tabular-nums text-[var(--color-on-surface)]">
                            Rp {parseInt(contract.value).toLocaleString('id-ID')}
                        </span>
                    </div>
                    <div>
                        <span className="block text-[var(--color-secondary)] text-[12px] uppercase tracking-wider font-semibold mb-1">Period</span>
                        <span className="text-[13px] font-medium tabular-nums text-[var(--color-secondary)]">
                            {contract.start_date.substring(0, 10)} to {contract.end_date.substring(0, 10)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 flex justify-between items-center border-t border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] rounded-b-xl">
                <span className="text-[12px] font-medium text-[var(--color-secondary)] tabular-nums">#{contract.id}</span>
                <span className="text-[var(--color-primary)] font-semibold text-[13px] flex items-center gap-1 group-hover:text-[var(--color-tertiary-container)] transition-colors">
                    View
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
            </div>
        </Link>
    );
}
