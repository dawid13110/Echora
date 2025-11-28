// app/account/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  openai_api_key: string | null;
};

export default function AccountPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      // 1) Check session
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session?.user) {
        router.push("/login");
        return;
      }

      const user = sessionData.session.user;

      // 2) Load profile row (no generics on .from / .single)
      const { data, error } = await supabase
        .from("profiles")
        .select("openai_api_key")
        .eq("id", user.id)
        .single();

      // If it's a "row not found" error, we just ignore it
      if (error && (error as any).code !== "PGRST116") {
        console.error("Error loading profile:", error);
        setError("Could not load your account settings.");
      } else if (data && (data as Profile).openai_api_key) {
        const profile = data as Profile;
        setApiKey(profile.openai_api_key ?? "");
      }

      setLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setSaving(false);
      router.push("/login");
      return;
    }

    // Upsert profile row – again, no generics on .from
    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        openai_api_key: apiKey || null,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Error saving profile:", error);
      setError("Could not save your API key. Try again in a moment.");
    } else {
      setMessage("API key saved successfully.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-zinc-400">Loading your account…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
        <h1 className="text-xl font-semibold mb-4 text-purple-300">
          Account settings
        </h1>

        <p className="text-sm text-zinc-400 mb-4">
          Here you can store your personal{" "}
          <span className="font-mono">OpenAI</span> API key. ECHORA will use
          this key when generating replies for your Echo.
        </p>

        {error && (
          <p className="mb-3 text-sm text-red-400 bg-red-950/40 border border-red-700/50 rounded px-3 py-2">
            {error}
          </p>
        )}

        {message && (
          <p className="mb-3 text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-700/50 rounded px-3 py-2">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              OpenAI API key
            </label>
            <input
              type="password"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              Stored securely in your Supabase profile. You can clear this field
              to remove it.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 hover:bg-purple-500 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
        </form>
      </div>
    </main>
  );
}
