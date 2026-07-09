import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface ContractsSummary {
    active: number;
    active_percent_change: number;
    total_value: number;
    expiring_soon: number;
    critical_renewals: number;
    draft: number;
    pending_approval: number;
    avg_queue_days: number;
}

interface MonthlyValue {
    month: string;
    value: number;
    percent: number;
    raw_value: number;
}

interface ActivityItem {
    id: number;
    type: string;
    contract_title: string;
    user_name: string;
    action: string;
    stage: string;
    created_at: string;
}

export default function Index({ auth, contractsSummary, monthlyValues, recentActivity }: PageProps<{
    contractsSummary: ContractsSummary;
    monthlyValues: MonthlyValue[];
    recentActivity: ActivityItem[];
}>) {
    const formattedTotalValue = `$${(contractsSummary.total_value / 1000000).toFixed(1)}M`;

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Dashboard" />

            <div className="max-w-[1280px] mx-auto space-y-6 lg:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)] leading-none">Dashboard</h2>
                        <p className="text-sm text-[var(--color-secondary)] mt-2">Overview of contract statuses and compliance metrics.</p>
                    </div>
                </div>

                {/* KPI Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* KPI: Active Contracts */}
                    <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] rounded-xl p-6 shadow-sm flex flex-col justify-between">
                        <Link href="/contracts" className="group block">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-wider block">Active Contracts</span>
                                    <h3 className="text-3xl font-bold text-[var(--color-on-surface)] mt-1 tracking-tight leading-none group-hover:text-[var(--color-primary)] transition-colors">{contractsSummary.active.toLocaleString()}</h3>
                                </div>
                                <div className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] p-2 rounded-lg">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`${contractsSummary.active_percent_change >= 0 ? 'text-[var(--color-status-active)]' : 'text-[var(--color-status-rejected)]'} text-xs font-semibold flex items-center`}>
                                    <span className="material-symbols-outlined text-[16px] mr-0.5">{contractsSummary.active_percent_change >= 0 ? 'arrow_upward' : 'arrow_downward'}</span> {Math.abs(contractsSummary.active_percent_change)}%
                                </span>
                                <span className="text-xs text-[var(--color-secondary)]">vs last month</span>
                            </div>
                        </Link>
                        <div className="mt-4 pt-4 border-t border-[var(--color-surface-border)]">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--color-secondary)]">Total Value</span>
                                <span className="text-sm font-semibold text-[var(--color-on-surface)]">{formattedTotalValue}</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI: Expiring Soon */}
                    <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] rounded-xl p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-wider block">Expiring Soon</span>
                                    <h3 className="text-3xl font-bold text-[var(--color-on-surface)] mt-1 tracking-tight leading-none">{contractsSummary.expiring_soon}</h3>
                                </div>
                                <div className="bg-[var(--color-error-container)] text-[var(--color-on-error-container)] p-2 rounded-lg">
                                    <span className="material-symbols-outlined">event_busy</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[var(--color-status-rejected)] text-xs font-semibold flex items-center">
                                    <span className="material-symbols-outlined text-[16px] mr-0.5">warning</span> {contractsSummary.critical_renewals}
                                </span>
                                <span className="text-xs text-[var(--color-secondary)]">critical renewals</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[var(--color-surface-border)]">
                            <div className="w-full bg-[var(--color-surface-container-high)] rounded-full h-1.5 mb-2">
                                <div className="bg-[var(--color-status-rejected)] h-1.5 rounded-full" style={{ width: `${Math.min(100, (contractsSummary.critical_renewals / Math.max(1, contractsSummary.active)) * 100)}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--color-secondary)]">Action Required</span>
                                <span className="text-xs font-semibold text-[var(--color-status-rejected)]">{contractsSummary.critical_renewals} Critical</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI: Pending Approvals */}
                    <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] rounded-xl p-6 shadow-sm flex flex-col justify-between">
                        <Link href="/contracts" className="group block">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-wider block">Pending Approvals</span>
                                    <h3 className="text-3xl font-bold text-[var(--color-on-surface)] mt-1 tracking-tight leading-none group-hover:text-[var(--color-primary)] transition-colors">{contractsSummary.pending_approval}</h3>
                                </div>
                                <div className="bg-[#FEF3C7] text-[#92400E] p-2 rounded-lg">
                                    <span className="material-symbols-outlined">pending_actions</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[var(--color-status-pending)] text-xs font-semibold flex items-center">
                                    <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
                                </span>
                                <span className="text-xs text-[var(--color-secondary)]">Avg {contractsSummary.avg_queue_days === 0 ? '< 1' : contractsSummary.avg_queue_days} days in queue</span>
                            </div>
                        </Link>
                        <div className="mt-4 pt-4 border-t border-[var(--color-surface-border)] flex gap-2">
                            <Link href="/contracts" className="flex-1 bg-[var(--color-surface-container-low)] border border-[var(--color-surface-border)] text-[var(--color-on-surface)] py-1.5 rounded text-xs font-semibold hover:bg-[var(--color-surface-container-high)] transition-colors text-center">Review</Link>
                        </div>
                    </div>
                </div>

                {/* Charts and Activity Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Chart Section */}
                    <div className="lg:col-span-2 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] rounded-xl p-6 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm md:text-xl font-semibold text-[var(--color-on-surface)] tracking-tight">Monthly Contract Values</h3>
                            <select className="bg-[var(--color-surface-container-low)] border-none text-[var(--color-on-surface)] text-xs font-semibold rounded focus:ring-0 cursor-pointer py-1.5 pl-1 pr-2">
                                <option>Last 6 Months</option>
                                <option>Year to Date</option>
                            </select>
                        </div>

                        {monthlyValues.every(m => m.raw_value === 0) ? (
                            <div className="flex-1 min-h-[240px] flex flex-col items-center justify-center border border-[var(--color-surface-border)] border-dashed rounded-lg bg-[var(--color-surface-container)]">
                                <span className="material-symbols-outlined text-[48px] text-[var(--color-surface-variant)] mb-2">bar_chart</span>
                                <p className="text-sm font-semibold text-[var(--color-on-surface)]">No Data Available</p>
                                <p className="text-xs text-[var(--color-secondary)] mt-1">No contracts were started in this period.</p>
                            </div>
                        ) : (
                            <>
                                {/* Bar Chart Representation */}
                                <div className="flex-1 min-h-[240px] flex items-end justify-between gap-2 pb-6 border-b border-[var(--color-surface-border)] relative">
                                    {/* Y Axis Labels */}
                                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[var(--color-secondary)] font-mono text-xs -ml-1 pr-2 pb-6 w-20 text-right">
                                        {(() => {
                                            const maxValInMillions = Math.max(...monthlyValues.map(m => m.value), 0.1);
                                            return [
                                                maxValInMillions,
                                                maxValInMillions * 0.75,
                                                maxValInMillions * 0.5,
                                                maxValInMillions * 0.25,
                                                0
                                            ].map((val, idx) => (
                                                <span key={idx}>Rp{val > 0 ? val.toFixed(1) : 0}M</span>
                                            ));
                                        })()}
                                    </div>
                                    
                                    {/* Bars */}
                                    <div className="flex-1 flex justify-between items-end gap-2 h-full ml-24">
                                        {monthlyValues.map((data, idx) => (
                                            <div 
                                                key={idx} 
                                                className={`w-full transition-colors rounded-t relative group ${idx === monthlyValues.length - 1 ? 'bg-[var(--color-on-tertiary-fixed-variant)]' : 'bg-[var(--color-secondary-container)] hover:bg-[var(--color-on-tertiary-fixed-variant)]'}`}
                                                style={{ height: `${data.percent}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--color-inverse-surface)] text-[var(--color-inverse-on-surface)] font-mono text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-sm pointer-events-none">
                                                    Rp {(data.raw_value / 1000000).toFixed(1)}M
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* X Axis Labels */}
                                <div className="flex justify-between mt-3 text-[var(--color-secondary)] text-xs font-semibold ml-24">
                                    {monthlyValues.map((data, idx) => (
                                        <span key={idx} className="w-full text-center">{data.month}</span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Recent Activity Section */}
                    <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] rounded-xl p-6 shadow-sm flex flex-col h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[var(--color-on-surface)] tracking-tight">Recent Activity</h3>
                            <Link href="/contracts" className="text-xs font-semibold text-[var(--color-on-tertiary-fixed-variant)] hover:underline">View All</Link>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2 space-y-5">
                            {recentActivity.length === 0 ? (
                                <p className="text-sm text-[var(--color-secondary)] text-center py-8">No recent activity found.</p>
                            ) : (
                                recentActivity.map((activity, idx) => {
                                    const isLast = idx === recentActivity.length - 1;
                                    
                                    let icon = 'edit_document';
                                    let iconColor = 'text-[var(--color-on-primary-fixed-variant)]';
                                    let iconBg = 'bg-[var(--color-secondary-container)]';
                                    let text = <span><strong>{activity.contract_title}</strong> updated by {activity.user_name}.</span>;

                                    if (activity.action === 'approved') {
                                        icon = 'check_circle';
                                        iconColor = 'text-[var(--color-status-active)]';
                                        iconBg = 'bg-[var(--color-status-active)]/10';
                                        text = <span><strong>{activity.contract_title}</strong> approved by {activity.user_name}.</span>;
                                    } else if (activity.action === 'rejected') {
                                        icon = 'error';
                                        iconColor = 'text-[var(--color-status-rejected)]';
                                        iconBg = 'bg-[var(--color-error-container)]';
                                        text = <span><strong>{activity.contract_title}</strong> rejected by {activity.user_name}.</span>;
                                    }

                                    return (
                                        <div key={activity.id} className="relative flex gap-4">
                                            {/* Connecting Line */}
                                            {!isLast && (
                                                <div className="absolute left-[15px] top-[32px] bottom-[-20px] w-px bg-[var(--color-surface-border)]" />
                                            )}
                                            
                                            {/* Icon */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${iconBg} ${iconColor}`}>
                                                <span className="material-symbols-outlined text-[16px]">{icon}</span>
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 pb-1">
                                                <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{text}</p>
                                                <span className="font-mono text-xs text-[var(--color-secondary)] mt-1 block">{activity.created_at}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


