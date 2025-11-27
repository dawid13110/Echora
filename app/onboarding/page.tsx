"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  const [tone, setTone] = useState("");
  const [boundaries, setBoundaries] = useState("");
  const [philosophy, setPhilosophy] = useState("");
  const [style, setStyle] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setSession(data.session);
      loadProfile(data.session.user.id);
    });
  }, [router]);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("echo_profile")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data) {
      setTone(data.tone ?? "");
      setBoundaries(data.boundaries ?? "");
      setPhilosophy(data.philosophy ?? "");
      setStyle(data.default_reply_style ?? "");
    }
  }

  async function handleSave() {
    if (!session) return;
    setLoading(true);

    const userId = session.user.id;

    const payload = {
      user_id: userId,
      tone,
      boundaries,
      philosophy,
      default_reply_style: style,
    };

    const { data: existing } = await supabase
      .from("echo_profile")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existing) {
      await supabase.from("echo_profile").update(payload).eq("user_id", userId);
    } else {
      await supabase.from("echo_profile").insert(payload);
    }

    setLoading(false);
    router.replace("/chat");
  }

  return (
    <main className="min-h-screen bg-black text-white flex justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-purple-300">Teach Your Echo</h1>

        <p className="text-gray-400 text-sm mb-8">
          Define how ECHORA should speak, what it should avoid, and the values behind its guidance.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block mb-1 text-sm text-purple-200">Speaking Tone</label>
            <textarea
              className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="Example: calm, direct, grounded, understanding, short sentences..."
              rows={2}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-purple-200">Boundaries</label>
            <textarea
              className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
              value={boundaries}
              onChange={(e) => setBoundaries(e.target.value)}
              placeholder="Topics ECHORA should avoid, communication limits, safety rules..."
              rows={2}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-purple-200">Core Philosophy / Beliefs</label>
            <textarea
              className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
              value={philosophy}
              onChange={(e) => setPhilosophy(e.target.value)}
              placeholder="What does ECHORA believe about life, growth, healing, responsibility?"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-purple-200">Default Reply Style</label>
            <textarea
              className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="Example: conversational with optional structured steps for clarity..."
              rows={2}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded bg-purple-600 hover:bg-purple-500 py-2 font-semibold disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Begin Chat"}
          </button>
        </div>
      </div>
    </main>
  );
}
