export type Project = {
    id: string;
    client_id: string;
    name: string;
    currency: string;
    bill_address: string | null;
}

export type ProjectStats = {
    total_invoiced: number;
    total_paid: number;
    total_pending: number;
}

export type ProjectWithStats = Project & ProjectStats;