"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type EchoSettings = {
  tones: string[];              // e.g. ["Balanced", "Raw"]
  base_prompt: string;          // big personality prompt
  safety_rules: string[];       // array of rules from onboarding
  auto_reply_default: boolean;  // true / false
};

export default function DashboardPage() {
  const router = useRouter();

  const [settings, setSettings] = useState<EchoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const checkSessionAndLoad = async () => {
      // 1) Make sure user is logged in
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setErrorMsg("Problem checking your session.");
        setLoading(false);
        return;
      }

      if (!session) {
        router.replace("/login");
        return;
      }

      // 2) Load echo_settings for this user
      const { data, error } = await supabase
        .from("echo_settings")
        .select("tones, base_prompt, safety_rules, auto_reply_default")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error(
          "Error loading echo_settings:",
          JSON.stringify(error, null, 2)
        );
        setErrorMsg("Could not load your Echo settings.");
      } else if (data) {
        setSettings({
          tones: data.tones ?? [],
          base_prompt: data.base_prompt ?? "",
          safety_rules: Array.isArray(data.safety_rules)
            ? data.safety_rules
            : [],
          auto_reply_default: data.auto_reply_default ?? false,
        });
      } else {
        // No row yet – that's fine, just means user hasn't onboarded
        setSettings(null);
      }

      setLoading(false);
    };

    checkSessionAndLoad();
  }, [router]);

  const goToOnboarding = () => {
    router.push("/onboarding");
  };

  const goToChat = () => {
    router.push("/chat");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-violet-950 text-white flex flex-col items-center pt-24 px-4">
      <div className="w-full max-w-3xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Your Echo Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Review your ECHORA clone settings and jump into a chat.
            </p>
          </div>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/login");
            }}
            className="rounded-full border border-zinc-700 px-4 py-1.5 text-xs font-medium text-gray-300 hover:bg-zinc-900 transition"
          >
            Log out
          </button>
        </header>

        {/* STATUS CARD */}
        <section className="mb-8">
          <div className="rounded-2xl bg-zinc-950/70 border border-zinc-800 px-5 py-4 shadow-lg shadow-purple-500/10">
            {loading ? (
              <p className="text-sm text-gray-400">Loading your Echo brain…</p>
            ) : errorMsg ? (
              <p className="text-sm text-red-400">{errorMsg}</p>
            ) : settings ? (
              <div className="space-y-3 text-sm">
                <p className="text-gray-300">
                  ✅ Your Echo brain is{" "}
                  <span className="font-semibold text-purple-300">configured</span>.
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold text-gray-300">Tones:</span>{" "}
                  {settings.tones.length
                    ? settings.tones.join(", ")
                    : "Not set."}
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold text-gray-300">
                    Auto-reply:
                  </span>{" "}
                  {settings.auto_reply_default ? "Enabled" : "Disabled"}
                </p>
                <p className="text-gray-500 text-xs">
                  Base personality prompt is saved. Edit it any time from
                  &quot;Edit Echo settings&quot;.
                </p>
              </div>
            ) : (
              <div className="text-sm">
                <p className="text-gray-300">
                  👋 Your Echo brain is currently empty.
                </p>
                <p className="text-gray-400 mt-1">
                  Next, we&apos;ll teach it how you speak, where your boundaries
                  are, and how you want it to respond on your behalf.
                </p>
                <p className="text-gray-500 mt-1">
                  No settings saved yet. Hit{" "}
                  <span className="text-purple-400 font-semibold">
                    &quot;Train your Echo&quot;
                  </span>{" "}
                  to set them up.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <section className="flex flex-wrap gap-3 mt-6">
          {/* Onboarding / Edit */}
          <button
            onClick={goToOnboarding}
            className="rounded-full bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-sm font-medium shadow-lg shadow-purple-500/30"
          >
            {settings ? "Edit Echo settings" : "Train your Echo"}
          </button>

          {/* Chat */}
          <button
            onClick={goToChat}
            className="rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-5 py-2.5 text-sm font-medium text-gray-200"
          >
            Open Chat
          </button>
        </section>
      </div>
    </main>
  );
}
