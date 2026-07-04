// src/lib/auth.ts
import { resetAllStores } from "@/stores/storeResetter";

import { clearUserLocale, setUserLocale } from "./locale";
import { supabase } from "./supabase";
import { Language } from "@/stores/userStore";

export const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    // Solo necesitamos el "language" acá, para que la cookie ya esté
    // correcta ANTES de que el layout de /invoices renderice
    const { language } = await getUserLanguage(data.user.id);
    await setUserLocale(language);

    return data;
};

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    localStorage.clear(); // limpia todo el localStorage
    await clearUserLocale();
    resetAllStores();     // resetea todos los stores registrados
};

export const register = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            }
        }
    });

    if (error) throw error;

    return data;
};

export const getUserLanguage = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles') // <- ajustar al nombre real de tu tabla
        .select('language')
        .eq('id', userId)
        .single();

    if (error) throw error;

    return data as { language: Language };
};