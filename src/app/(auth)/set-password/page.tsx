"use server"

import RecoveryGuard from "./_components/RecoveryGuard";

export default async function SetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ mode?: string }>;
}) {
    const { mode } = await searchParams;
    const isNewAccount = mode === "invite";

    return (
        <RecoveryGuard isNewAccount={isNewAccount} />
    );
}
