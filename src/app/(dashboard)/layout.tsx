"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";

import Sidenav from "./_components/Sidenav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const { setSession } = useAuthStore();
    const { setUser } = useUserStore();
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
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("full_name, email, language, role")
                .eq("id", session.user.id)
                .single();

            console.log("profile:", profile);
            console.log("profile error:", error);

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

        loadUser();

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
    }, [router, setSession, setUser]);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidenav />
            <main style={{ flex: 1, overflow: "auto", backgroundColor: "var(--Background-Colors-bg-primary)" }}>
                {children}
            </main>
        </div>
    );
}