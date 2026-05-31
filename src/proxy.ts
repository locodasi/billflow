// src/proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import env from "@/lib/env";

export async function proxy(req: NextRequest) {
    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    });

    const supabase = createServerClient(
        env.SUPABASE_URL,
        env.SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        req.cookies.set(name, value)
                    );
                    res = NextResponse.next({
                        request: req,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        res.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();


    const isAuth = !!session;
    const isLoginPage = req.nextUrl.pathname.startsWith("/login");

    if (!isAuth && !isLoginPage) {
        console.log("redirigiendo a login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isAuth && isLoginPage) {
        return NextResponse.redirect(new URL("/invoices", req.url));
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|icons).*)"],
};