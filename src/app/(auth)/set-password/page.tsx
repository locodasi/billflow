"use server"

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase.server";
import SetPasswordForm from "./_components/SetPasswordForm";
import RecoveryGuard from "./_components/RecoveryGuard";

export default async function SetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ mode?: string }>;
}) {
    const { mode } = await searchParams;
    const isNewAccount = mode === "invite";

    // const supabase = await createServerClient();
    // const { data: { user } } = await supabase.auth.getUser();

    // const profile = await supabase.from("profiles").select("full_name").eq("id", user?.id).single();

    // const name = profile.data?.full_name ?? "Usuario";


    return (
        <RecoveryGuard isNewAccount={isNewAccount} />
    );
}
