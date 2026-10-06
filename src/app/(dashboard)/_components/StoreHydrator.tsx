"use client";

import { useState, useSyncExternalStore } from "react";
import { useAuthStore } from "@/stores/authStore";
import { DEFAULT_SETTINGS, Language, Role, UserSettingsInput, useUserStore } from "@/stores/userStore";
import { useProjectsStore } from "@/stores/projectStore";
import { Session } from "@supabase/supabase-js";
import { Project } from "@/types/project";
import { deepMerge } from "@/lib/deep-merge";
import { DashboardSkeleton } from "./DashboardSkeleton";

const VALID_LANGUAGES: Language[] = ["es", "en", "de"];

function toLanguage(value: string): Language {
    return VALID_LANGUAGES.includes(value as Language) ? (value as Language) : "es";
}

function toRole(value: string): Role {
    return value === "admin" ? "admin" : "client";
}

function subscribe() {
    return () => {};
}

function getClientSnapshot() {
    return true;
}

function getServerSnapshot() {
    return false;
}

export function StoreHydrator({ session, profile, projects, children }: {
    session: Session;
    profile: { full_name: string | null; email: string | null; language: string; role: string; settings: UserSettingsInput | null; } | null;
    projects: Project[];
    children: React.ReactNode;
}) {
    const isClient = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

    useState(function initializeStores() {
        if (typeof window === "undefined") return false;

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

        return true;
    });

    const content = isClient ? children : <DashboardSkeleton />;

    return <>{content}</>;
}