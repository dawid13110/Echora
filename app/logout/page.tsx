// app/logout/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        // Sign out from Supabase
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        // Always send user back to login
        router.replace("/login");
      }
    };

    doLogout();
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-zinc-200 flex items-center justify-center">
      <p className="text-sm text-zinc-400">Signing you out…</p>
    </main>
  );
}
