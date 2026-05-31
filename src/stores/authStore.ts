// src/stores/authStore.ts
import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { registerStoreReset } from "./storeResetter";

interface AuthStore {
    session: Session | null;
    token: string | null;
    isLoading: boolean;
    setSession: (session: Session | null) => void;
    reset: () => void;
}

const INITIAL_STATE = {
    session: null,
    token: null,
    isLoading: true,
};

export const useAuthStore = create<AuthStore>()((set) => {
    const reset = () => set(INITIAL_STATE);
    registerStoreReset(reset);

    return {
        ...INITIAL_STATE,
        reset,
        setSession: (session) => set({
            session,
            token: session?.access_token ?? null,
            isLoading: false,
        }),
    };
});