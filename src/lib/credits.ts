import { SupabaseClient } from "@supabase/supabase-js";

export async function getAvailableProjectCredit(
    projectId: string,
    supabase: SupabaseClient
): Promise<number> {
    const { data: credits, error: creditsError } = await supabase
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
        .eq("payments.status", "approved");

    if (creditsError) {
        throw new Error(
            `Error al obtener créditos del proyecto: ${creditsError.message}`
        );
    }

    if (!credits || credits.length === 0) {
        return 0;
    }

    const creditIds = credits.map((credit) => credit.id);

    const { data: applications, error: applicationsError } = await supabase
        .from("credit_applications")
        .select("credit_id, amount_applied")
        .in("credit_id", creditIds);

    if (applicationsError) {
        throw new Error(
            `Error al obtener aplicaciones de créditos: ${applicationsError.message}`
        );
    }

    const totalCredits = credits.reduce(
        (total, credit) => total + Number(credit.amount),
        0
    );

    const totalApplied = (applications ?? []).reduce(
        (total, application) => total + Number(application.amount_applied),
        0
    );

    return Math.max(totalCredits - totalApplied, 0);
}
