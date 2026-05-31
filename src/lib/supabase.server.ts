import { createClient } from "@supabase/supabase-js";
import serverEnv from "./env.server";

export const supabaseAdmin = createClient(
    serverEnv.SUPABASE_URL,
    serverEnv.SUPABASE_SECRET_KEY,
);