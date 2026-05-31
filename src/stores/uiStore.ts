// src/stores/uiStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const resolveTheme = (theme: Theme): ResolvedTheme => {
    if (theme === "system") return getSystemTheme();
    return theme;
};

interface UIStore {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
}

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            theme: "system",
            resolvedTheme: "light",

            setTheme: (theme) => set({
                theme,
                resolvedTheme: resolveTheme(theme),
            }),
        }),
        {
            name: "ui-preferences",
            onRehydrateStorage: () => (state) => {
                // Cuando carga del localStorage re-evalúa el tema
                if (state) {
                    state.resolvedTheme = resolveTheme(state.theme);
                }
            }
        }
    )
);