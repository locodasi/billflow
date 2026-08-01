"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { DEFAULT_SETTINGS, Language, Role, UserSettingsInput, useUserStore } from "@/stores/userStore";
import { useProjectsStore } from "@/stores/projectStore";
import { Session } from "@supabase/supabase-js";
import { Project } from "@/types/project";
import { deepMerge } from "@/lib/deep-merge";

const VALID_LANGUAGES: Language[] = ["es", "en", "de"];

function toLanguage(value: string): Language {
    return VALID_LANGUAGES.includes(value as Language) ? (value as Language) : "es";
}

function toRole(value: string): Role {
    return value === "admin" ? "admin" : "client";
}

export function StoreHydrator({ session, profile, projects }: {
    session: Session;
    profile: { full_name: string | null; email: string | null; language: string; role: string; settings: UserSettingsInput | null; } | null;
    projects: Project[];
}) {
    useState(() => {
        useAuthStore.setState({ session });

        if (profile) {
            useUserStore.setState({
                userId: session.user.id,
                fullName: profile.full_name ?? "",
                email: profile.email ?? "",
                language: toLanguage(profile.language),
                role: toRole(profile.role),
                settings: deepMerge(DEFAULT_SETTINGS, profile.settings ?? {}),
            });
        }

        useProjectsStore.setState({ projects, project: projects.length > 0 ? projects[0] : null });

        return true; // valor inicial del state, no lo usamos para nada más
    });

    return null;
}