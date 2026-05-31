// src/lib/auth.ts
import { supabase } from "./supabase";
import { resetAllStores } from "@/stores/storeResetter";

export const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    return data;
};

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    localStorage.clear(); // limpia todo el localStorage
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