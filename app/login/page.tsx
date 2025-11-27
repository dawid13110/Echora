"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // success -> go to dashboard
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-purple-900 flex items-center justify-center text-white">
      <div className="w-full max-w-md px-6 py-8 bg-black/60 rounded-3xl shadow-[0_0_80px_rgba(168,85,247,0.5)] border border-white/5">
        <h1 className="text-center text-2xl font-semibold mb-2">
          Welcome back to <span className="block">ECHORA</span>
        </h1>
        <p className="text-center text-sm text-gray-400 mb-8">
          Log in to access your Echo brain.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-xl bg-zinc-900/80 border border-zinc-700 px-3 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-xl bg-zinc-900/80 border border-zinc-700 px-3 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-full bg-purple-600 hover:bg-purple-500 py-2.5 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Don&apos;t have an account yet?{" "}
          <a
            href="/signup"
            className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
          >
            Create your Echo
          </a>
        </p>
      </div>
    </main>
  );
}
