import { Contract } from '@/types';
import { Link } from '@inertiajs/react';
import ContractStatusBadge from './ContractStatusBadge';

export default function ContractCard({ contract }: { contract: Contract }) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm p-5 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{contract.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{contract.vendor?.name}</p>
                </div>
                <ContractStatusBadge status={contract.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                    <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Value</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        Rp {parseInt(contract.value).toLocaleString('id-ID')}
                    </span>
                </div>
                <div>
                    <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Period</span>
                    <span className="text-gray-700 dark:text-gray-300">
                        {contract.start_date} - {contract.end_date}
                    </span>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <Link
                    href={`/contracts/${contract.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    View Details &rarr;
                </Link>
            </div>
        </div>
    );
}
