// src/app/(dashboard)/clients/actions.ts
'use server'

import { randomUUID } from "crypto";

import { createClient } from "@supabase/supabase-js";

import { ActionResult } from "@/types/actions";

import serverEnv from "@/lib/env.server";
import { notificationService } from "@/lib/notifications/notification-service";
import { setPasswordEmailTemplate } from "@/lib/notifications/templates/email/helper";

const supabaseAdmin = createClient(
    serverEnv.SUPABASE_URL,
    serverEnv.SUPABASE_SECRET_KEY,
);

export const createClient_action = async (
    name: string,
    email: string,
    language: string
): Promise<ActionResult<{ id: string, name: string, email: string }>> => {

    // Validaciones
    if (!name?.trim()) return {
        success: false,
        error: { field: "name", message: "El nombre es requerido" }
    };

    if (!email?.trim()) return {
        success: false,
        error: { field: "email", message: "El email es requerido" }
    };

    if (!language?.trim()) return {
        success: false,
        error: { field: "language", message: "El idioma es requerido" }
    };

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return {
        success: false,
        error: { field: "email", message: "El email no es válido" }
    };

    // 1. Crear el usuario en auth con password random (nunca se usa, nadie la conoce)
    const tempPassword = randomUUID() + randomUUID();

    // 1. Crear el usuario en auth (no toca tu sesión porque corre en el servidor)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true, // confirma el email automáticamente
        password: tempPassword,
        user_metadata: {
            full_name: name,
            language,
        }
    });

    if (authError) throw new Error(authError.message);

    const userId = authData.user.id;
    // El trigger ya creó la fila en profiles automáticamente

    // 2. Insertar en clients con el profile_id
    const { data: clientData, error: clientError } = await supabaseAdmin
        .from("clients")
        .insert({
            profile_id: userId,
            name,
            email,
        })
        .select()
        .single();

    if (clientError) return {
        success: false,
        error: { field: "general", message: clientError.message }
    };

    // 3. Generar link de invitación (type: invite no funciona post-creación,
    // usamos "recovery" porque el usuario ya existe y ya tiene email confirmado)
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email,
        options: {
            redirectTo: `${serverEnv.APP_URL}/set-password?mode=invite`
        }
    });

    if (linkError) {
        console.error("[createClient_action] Error generando link:", linkError.message);
        // No rompemos el flujo, el cliente ya se creó. Se puede reenviar después.
    } else {
        const result = await notificationService.send(
            await setPasswordEmailTemplate({
                recipient: { name, email },
                link: linkData.properties.action_link,
                isNewAccount: true,
            })
        );

        if (!result.success) {
            console.error("[createClient_action] Error enviando email:", result.error);
        }
    }

    return { success: true, data: { id: clientData.id, name: clientData.name, email: clientData.email } };
}; 