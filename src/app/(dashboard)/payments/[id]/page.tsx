"use server"

import { createServerClient } from "@/lib/supabase.server";

import PaymentView from "./_components/PaymentView";

const PaymentPage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;
    const supabase = await createServerClient();

    const { data: payment } = await supabase
        .from("payments")
        .select("*")
        .eq("id", id)
        .single();

    if (!payment) return <p>Pago no encontrado</p>;

    return <PaymentView payment={payment} />;
}

export default PaymentPage;