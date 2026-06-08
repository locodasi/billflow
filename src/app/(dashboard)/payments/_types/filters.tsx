export type PaymentFilters = {
    projectId: string
    status?: 'pending' | 'approved' | 'rejected' | 'all'
    search?: string
    page: number
}