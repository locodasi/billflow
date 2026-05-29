'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  
  const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.push("/invoices");
            } else {
                router.push("/login");
            }
        });
    }, [router]);

    return null;
}
