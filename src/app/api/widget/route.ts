import { createBearerClient, createServerClient } from "@/lib/supabase.server";
import { NextRequest, NextResponse } from "next/server";
import { getPeriodRange, parsePeriod, type Period } from "@/lib/period";

function getBearerToken(req: NextRequest): string | null {
    const header = req.headers.get("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : null;

    return token || null;
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    const projectId = searchParams.get("project_id");
    const period = parsePeriod(searchParams.get("period") ?? undefined);
    const timezone = searchParams.get("timezone");

    if (!projectId || !period || !timezone) {
        return NextResponse.json(
            { error: "Missing required parameters" },
            { status: 400 }
        );
    }

    try {
        new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    } catch {
        return NextResponse.json(
            { error: "Invalid timezone" },
            { status: 400 }
        );
    }

    const token = getBearerToken(req);
    const supabase = token
        ? createBearerClient(token)
        : await createServerClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(token ?? undefined);

    if (error || !user) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }

    const { startUtc, endUtc } = getPeriodRange(period, 0, timezone);
    const { startUtc: prevStartUtc, endUtc: prevEndUtc } =
        getPeriodRange(period, 1, timezone);

    const [
        { data: project, error: projectError },
        { data: cardsMetrics, error: cardsMetricsError },
        { count: pendingCount, error: pendingPaymentsError },
    ] = await Promise.all([
        supabase
            .from("projects")
            .select("id, name, currency")
            .eq("id", projectId)
            .single(),

        supabase
            .rpc("get_cards_metrics", {
                p_project_id: projectId,
                p_start: startUtc,
                p_end: endUtc,
                p_prev_start: prevStartUtc,
                p_prev_end: prevEndUtc,
            })
            .single(),

        supabase
            .from("payments")
            .select("id", { count: "exact", head: true })
            .eq("project_id", projectId)
            .eq("status", "pending"),
    ]);

    if (projectError || !project) {
        return NextResponse.json(
            { error: "Project not found" },
            { status: 404 }
        );
    }

    if (cardsMetricsError) {
        throw new Error(`Error al obtener KPIs: ${cardsMetricsError.message}`);
    }

    if (pendingPaymentsError) {
        throw new Error(
            `Error al obtener pagos pendientes: ${pendingPaymentsError.message}`
        );
    }

    return NextResponse.json({
        project_name: project?.name,
        project_currency: project?.currency,
        period,
        invoiced: cardsMetrics?.invoiced,
        payed: cardsMetrics?.payed,
        pending: cardsMetrics?.invoiced - cardsMetrics?.payed,
        to_approve: pendingCount || 0
    });
}