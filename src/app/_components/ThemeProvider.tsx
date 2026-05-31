// src/components/ThemeProvider.tsx
'use client'

import { useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme, resolvedTheme, setTheme } = useUIStore();

    useEffect(() => {
        // Escuchar cambios del sistema
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = () => {
            if (theme === "system") {
                setTheme("system"); // re-evalúa el resolvedTheme
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme, setTheme]);

    useEffect(() => {
        // Aplicar el tema al html
        document.documentElement.setAttribute("data-theme", resolvedTheme);
    }, [resolvedTheme]);

    return <>{children}</>;
}