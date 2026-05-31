export type Client = {
    client_id: string;
    name: string;
    email: string;
    project_count: number;
    total_invoiced: number;
    total_paid: number;
    total_pending: number;
}

export type Project = {
    project_id: string;
    client_id: string;
    name: string;
    currency: string;
    bill_address: string | null;
    total_invoiced: number;
    total_paid: number;
    total_pending: number;
}