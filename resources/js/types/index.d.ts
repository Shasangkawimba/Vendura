export interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'DIREKTUR';
    email_verified_at?: string;
}

export interface Vendor {
    id: number;
    name: string;
    contact_person: string;
    phone: string;
    email: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
