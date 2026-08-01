"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";

export function AuthListener() {
    const router = useRouter();
    const setSession = useAuthStore((s) => s.setSession);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT") {
                router.push("/login");
            }
            if (event === "TOKEN_REFRESHED" && session) {
                setSession(session);
            }
        });

        return () => subscription.unsubscribe();
    }, [router, setSession]);

    return null;
}