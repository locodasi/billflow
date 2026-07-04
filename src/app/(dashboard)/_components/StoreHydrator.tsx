"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Language, Role, useUserStore } from "@/stores/userStore";
import { useProjectsStore } from "@/stores/projectStore";
import { Session } from "@supabase/supabase-js";
import { Project } from "@/types/project";

export function StoreHydrator({ session, profile, projects }: {
    session: Session;
    profile: { full_name: string; email: string; language: Language; role: Role } | null;
    projects: Project[];
}) {
    useState(() => {
        useAuthStore.setState({ session });

        if (profile) {
            useUserStore.setState({
                userId: session.user.id,
                fullName: profile.full_name,
                email: profile.email,
                language: profile.language,
                role: profile.role,
            });
        }

        useProjectsStore.setState({ projects, project: projects.length > 0 ? projects[0] : null });

        return true; // valor inicial del state, no lo usamos para nada más
    });

    return null;
}