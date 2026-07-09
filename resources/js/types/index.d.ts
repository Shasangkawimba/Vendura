export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'DIREKTUR';
}

export interface Vendor {
    id: number;
    name: string;
    contact_person: string;
    phone: string;
    email: string;
}

export interface ContractVersion {
    id: number;
    contract_id: number;
    file_path: string;
    version_number: number;
    uploaded_by: number;
    created_at: string;
    uploader?: User;
}

export interface ApprovalHistory {
    id: number;
    contract_id: number;
    approver_id: number;
    stage: 'MANAGER' | 'FINANCE' | 'DIREKTUR';
    decision: 'APPROVED' | 'REJECTED';
    note?: string;
    created_at: string;
    approver?: User;
}

export interface Contract {
    id: number;
    vendor_id: number;
    created_by: number;
    title: string;
    value: string; // Decimal comes as string
    start_date: string;
    end_date: string;
    status: 'DRAFT' | 'MENUNGGU_MANAGER' | 'MENUNGGU_FINANCE' | 'MENUNGGU_DIREKTUR' | 'AKTIF' | 'DITOLAK' | 'EXPIRED';
    created_at: string;
    updated_at: string;
    
    // Relations
    vendor?: Vendor;
    creator?: User;
    versions?: ContractVersion[];
    approval_histories?: ApprovalHistory[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
