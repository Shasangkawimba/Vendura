import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Contract } from '@/types';
import ContractCard from '@/Components/ContractCard';

export default function Index({ auth, contracts }: PageProps<{ contracts: Contract[] }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
                    <div>
                        <h2 className="text-[30px] font-bold tracking-tight text-[var(--color-on-surface)] leading-none">Contracts</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <div className="relative w-full sm:w-[300px]">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] text-[20px]">search</span>
                            <input 
                                type="text" 
                                placeholder="Search contracts by title..." 
                                className="w-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] rounded-lg pl-10 pr-4 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all shadow-sm"
                                defaultValue={new URLSearchParams(window.location.search).get('search') || ''}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const search = e.currentTarget.value;
                                        if (search) {
                                            window.location.href = `/contracts?search=${encodeURIComponent(search)}`;
                                        } else {
                                            window.location.href = '/contracts';
                                        }
                                    }
                                }}
                            />
                        </div>
                        {auth.user.role === 'MANAGER' && (
                            <Link
                                href="/contracts/create"
                                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-semibold py-2 px-4 rounded-lg text-[14px] transition-default active:scale-[0.98] inline-flex items-center justify-center gap-2 shadow-[var(--shadow-enterprise)] w-full sm:w-auto shrink-0"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                New Contract
                            </Link>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Contracts" />

            {contracts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-xl border-2 border-dashed border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)]">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] shadow-[var(--shadow-enterprise)]">
                        <span className="material-symbols-outlined text-[24px] text-[var(--color-secondary)]">description</span>
                    </div>
                    <h3 className="text-[16px] font-bold text-[var(--color-on-surface)]">No contracts yet</h3>
                    <p className="mt-2 text-[14px] text-[var(--color-secondary)]">Get started by creating a new contract.</p>
                    {auth.user.role === 'MANAGER' && (
                        <Link
                            href="/contracts/create"
                            className="mt-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-semibold py-2 px-5 rounded-lg text-[14px] transition-default active:scale-[0.98] shadow-sm"
                        >
                            Create Contract
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contracts.map(contract => (
                        <ContractCard key={contract.id} contract={contract} />
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
