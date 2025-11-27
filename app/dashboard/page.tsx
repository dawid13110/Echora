"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type EchoSettingsRow = {
  user_id: string;
  tones: string[] | null;
  base_prompt: string | null;
  safety_rules: string | null;
  auto_reply_enabled: boolean | null;
};

export default function DashboardPage() {
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [settings, setSettings] = useState<EchoSettingsRow | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    async function load() {
      // 1) Get current session
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        // Not logged in – kick to login
        window.location.href = "/login";
        return;
      }

      // 2) Load echo_settings directly from Supabase
      setSessionLoaded(true);
      setLoadingSettings(true);

      const { data: row, error } = await supabase
        .from("echo_settings")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle<EchoSettingsRow>();

      if (error) {
        console.error("Error loading echo_settings from Supabase:", error);
        setSettings(null);
      } else {
        setSettings(row ?? null);
      }

      setLoadingSettings(false);
    }

    load();
  }, []);

  const isConfigured = !!settings;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-white">
      {/* Top bar */}
      <header className="w-full border-b border-zinc-800/60 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/80 shadow-lg shadow-purple-500/40">
              <span className="text-xs font-bold tracking-tight">E</span>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">ECHORA</p>
              <p className="text-[11px] text-zinc-400">Your personal AI echo</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            <Link href="/chat" className="hover:text-zinc-100 transition">
              Chat
            </Link>
            <Link href="/account" className="hover:text-zinc-100 transition">
              Account
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/logout"
              className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500 hover:text-white transition"
            >
              Log out
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard card */}
      <section className="mx-auto flex max-w-4xl flex-col gap-8 px-4 pb-16 pt-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Your Echo Dashboard
        </h1>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-xl shadow-purple-900/20">
          {!sessionLoaded || loadingSettings ? (
            <p className="text-sm text-zinc-400">Loading your Echo…</p>
          ) : isConfigured ? (
            <>
              <p className="mb-1 text-xs font-semibold text-emerald-400">
                ✅ Your Echo brain is configured.
              </p>
              <p className="text-sm text-zinc-300">
                Tones:{" "}
                <span className="text-zinc-100">
                  {(settings.tones ?? []).join(", ") || "Not set"}
                </span>
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Auto-reply:{" "}
                <span className="text-zinc-100">
                  {settings.auto_reply_enabled ? "Enabled" : "Disabled"}
                </span>
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                Base personality & safety rules are saved. You can edit them
                anytime from “Edit Echo settings”.
              </p>
            </>
          ) : (
            <>
              <p className="mb-1 text-xs font-semibold text-amber-300">
                ⚠️ No Echo settings found.
              </p>
              <p className="text-sm text-zinc-300">
                You’ll need to configure your Echo before you can start
                chatting.
              </p>
            </>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {/* Onboarding / training button */}
            <Link
              href="/onboarding"
              className="rounded-full bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-sm font-medium shadow-lg shadow-purple-500/40"
            >
              {isConfigured ? "Edit Echo settings" : "Train your Echo"}
            </Link>

            {/* Chat button */}
            <Link
              href="/chat"
              className="rounded-full bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 text-sm font-medium border border-zinc-700"
            >
              Open Chat
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
