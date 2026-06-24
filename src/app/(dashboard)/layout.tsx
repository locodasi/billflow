"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useProjectsStore } from "@/stores/projectStore";

import Sidenav from "./_components/Sidenav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const setSession = useAuthStore(state => state.setSession);
    const setUser = useUserStore(state => state.setUser);
    const setProjects = useProjectsStore(state => state.setProjects);

    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            // Guardás la sesión
            setSession(session);

            // Fetch del profile y guardás el usuario
            const { data: profile } = await supabase
                .from("profiles")
                .select("full_name, email, language, role")
                .eq("id", session.user.id)
                .single();

            if (profile) {
                setUser({
                    userId: session.user.id,
                    fullName: profile.full_name,
                    email: profile.email,
                    language: profile.language,
                    role: profile.role,
                });
            }
        };

        const loadProjects = async () => {
            const { data: projects } = await supabase
                .from("projects")
                .select("*")
                .order("created_at", { ascending: true });

            if (projects) {
                setProjects(projects);
            }
        };

        loadUser();
        loadProjects();

        // Escuchás cambios de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth event:", event, session);
            if (event === "SIGNED_OUT") {
                router.push("/login");
            }
            if (event === "TOKEN_REFRESHED" && session) {
                setSession(session);
            }
        });

        return () => subscription.unsubscribe();
    }, [router, setSession, setUser, setProjects]);


    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidenav />
            <main style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", backgroundColor: "var(--Background-Colors-bg-primary)" }}>
                {children}
            </main>
            
        </div>
    );
}