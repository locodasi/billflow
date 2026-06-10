"use client";

import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";

import { useProjectsStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";

import Header from "@/components/Header";

import NewPaymentModal from "./_components/modals/NewPaymentModal";

import { Payment } from "@/types/payment";

import { ITEMS_PER_PAGE } from "./_utils/constant";

import { PaymentFilters } from "./_types/filters";

import Filters from "./_components/Filters";
import PaymentCard from "./_components/PaymentCard";

const PaymentsPage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filters, setFilters] = useState<PaymentFilters>({ projectId: '', page: 1 });
    const [totalCount, setTotalCount] = useState(0);


    const projectName = useProjectsStore(s => s.project?.name);
    const projectId = useProjectsStore(s => s.project?.id);

    const fetchPayments = async (filters: PaymentFilters) => {
        if (!filters.projectId) return

        let query = supabase
            .from('payments')
            .select('*', { count: 'exact' })
            .eq('project_id', filters.projectId)
            .order('created_at', { ascending: false })
            .order('payment_number', { ascending: false })
            .range((filters.page - 1) * ITEMS_PER_PAGE, (filters.page * ITEMS_PER_PAGE) - 1)

        if (filters.status && filters.status !== 'all') {
            query = query.eq('status', filters.status)
        }

        if (filters.search) {
            query = query.or(`payment_number.ilike.%${filters.search}%,currency.ilike.%${filters.search}%`)
        }

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching payments:', error)
            return
        }

        setPayments(data as Payment[])
        setTotalCount(count ?? 0)
    }

    useEffect(() => {
        if (!projectId) return

        const load = async () => {
            await fetchPayments({ ...filters, projectId })
        }

        load()
    }, [projectId, filters])

    const addPayment = (payment: Payment) => {
        if (totalCount >= ITEMS_PER_PAGE) {
            setTotalCount(prev => prev + 1)
            return
        }

        setPayments(prev => [payment, ...prev])
    }

    return (
        <>
            {isModalOpen && <NewPaymentModal onClose={() => setIsModalOpen(false)} addPayment={addPayment} />}

            <Header title={`Recibos -- ${projectName}`} showButton={true} buttontext="Nuevo recibo" buttonIcon="plus" onButtonClick={() => setIsModalOpen(true)} />

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Filters filters={filters} setFilters={setFilters} count={totalCount} />
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1rem'
                }}>
                    {payments.map(payment => (
                        <PaymentCard key={payment.id} payment={payment} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default PaymentsPage;

