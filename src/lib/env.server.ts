// src/lib/env.server.ts → solo para server actions y server components
import env from "./env";

const serverEnv = {
    ...env,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY!,
    PERSONAL_EMAIL: process.env.PERSONAL_EMAIL!,
} as const;

export default serverEnv;