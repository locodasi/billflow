// src/app/(dashboard)/clients/[id]/page.tsx
"use server"

import { createServerClient } from "@/lib/supabase.server";
import InvoiceView from "./_components/InvoiceView";
import { InvoiceSummary } from "@/types/Invoice";


const InvoicePage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;
    const supabase = await createServerClient();

    const { data: invoice } = await supabase
        .from("invoice_summary")
        .select("*")
        .eq("id", id)
        .single();

    if (!invoice) return <p>Factura no encontrada</p>;

    return <InvoiceView invoice={invoice as InvoiceSummary} />;
}

export default InvoicePage;