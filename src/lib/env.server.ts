// src/lib/env.server.ts → solo para server actions y server components
import env from "./env";

const serverEnv = {
    ...env,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY!,
} as const;

export default serverEnv;