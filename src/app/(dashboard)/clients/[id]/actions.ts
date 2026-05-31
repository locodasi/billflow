// src/app/(dashboard)/clients/[id]/actions.ts
'use server'

import { supabaseAdmin } from "@/lib/supabase.server";
import { ActionResult } from "@/types/actions";

export const createProjectAction = async (
    clientId: string,
    name: string,
    currency: string,
    billAddress: string
): Promise<ActionResult<{project_id: string, client_id: string, name: string, currency: string, bill_address: string | null}>> => {

    if (!name?.trim()) return {
        success: false,
        error: { field: "name", message: "El nombre es requerido" }
    };

    if (!currency?.trim()) return {
        success: false,
        error: { field: "currency", message: "La moneda es requerida" }
    };

    const { data, error } = await supabaseAdmin
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

    return { success: true, data: {
        project_id: data.project_id,
        client_id: data.client_id,
        name: data.name,
        currency: data.currency,
        bill_address: data.bill_address,
    } };
};

export const updateProjectAction = async (
    project_id: string,
    name: string,
    currency: string,
    billAddress: string
): Promise<ActionResult<{project_id: string, client_id: string, name: string, currency: string, bill_address: string | null}>> => {

    if (!name?.trim()) return {
        success: false,
        error: { field: "name", message: "El nombre es requerido" }
    };

    if (!currency?.trim()) return {
        success: false,
        error: { field: "currency", message: "La moneda es requerida" }
    };

    const { data, error } = await supabaseAdmin
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

    return { success: true, data: {
        project_id: data.project_id,
        client_id: data.client_id,
        name: data.name,
        currency: data.currency,
        bill_address: data.bill_address,
    } };
};