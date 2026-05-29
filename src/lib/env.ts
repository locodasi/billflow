// src/lib/env.ts
const env = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
} as const;

// Validación al arrancar
Object.entries(env).forEach(([key, value]) => {
    if (!value) throw new Error(`Missing environment variable: ${key}`);
});

export default env;