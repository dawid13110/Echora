"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type EchoSettings = {
  tone_style?: string;
  boundaries?: string;
  bio?: string;
  example_responses?: string;
  auto_reply_default?: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<EchoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      // 1) Check Supabase session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
      }

      if (!session) {
        router.replace("/login");
        return;
      }

      setUserEmail(session.user.email || "your account");

      // 2) Load echo settings via your existing API route
      try {
        const res = await fetch("/api/echo-settings");
        if (!res.ok) {
          console.error("Failed to load echo_settings, status:", res.status);
          setSettings(null);
        } else {
          const { data, error } = await res.json();
          if (error) {
            console.error("Error from /api/echo-settings:", error);
            setSettings(null);
          } else {
            setSettings(data ?? null);
          }
        }
      } catch (err) {
        console.error("Network error loading echo_settings:", err);
        setSettings(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const goToOnboarding = () => router.push("/onboarding");
  const goToChat = () => router.push("/chat");

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen text-center text-gray-300">
        Loading your Echo…
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white px-6 py-20 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10">Your Echo Dashboard</h1>

      <p className="text-gray-400 mb-6">
        Logged in as <span className="text-purple-400">{userEmail}</span>
      </p>

      <div className="w-full max-w-2xl bg-black/40 border border-zinc-800 rounded-xl p-6">
        {settings ? (
          <>
            <p className="text-green-400 font-semibold mb-3">
              ✓ Your Echo brain is configured.
            </p>

            <div className="space-y-2 text-gray-300">
              <p>
                <strong className="text-white">Tones:</strong>{" "}
                {settings.tone_style || "Not set"}
              </p>

              <p>
                <strong className="text-white">Auto-reply:</strong>{" "}
                {settings.auto_reply_default ? "Enabled" : "Disabled"}
              </p>

              <p className="text-sm text-gray-500 mt-4">
                You can modify your Echo personality anytime.
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="text-yellow-400 font-semibold mb-3">
              ⚠ No Echo settings found.
            </p>
            <p className="text-gray-400 mb-4">
              You’ll need to configure your Echo before you can start chatting.
            </p>
          </>
        )}

        <div className="mt-6 flex gap-3">
          {/* Onboarding / settings button */}
          <button
            onClick={goToOnboarding}
            className="rounded-full bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-sm font-medium"
          >
            {settings ? "Edit Echo settings" : "Train your Echo"}
          </button>

          {/* Chat button */}
          <button
            onClick={goToChat}
            className="rounded-full bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 text-sm font-medium border border-zinc-600"
          >
            Open Chat
          </button>
        </div>
      </div>
    </main>
  );
}
