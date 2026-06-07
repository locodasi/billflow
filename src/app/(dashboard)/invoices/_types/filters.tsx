export type InvoiceFilters = {
    projectId: string
    status?: 'paid' | 'unpaid' | 'processing' | 'all'
    search?: string
    page: number
}