import { SupabaseClient } from "@supabase/supabase-js";

export async function getAvailableProjectCredit(
    projectId: string,
    supabase: SupabaseClient
): Promise<number> {
    const credits = await getAvailableProjectCredits(
        projectId,
        supabase
    )

    return credits.reduce(
        (total, credit) => total + credit.amount,
        0
    )
}

type AvailableProjectCredit = {
    id: number
    amount: number
}

export async function getAvailableProjectCredits(
    projectId: string,
    supabase: SupabaseClient
): Promise<AvailableProjectCredit[]> {
    const { data: credits, error } = await supabase
        .from("project_credits")
        .select(`
            id,
            amount,
            payments!inner (
                project_id,
                status
            )
        `)
        .eq("payments.project_id", projectId)
        .eq("payments.status", "approved")
        .order("created_at", { ascending: true })

    if (error) {
        throw new Error(
            `Error al obtener créditos del proyecto: ${error.message}`
        )
    }

    if (!credits || credits.length === 0) {
        return []
    }

    const creditIds = credits.map((credit) => credit.id)

    const { data: applications, error: applicationsError } =
        await supabase
            .from("credit_applications")
            .select(`
                credit_id,
                amount_applied,
                payments!inner (
                    status
                )
            `)
            .in("credit_id", creditIds)
            .neq("payments.status", "rejected")


    if (applicationsError) {
        throw new Error(
            `Error al obtener aplicaciones de créditos: ${applicationsError.message}`
        )
    }

    const appliedByCredit = new Map<number, number>()

    for (const application of applications ?? []) {
        const current =
            appliedByCredit.get(application.credit_id) ?? 0

        appliedByCredit.set(
            application.credit_id,
            current + Number(application.amount_applied)
        )
    }

    return credits
        .map((credit) => ({
            id: credit.id,
            amount:
                Number(credit.amount) -
                (appliedByCredit.get(credit.id) ?? 0),
        }))
        .filter((credit) => credit.amount > 0)
}
