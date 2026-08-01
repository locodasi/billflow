// src/lib/notifications/utils/get-notification-user.ts

import { deepMerge } from "@/lib/deep-merge";
import { UserSettings, UserSettingsInput, DEFAULT_SETTINGS } from "@/stores/userStore";

import { supabaseAdmin } from "./supabaseAdmin";

export interface NotificationUser {
    id: string;
    fullName: string;
    email: string;
    language: string;
    settings: UserSettings;
}

// Caso 1 — por profile id directo
export async function getUserById(profileId: string): Promise<NotificationUser> {
    const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, email, language, settings")
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
        settings: deepMerge(DEFAULT_SETTINGS, data.settings ?? {}),
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
          language,
          settings
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
        settings: deepMerge(DEFAULT_SETTINGS, (profile.settings as UserSettingsInput | null) ?? {}),
    };
}