import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ContractsSummary {
    active: number;
    expiring_soon: number;
    draft: number;
    pending_approval: number;
}

interface VendorCompliance {
    id: number;
    name: string;
    rate: number;
    total: number;
    fulfilled: number;
}

export default function Index({ auth, contractsSummary, vendorsCompliance }: PageProps<{ contractsSummary: ContractsSummary, vendorsCompliance: VendorCompliance[] }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Active Contracts</h4>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{contractsSummary.active}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-sm border border-orange-200 dark:border-orange-900">
                        <h4 className="text-orange-600 dark:text-orange-400 text-sm font-medium mb-1">Expiring Soon (30 Days)</h4>
                        <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{contractsSummary.expiring_soon}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Pending Approval</h4>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{contractsSummary.pending_approval}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Drafts</h4>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{contractsSummary.draft}</p>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Compliance Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">Vendor Compliance Rate (%)</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={vendorsCompliance}
                                    margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="rate" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Compliance %" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Vendors Table Summary */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Compliance Action Required</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500">
                                        <th className="py-3 font-medium">Vendor</th>
                                        <th className="py-3 font-medium text-center">Fulfilled</th>
                                        <th className="py-3 font-medium text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendorsCompliance
                                        .filter(v => v.rate < 100 && v.total > 0)
                                        .sort((a, b) => a.rate - b.rate)
                                        .map(vendor => (
                                        <tr key={vendor.id} className="border-b border-gray-100 dark:border-gray-700/50">
                                            <td className="py-3 font-medium">{vendor.name}</td>
                                            <td className="py-3 text-center text-gray-600 dark:text-gray-400">
                                                {vendor.fulfilled} / {vendor.total}
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-sm font-bold">
                                                    Incomplete
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {vendorsCompliance.filter(v => v.rate < 100 && v.total > 0).length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-6 text-center text-gray-500">
                                                All vendors are 100% compliant.
                                            </td>
                                        </tr>
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
