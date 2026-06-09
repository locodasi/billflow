"use client";

import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";

import { useProjectsStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";

import Header from "@/components/Header";

import NewInvoiceModal from "./_components/modals/NewInvoiceModal";

import { Invoice } from "@/types/Invoice";

import {ITEMS_PER_PAGE} from "./_utils/constant";

import { InvoiceFilters } from "./_types/filters";

import Filters from "./_components/Filters";
import InvoiceCard from "./_components/InvoiceCard";
import InvoiceDetailModal from "./_components/modals/InvoiceDetailModal";

const Invoices = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [filters, setFilters] = useState<InvoiceFilters>({ projectId: '', page: 1 });
    const [totalCount, setTotalCount] = useState(0);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);


    const projectName = useProjectsStore(s => s.project?.name);
    const projectId = useProjectsStore(s => s.project?.id);
    const role = useUserStore(s => s.role);

    const fetchInvoices = async (filters: InvoiceFilters) => {
        if (!filters.projectId) return

        let query = supabase
            .from('invoices')
            .select('*', { count: 'exact' })
            .eq('project_id', filters.projectId)
            .order('created_at', { ascending: false })
            .order('invoice_number', { ascending: false })
            .range((filters.page - 1) * ITEMS_PER_PAGE, (filters.page * ITEMS_PER_PAGE) - 1)

        if (filters.status && filters.status !== 'all') {
            query = query.eq('status', filters.status)
        }

        if (filters.search) {
            query = query.or(`invoice_number.ilike.%${filters.search}%,currency.ilike.%${filters.search}%`)
        }

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching invoices:', error)
            return
        }

        setInvoices(data as Invoice[])
        setTotalCount(count ?? 0)
    }

    useEffect(() => {
        if (!projectId) return

        const load = async () => {
            await fetchInvoices({ ...filters, projectId })
        }

        load()
    }, [projectId, filters])

    const addInvoice = (invoice: Invoice) => {
        if(totalCount >= ITEMS_PER_PAGE) {
            setTotalCount(prev => prev + 1)
            return
        }

        setInvoices(prev => [invoice, ...prev])
    }

    return (
        <>
            {isModalOpen && <NewInvoiceModal onClose={() => setIsModalOpen(false)} addInvoice={addInvoice}/>}

            <Header title={`Facturas -- ${projectName}`} showButton={role === 'admin'} buttontext="Nueva factura" buttonIcon="plus" onButtonClick={() => setIsModalOpen(true)} />

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Filters filters={filters} setFilters={setFilters} count={totalCount} />

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
                    gap: '1rem'
                }}>
                    {invoices.map(invoice => (
                        <InvoiceCard key={invoice.id} invoice={invoice} onClick={() => setSelectedInvoice(invoice)} />
                    ))}
                </div>
            </div>
            
            {selectedInvoice && <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
        </>
    )
}

export default Invoices;

