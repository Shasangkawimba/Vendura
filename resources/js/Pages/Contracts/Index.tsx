import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Contract } from '@/types';
import ContractCard from '@/Components/ContractCard';

export default function Index({ auth, contracts }: PageProps<{ contracts: Contract[] }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl leading-tight">Contracts</h2>
                    {auth.user.role === 'MANAGER' && (
                        <Link
                            href="/contracts/create"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-sm transition-colors text-sm"
                        >
                            + New Contract
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Contracts" />

            <div className="max-w-7xl mx-auto">
                {contracts.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No contracts found</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new contract.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contracts.map(contract => (
                            <ContractCard key={contract.id} contract={contract} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
