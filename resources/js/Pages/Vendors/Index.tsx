import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Vendor } from '@/types';
import { useState, useMemo } from 'react';

export interface ComplianceRequirement {
    id: number;
    vendor_id: number;
    document_name: string;
    is_fulfilled: boolean;
    file_path: string | null;
    expiry_date: string | null;
}

type ExtendedVendor = Vendor & { 
    contracts_count: number;
    compliance_requirements?: ComplianceRequirement[];
};

export default function Index({ auth, vendors }: PageProps<{ vendors: ExtendedVendor[] }>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortByRisk, setSortByRisk] = useState(false);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const targetDocs = ['Izin Usaha', 'NPWP', 'Sertifikat ISO'];

    const getVendorRiskLevel = (vendor: ExtendedVendor) => {
        const requirements = vendor.compliance_requirements || [];
        const docStatuses = targetDocs.map(docName => {
            const req = requirements.find(r => r.document_name.toLowerCase() === docName.toLowerCase());
            if (!req) return 'missing';
            if (!req.is_fulfilled) return 'expired';
            return 'valid';
        });

        if (docStatuses.some(s => s === 'expired')) return 3; // High Risk
        if (docStatuses.some(s => s === 'missing')) return 2; // Incomplete
        return 1; // Compliant
    };

    const filteredVendors = useMemo(() => {
        let result = vendors;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(v => 
                v.name.toLowerCase().includes(q) || 
                (v.contact_person && v.contact_person.toLowerCase().includes(q))
            );
        }
        if (sortByRisk) {
            result = [...result].sort((a, b) => getVendorRiskLevel(b) - getVendorRiskLevel(a));
        }
        return result;
    }, [vendors, searchQuery, sortByRisk]);

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Vendors & Compliance" />

            <div className="max-w-[1280px] mx-auto space-y-6 lg:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)] leading-none">Compliance</h2>
                        <p className="text-sm text-[var(--color-secondary)] mt-2">Monitor vendor document status and compliance levels.</p>
                    </div>
                </div>

                {/* Main Data View */}
                <div className="min-w-0">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                        <div className="relative w-full sm:w-[300px]">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] text-[20px]">search</span>
                            <input 
                                type="text" 
                                placeholder="Search vendors..." 
                                className="w-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] rounded-lg pl-10 pr-4 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button 
                                onClick={() => setSortByRisk(!sortByRisk)}
                                className={`px-3 py-1.5 border border-[var(--color-surface-border)] rounded-lg bg-[var(--color-surface-container-lowest)] transition-colors flex items-center gap-2 text-xs font-semibold shadow-sm ${sortByRisk ? 'text-[var(--color-primary)] border-[var(--color-outline)] bg-[var(--color-surface-container-low)]' : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-outline)]'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">sort</span>
                                Sort: Risk Level
                            </button>
                            <div className="text-xs text-[var(--color-secondary)] shrink-0">Showing {filteredVendors.length} of {vendors.length} vendors</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredVendors.length === 0 ? (
                            <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] rounded-xl p-12 text-center text-[var(--color-secondary)]">
                                No vendors found.
                            </div>
                        ) : (
                            filteredVendors.map(vendor => {
                                const targetDocs = ['Izin Usaha', 'NPWP', 'Sertifikat ISO'];
                                const requirements = vendor.compliance_requirements || [];
                                
                                const getDocStatus = (docName: string) => {
                                    const req = requirements.find(r => r.document_name.toLowerCase() === docName.toLowerCase());
                                    if (!req) return { status: 'missing', label: 'Not Uploaded' };
                                    if (!req.is_fulfilled) return { status: 'expired', label: 'Expired or Invalid' };
                                    return { status: 'valid', label: req.expiry_date ? `Valid until ${new Date(req.expiry_date).toLocaleDateString()}` : 'Verified' };
                                };

                                const docStatuses = targetDocs.map(d => ({ name: d, ...getDocStatus(d) }));
                                const hasMissing = docStatuses.some(d => d.status === 'missing');
                                const hasExpired = docStatuses.some(d => d.status === 'expired');
                                
                                let riskBadge = { label: 'Compliant', color: 'bg-[var(--color-status-active)]/10 text-[var(--color-status-active)] border-[var(--color-status-active)]/20' };
                                if (hasExpired) {
                                    riskBadge = { label: 'High Risk', color: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)] border-[var(--color-error-container)]' };
                                } else if (hasMissing) {
                                    riskBadge = { label: 'Incomplete', color: 'bg-[var(--color-status-pending)]/10 text-[var(--color-status-pending)] border-[var(--color-status-pending)]/20' };
                                }

                                return (
                                    <div key={vendor.id} className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-border)] rounded-xl overflow-hidden transition-all hover:shadow-sm group">
                                        <div className="p-5 flex flex-col xl:flex-row gap-6">
                                            {/* Info */}
                                            <div className="xl:w-1/3 flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-[var(--color-surface-container-highest)] border border-[var(--color-surface-border)] shrink-0 flex items-center justify-center text-2xl font-bold text-[var(--color-secondary)]">
                                                    {getInitials(vendor.name)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-xl font-semibold text-[var(--color-on-surface)] leading-none">{vendor.name}</h3>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${riskBadge.color}`}>
                                                            {riskBadge.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-[var(--color-secondary)] mb-2">
                                                        Vendor ID: V-{vendor.id.toString().padStart(4, '0')} &bull; {vendor.contact_person}
                                                    </p>
                                                    <Link href={`/vendors/${vendor.id}`} className="text-sm font-semibold text-[var(--color-on-tertiary-fixed-variant)] group flex items-center gap-1 w-max mt-2">
                                                        <span className="group-hover:underline">View Profile</span>
                                                        <span className="material-symbols-outlined text-[16px] relative top-px">arrow_forward</span>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Document Checklist */}
                                            <div className="xl:flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t xl:border-t-0 xl:border-l border-[var(--color-surface-border)] pt-4 xl:pt-0 xl:pl-6">
                                                {docStatuses.map((doc, idx) => {
                                                    if (doc.status === 'missing') {
                                                        return (
                                                            <div key={idx} className="flex flex-col gap-1 bg-[var(--color-surface-container)] p-3 rounded-lg border border-[var(--color-surface-border)] border-dashed justify-center">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-wider">{doc.name}</span>
                                                                    <span className="material-symbols-outlined text-[18px] text-[var(--color-secondary)]">help</span>
                                                                </div>
                                                                <span className="text-xs text-[var(--color-secondary)] mt-1">{doc.label}</span>
                                                                <Link href={`/vendors/${vendor.id}`} className="mt-2 text-left text-xs font-semibold text-[var(--color-on-tertiary-fixed-variant)] hover:underline">Upload Now</Link>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div key={idx} className="flex flex-col gap-1 py-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-xs font-semibold text-[var(--color-on-surface)] uppercase tracking-wider">{doc.name}</span>
                                                                <span className={`material-symbols-outlined text-[18px] ${doc.status === 'valid' ? 'text-[var(--color-status-active)]' : 'text-[var(--color-status-rejected)]'}`}>
                                                                    {doc.status === 'valid' ? 'check_circle' : 'error'}
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden">
                                                                <div className={`h-full w-full ${doc.status === 'valid' ? 'bg-[var(--color-status-active)]' : 'bg-[var(--color-status-rejected)]'}`}></div>
                                                            </div>
                                                            <span className={`text-xs mt-1 ${doc.status === 'expired' ? 'text-[var(--color-status-rejected)] font-medium' : 'text-[var(--color-secondary)]'}`}>
                                                                {doc.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        
                                        <div className="bg-[var(--color-surface-container-low)] px-5 py-3 border-t border-[var(--color-surface-border)] flex justify-between items-center group-hover:bg-[var(--color-surface-container-highest)] transition-colors">
                                            <span className="text-xs text-[var(--color-secondary)] flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">history</span>
                                                Last updated: Today, 09:41 AM
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
