// src/lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr";
import env from "./env";

export const supabase = createBrowserClient(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY
);