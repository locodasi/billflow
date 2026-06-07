
export type InvoiceStatus = 'pending' | 'paid' | 'unpaid';

export interface Invoice {
    id: string;
    invoice_number: string;
    project_id: string;
    amount: number;
    currency: string;
    status: InvoiceStatus;
    issue_date: string;
    due_date: string | null;
    pdf_path: string;
    notes: string;
    metadata: Record<string, unknown>;
    created_at: string;
}