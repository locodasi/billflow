// src/actions/auth.ts
"use server";

import serverEnv from "@/lib/env.server";
import { notificationService } from "@/lib/notifications/notification-service";
import { setPasswordEmailTemplate } from "@/lib/notifications/templates/email/helper";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { ActionResult } from "@/types/actions";

type SendSetPasswordEmailParams = {
    email: string;
    isNewAccount?: boolean;
};

export const sendSetPasswordEmail_action = async ({
    email,
    isNewAccount = false,
}: SendSetPasswordEmailParams): Promise<ActionResult<null>> => {

    if (!email?.trim()) return {
        success: false,
        error: { field: "email", message: "El email es requerido" }
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return {
        success: false,
        error: { field: "email", message: "El email no es válido" }
    };

    // 1. Generar el link de recovery

    console.log(`prueba: ${serverEnv.APP_URL}/set-password${isNewAccount ? "?mode=invite" : ""}`)
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email,
        options: {
            redirectTo: `${serverEnv.APP_URL}/set-password${isNewAccount ? "?mode=invite" : ""}`
        }
    });

    // Por seguridad, no reveles si el email existe o no en el sistema.
    // Si falla porque el usuario no existe, devolvés éxito igual (mismo
    // comportamiento que cualquier "forgot password" serio).
    if (linkError) {
        console.error("[sendSetPasswordEmail_action]", linkError.message);
        return { success: true, data: null };
    }

    // 2. Obtener el nombre del usuario para personalizar el email
    const name = linkData.user?.user_metadata?.full_name ?? "Usuario";

    // 3. Enviar el email
    const result = await notificationService.send(
        await setPasswordEmailTemplate({
            recipient: { name, email },
            link: linkData.properties.action_link,
            isNewAccount,
        })
    );

    if (!result.success) {
        console.error("[sendSetPasswordEmail_action]", result.error);
        return {
            success: false,
            error: { field: "general", message: "No se pudo enviar el email. Intentá de nuevo." }
        };
    }

    return { success: true, data: null };
};