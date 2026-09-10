import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase.server";

import { StoreHydrator } from "./_components/StoreHydrator";
import { AuthListener } from "./_components/AuthListener";
import Sidenav from "./_components/Sidenav";
import { UserSettingsInput } from "@/stores/userStore";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createServerClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    const [{ data: profile }, { data: projects }] = await Promise.all([
        supabase
            .from("profiles")
            .select("full_name, email, language, role, settings")
            .eq("id", session.user.id)
            .single(),
        supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: true }),
    ]);

    const normalizedProfile = profile
        ? { ...profile, settings: profile.settings as UserSettingsInput | null }
        : null;

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <StoreHydrator session={session} profile={normalizedProfile} projects={projects ?? []} />
            <AuthListener />
            <Sidenav />
            <main style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", backgroundColor: "var(--Background-Colors-bg-primary)" }}>
                {children}
            </main>
        </div>
    );
}