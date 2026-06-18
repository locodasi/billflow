// src/lib/notifications/utils/get-notification-user.ts

import { supabaseAdmin } from "./supabaseAdmin";

export interface NotificationUser {
    id: string;
    fullName: string;
    email: string;
    language: string;
}

// Caso 1 — por profile id directo
export async function getUserById(profileId: string): Promise<NotificationUser> {
    const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, email, language")
        .eq("id", profileId)
        .single();

    if (error || !data) {
        throw new Error(`User not found for profile id: ${profileId}`);
    }

    return {
        id: data.id,
        fullName: data.full_name ?? "",
        email: data.email ?? "",
        language: data.language,
    };
}

// Caso 2 — por project id (owner del proyecto)
export async function getUserByProjectId(projectId: string): Promise<NotificationUser> {
    const { data, error } = await supabaseAdmin
        .from("projects")
        .select(`
      client:clients (
        profile:profiles (
          id,
          full_name,
          email,
          language
        )
      )
    `)
        .eq("id", projectId)
        .single();

    // @ts-expect-error porque si
    const profile = data?.client?.profile;

    if (error || !profile) {
        throw new Error(`User not found for project id: ${projectId}`);
    }

    return {
        id: profile.id,
        fullName: profile.full_name ?? "",
        email: profile.email ?? "",
        language: profile.language,
    };
}