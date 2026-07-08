import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Vendor } from '@/types';

export default function Index({ auth, vendors }: PageProps<{ vendors: (Vendor & { contracts_count: number })[] }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl leading-tight">Vendors</h2>}
        >
            <Head title="Vendors" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="py-4 px-4 font-medium text-gray-500">Name</th>
                                        <th className="py-4 px-4 font-medium text-gray-500">Contact Person</th>
                                        <th className="py-4 px-4 font-medium text-gray-500">Email</th>
                                        <th className="py-4 px-4 font-medium text-gray-500 text-center">Contracts</th>
                                        <th className="py-4 px-4 font-medium text-gray-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendors.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                No vendors found.
                                            </td>
                                        </tr>
                                    ) : (
                                        vendors.map((vendor) => (
                                            <tr key={vendor.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="py-3 px-4 font-medium">{vendor.name}</td>
                                                <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{vendor.contact_person}</td>
                                                <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{vendor.email}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 py-1 px-2 rounded-sm text-xs font-bold">
                                                        {vendor.contracts_count}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Link 
                                                        href={`/vendors/${vendor.id}`} 
                                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium text-sm transition-colors"
                                                    >
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
