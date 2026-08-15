'use server'

import { createServerClient } from "@/lib/supabase.server";
import { getPeriodRange, type Period } from "@/lib/period";
import { getCurrentProjectId } from "@/lib/project-cookies";

const roundToTwo = (value: number) => Number(value.toFixed(2));

export async function getCardsValue(period: Period) {
    const { startUtc, endUtc } = getPeriodRange(period);

    const supabase = await createServerClient();
    const projectId = await getCurrentProjectId();

    if (!projectId) return { invoiced: 0, payed: 0, totalInvoices: 0, averagePerMonth: 0 };

    const { data, error } = await supabase
        .rpc("get_cards_metrics", {
            p_project_id: projectId,
            p_start: startUtc,
            p_end: endUtc,
        })
        .single();

    if (error) throw new Error(`Error al obtener KPIs: ${error.message}`);

    const invoiced = Number(data.invoiced);
    const payed = Number(data.payed);
    const totalInvoices = data.total_invoices;

    const averagePerMonth = period === "month" ? invoiced : invoiced / (period === "quarter" ? 3 : 12);

    return { invoiced, payed, totalInvoices, averagePerMonth: roundToTwo(averagePerMonth) };
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