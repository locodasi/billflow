// src/app/(dashboard)/clients/[id]/actions.ts
'use server'

import { createServerClient } from "@/lib/supabase.server";
import { ActionResult } from "@/types/actions";

export const createProjectAction = async (
    clientId: string,
    name: string,
    currency: string,
    billAddress: string
): Promise<ActionResult<{ project_id: string, client_id: string, name: string, currency: string, bill_address: string | null }>> => {

    if (!name?.trim()) return {
        success: false,
        error: { field: "name", message: "El nombre es requerido" }
    };

    if (!currency?.trim()) return {
        success: false,
        error: { field: "currency", message: "La moneda es requerida" }
    };

    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from("projects")
        .insert({
            client_id: clientId,
            name,
            currency,
            bill_address: billAddress || null,
        })
        .select()
        .single();

    if (error) return {
        success: false,
        error: { field: "general", message: error.message }
    };

    const projectId = data.id;
    const emptyFile = new Blob([""], { type: "text/plain" });

    // Crear subcarpetas simuladas con un archivo placeholder
    const folderPaths = [
        `${projectId}/invoices/.gitkeep`,
        `${projectId}/payments/.gitkeep`,
    ];

    const uploadResults = await Promise.all(
        folderPaths.map((path) =>
            supabase.storage.from("documents").upload(path, emptyFile)
        )
    );

    const uploadError = uploadResults.find((r) => r.error);
    if (uploadError?.error) return {
        success: false,
        error: { field: "general", message: `Proyecto creado pero error al inicializar storage: ${uploadError.error.message}` }
    };

    return {
        success: true, data: {
            project_id: data.project_id,
            client_id: data.client_id,
            name: data.name,
            currency: data.currency,
            bill_address: data.bill_address,
        }
    };
};

export const updateProjectAction = async (
    project_id: string,
    name: string,
    currency: string,
    billAddress: string
): Promise<ActionResult<{ project_id: string, client_id: string, name: string, currency: string, bill_address: string | null }>> => {

    if (!name?.trim()) return {
        success: false,
        error: { field: "name", message: "El nombre es requerido" }
    };

    if (!currency?.trim()) return {
        success: false,
        error: { field: "currency", message: "La moneda es requerida" }
    };

    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from("projects")
        .update({
            name,
            currency,
            bill_address: billAddress || null,
        })
        .eq("id", project_id)
        .select()
        .single();

    if (error) return {
        success: false,
        error: { field: "general", message: error.message }
    };

    return {
        success: true, data: {
            project_id: data.project_id,
            client_id: data.client_id,
            name: data.name,
            currency: data.currency,
            bill_address: data.bill_address,
        }
    };
};