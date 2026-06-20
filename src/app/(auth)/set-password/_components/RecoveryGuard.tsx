"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SetPasswordForm from "./SetPasswordForm";

function parseHash() {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.hash.slice(1));

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");
    const error = params.get("error");

    if (error || type !== "recovery" || !accessToken || !refreshToken) {
        return null;
    }

    return { accessToken, refreshToken };
}

export default function RecoveryGuard({ isNewAccount }: { isNewAccount: boolean }) {
    const router = useRouter();

    const [tokens] = useState(() => parseHash());
    const [status, setStatus] = useState<"checking" | "ok" | "invalid">(() =>
        tokens ? "checking" : "invalid"
    );
    const [name, setName] = useState("Usuario");

    useEffect(() => {
        if (!tokens) return; // ya está en "invalid" por el initializer, no hay nada que hacer

        supabase.auth.setSession({
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
        }).then(({ data: { user }, error }) => {
            // console.log("setSession result:", { user, error });

            if (error || !user) {
                setStatus("invalid");
                return;
            }

            setName(user.user_metadata?.full_name ?? "Usuario");
            setStatus("ok");

            window.history.replaceState(null, "", window.location.pathname + window.location.search);
        });
    }, [tokens]);

    useEffect(() => {
        if (status === "invalid") router.replace("/link-invalid");
    }, [status, router]);

    if (status !== "ok") return null;

    return <SetPasswordForm name={name} isNewAccount={isNewAccount} />;
}