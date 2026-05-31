// src/app/(dashboard)/clients/[id]/page.tsx
"use server"

import { supabaseAdmin } from "@/lib/supabase.server";
import ClientView from "./_components/ClientView";

const ClientPage = async ({ params }: { params: { id: string } }) => {

    const { id } = await params;

    const { data: client } = await supabaseAdmin
        .from("client_stats")
        .select("*")
        .eq("client_id", id)
        .single();


    const { data: projects } = await supabaseAdmin
        .from("project_stats")
        .select("*")
        .eq("client_id", id);

    // console.log("Projects:", projects);
    if (!client) return <p>Cliente no encontrado</p>;

    return <ClientView client={client} projects={projects ?? []} />;
}

export default ClientPage;