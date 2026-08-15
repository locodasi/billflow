'use server'

import { createServerClient } from "@/lib/supabase.server";
import { getPeriodRange, type Period } from "@/lib/period";


export async function getCardsValue(period: Period) {

    const { startUtc, endUtc } = getPeriodRange(period);

    const supabase = await createServerClient();


    const { data, error } = await supabase
        .from("invoice_summary")
        .select("paid_amount, pending_amount, outstanding_amount")
        .gte("created_at", startUtc)
        .lt("created_at", endUtc);

    if (error) throw new Error(`Error al obtener KPIs: ${error.message}`);

    const invoiced = data.reduce((acc, row) => acc + row.paid_amount! + row.pending_amount! + row.outstanding_amount!, 0);
    const payed = data.reduce((acc, row) => acc + row.paid_amount!, 0);
    const totalInvoices = data.length;
    const averagePerMonth = period === "month" ? invoiced : invoiced / (period === "quarter" ? 3 : 12);

    return { invoiced, payed, totalInvoices, averagePerMonth };
}

// export async function updateUserSettings(path: string[], value: boolean) {
//     const supabase = await createServerClient();

//     const user = await getUserData(supabase);

//     const { error } = await supabase.rpc("update_profile_setting", {
//         p_profile_id: user.id,
//         p_path: path,
//         p_value: value,
//     });

//     if (error) {
//         console.error("Error updating settings:", error);
//         throw new Error(`Error al actualizar settings: ${error.message}`);
//     }
// }