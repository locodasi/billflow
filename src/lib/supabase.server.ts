import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import env from "./env";

export const createServerClient = async () => {
    const cookieStore = await cookies();
    return createSSRClient(
        env.SUPABASE_URL,
        env.SUPABASE_PUBLISHABLE_KEY, // anon key, NO la secret
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );
};