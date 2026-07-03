'use server'

import { createServerClient } from "@/lib/supabase.server";
import { Language } from "@/stores/userStore";
import { SupabaseClient } from "@supabase/supabase-js";

const getUserData = async (supabase: SupabaseClient) => {
    const { data: userData, error } = await supabase.auth.getUser();

    if (error || !userData.user) {
        console.error("Error fetching user:", error);
        throw new Error("No se pudo obtener el usuario");
    }

    return userData.user;
}

export async function updateUserLanguage(language: Language) {

    const supabase = await createServerClient();

    const user = await getUserData(supabase);

    const {data, error} = await supabase.from("profiles").update({ language }).eq("id", user.id);

    if (error){
        console.error("Error updating language:", error);
    }

    return data;
}