"use client";

import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";

import { useProjectsStore } from "@/stores/projectStore";

import { HeaderTitle, HeaderWrapper } from "@/components/Header";

import NewInvoiceModal from "./_components/modals/NewInvoiceModal";

import { InvoiceSummary } from "@/types/Invoice";

import { ITEMS_PER_PAGE } from "./_utils/constant";

import { InvoiceFilters } from "./_types/filters";

import Filters from "./_components/Filters";
import InvoiceCard from "./_components/InvoiceCard";
import InvoiceDetailModal from "./_components/modals/InvoiceDetailModal";
import Button from "@/components/Button";
import { downloadUnpaidInvoicesPDF } from "./actions";

const Invoices = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
    const [filters, setFilters] = useState<InvoiceFilters>({ projectId: '', page: 1 });
    const [totalCount, setTotalCount] = useState(0);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceSummary | null>(null);

 
    const projectName = useProjectsStore(s => s.project?.name);
    const projectId = useProjectsStore(s => s.project?.id);

    const fetchInvoices = async (filters: InvoiceFilters) => {
        if (!filters.projectId) return

        let query = supabase
            .from('invoice_summary')
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

        setInvoices(data as InvoiceSummary[])
        setTotalCount(count ?? 0)
    }

    useEffect(() => {
        if (!projectId) return

        const load = async () => {
            await fetchInvoices({ ...filters, projectId })
        }

        load()
    }, [projectId, filters])

    const addInvoice = (invoice: InvoiceSummary) => {
        if (totalCount >= ITEMS_PER_PAGE) {
            setTotalCount(prev => prev + 1)
            return
        }
        

        setInvoices(prev => [invoice, ...prev])
    }

    const handleDownloadUnpaidInvoices = async () => {
        if (!projectId) return;

        const { data, error } = await downloadUnpaidInvoicesPDF(projectId);
        if (error || !data) return console.error(error);

        // Reconstruir el Uint8Array y disparar la descarga
        const blob = new Blob([new Uint8Array(data)], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "unpaid_invoices.zip";
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <>
            {isModalOpen && <NewInvoiceModal onClose={() => setIsModalOpen(false)} addInvoice={addInvoice} />}

            <HeaderWrapper>
                <HeaderTitle>{`Facturas -- ${projectName}`}</HeaderTitle>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button size="small" text="Descargar facturas impagas" firstIcon="download" onClick={handleDownloadUnpaidInvoices} />
                    <Button size="small" text="Nueva factura" firstIcon="plus" onClick={() => setIsModalOpen(true)} />
                </div>
            </HeaderWrapper>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Filters filters={filters} setFilters={setFilters} count={totalCount} />

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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

