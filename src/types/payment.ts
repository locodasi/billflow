
export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface Payment {
    id: string;
    payment_number: string;
    project_id: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    payment_method: string;
    notes: string;
    receipt_pdf_path: string;
    created_at: string;
}