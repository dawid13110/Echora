"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Profile = {
  openai_api_key: string | null;
};

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");

  const [hasKeyOnFile, setHasKeyOnFile] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("openai_api_key")
        .eq("user_id", session.user.id)
        .maybeSingle<Profile>();

      if (error) {
        console.error("Error loading profile:", error);
        setError("Could not load your profile. Please try again.");
      } else if (data) {
        setHasKeyOnFile(!!data.openai_api_key);
      }

      setLoading(false);
    };

    load();
  }, [router, supabase]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setError("Please paste a valid OpenAI API key.");
      return;
    }

    setSaving(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setSaving(false);
      router.replace("/login");
      return;
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: session.user.id,
        openai_api_key: trimmed,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Error saving API key:", error);
      setError("Could not save your key. Please try again.");
    } else {
      setApiKeyInput("");
      setHasKeyOnFile(true);
      setSuccess("API key saved. Your Echo will now use your own OpenAI credits.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-zinc-100 flex items-center justify-center">
        <p className="text-sm text-zinc-400">Loading your account…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-white">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Account settings
        </h1>
        <p className="text-sm text-zinc-400 mb-8">
          Connect your own OpenAI API key so your Echo uses <span className="font-medium text-zinc-200">your</span> credits,
          not the app owner&apos;s. You&apos;re always in control.
        </p>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-zinc-100">
                OpenAI API key
              </p>
              <p className="text-xs text-zinc-400">
                Your key is stored securely in the database and never shown in full again.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                hasKeyOnFile
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-700"
              }`}
            >
              {hasKeyOnFile ? "Key on file" : "No key saved yet"}
            </span>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-700/50 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-xs font-medium text-zinc-300">
              Paste your OpenAI API key
              <input
                type="password"
                autoComplete="off"
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-black/60 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="sk-..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
              />
            </label>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center rounded-full bg-purple-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-500/40 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {saving ? "Saving…" : "Save API key"}
            </button>
            <p className="text-[11px] text-zinc-500">
              You can create or manage your key in your{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-purple-300 hover:text-purple-200 underline underline-offset-2"
              >
                OpenAI dashboard
              </a>.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
