// src/stores/userStore.ts
import { create } from "zustand";

import { deepMerge, DeepPartial } from "@/lib/deep-merge";

import { registerStoreReset } from "./storeResetter";

export type Role = "admin" | "client";
export type Language = "es" | "en" | "de";

export type UserSettings = {
    "notifications": {
        "email": {
            "invoiceUploaded": boolean;
            "invoiceApproved": boolean;
            "invoiceRejected": boolean;
        }
    }
}

interface UserStore {
    userId: string | null;
    fullName: string;
    email: string;
    language: Language | null;
    role: Role | null;
    settings: UserSettings;
    setUser: (data: Omit<UserStore, "setUser" | "reset" | "setLanguage">) => void;
    setLanguage: (language: Language) => void;
    setSettings: (settings: UserSettingsInput) => void;
    reset: () => void;
}

export type UserSettingsInput = DeepPartial<UserSettings>;

export const DEFAULT_SETTINGS: Required<UserSettings> = {
    notifications: {
        email: {
            invoiceUploaded: true,
            invoiceApproved: true,
            invoiceRejected: true,
        },
    },
};

const INITIAL_STATE = {
    userId: null,
    fullName: "",
    email: "",
    language: null as Language | null,
    role: null,
    settings: DEFAULT_SETTINGS,
};

export const useUserStore = create<UserStore>()((set) => {
    const reset = () => set(INITIAL_STATE);
    registerStoreReset(reset);

    return {
        ...INITIAL_STATE,
        reset,
        setUser: (data) => set({
            ...data,
            settings: deepMerge(DEFAULT_SETTINGS, data.settings ?? {}),
        }),
        setLanguage: (language: Language) => set({ language }),
        setSettings: (settings: UserSettingsInput) => set((state) => ({
            settings: deepMerge(state.settings as UserSettings, settings),
        })),
    };
});