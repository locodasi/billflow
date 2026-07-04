// src/stores/userStore.ts
import { create } from "zustand";
import { registerStoreReset } from "./storeResetter";

export type Role = "admin" | "client";
export type Language = "es" | "en" | "de";

interface UserStore {
    userId: string | null;
    fullName: string;
    email: string;
    language: Language | null;
    role: Role | null;
    setUser: (data: Omit<UserStore, "setUser" | "reset" | "setLanguage">) => void;
    setLanguage: (language: Language) => void;
    reset: () => void;
}

const INITIAL_STATE = {
    userId: null,
    fullName: "",
    email: "",
    language: null as Language | null,
    role: null,
};

export const useUserStore = create<UserStore>()((set) => {
    const reset = () => set(INITIAL_STATE);
    registerStoreReset(reset);

    return {
        ...INITIAL_STATE,
        reset,
        setUser: (data) => set(data),
        setLanguage: (language: Language) => set({ language }),
    };
});