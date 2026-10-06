import styled from "styled-components";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase.server";

import { StoreHydrator } from "./_components/StoreHydrator";
import { AuthListener } from "./_components/AuthListener";
import Sidenav from "./_components/Sidenav";
import { UserSettingsInput } from "@/stores/userStore";
import MobileHeader from "./_components/MobileHeader";

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

    const [{ data: profile, error: profileError }, { data: projects, error: projectsError }] = await Promise.all([
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

    if (profileError || projectsError) {
        console.error("Dashboard load failed", { profileError, projectsError });
        throw new Error("No se pudieron cargar los datos del dashboard");
    }

    const normalizedProfile = profile
        ? { ...profile, settings: profile.settings as UserSettingsInput | null }
        : null;

    return (
        <DashboardContainer>
            <AuthListener />

            <StoreHydrator session={session} profile={normalizedProfile} projects={projects ?? []}>
                <Sidenav />
                <MobileHeader />
                <Main>
                    {children}
                </Main>
            </StoreHydrator>
        </DashboardContainer>
    );
}

const DashboardContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Main = styled.main`
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;

    background-color: var(--Background-Colors-bg-primary);
`;
