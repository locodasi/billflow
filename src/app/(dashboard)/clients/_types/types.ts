export type Client = {
    client_id: string;
    name: string;
    email: string;
    project_count: number;
    invoice_count: number;
    total_invoiced_usd: number;
}

export type Project = {
    project_id: string;
    client_id: string;
    name: string;
    currency: string;
    bill_address: string | null;
    invoice_count: number;
    total_invoiced: number;
    total_collected: number;
    total_pending: number;
}