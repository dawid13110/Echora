"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setInfoMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // depending on Supabase settings, user may need to confirm email
    setInfoMsg("Account created. Check your email to confirm, then log in.");
    setLoading(false);

    // optional: send them to login after a short moment
    setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-purple-900 flex items-center justify-center text-white">
      <div className="w-full max-w-md px-6 py-8 bg-black/60 rounded-3xl shadow-[0_0_80px_rgba(168,85,247,0.5)] border border-white/5">
        <h1 className="text-center text-2xl font-semibold mb-2">
          Create your Echo
        </h1>
        <p className="text-center text-sm text-gray-400 mb-8">
          Sign up to start training your AI twin.
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          {infoMsg && (
            <p className="text-sm text-emerald-400">{infoMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-full bg-purple-600 hover:bg-purple-500 py-2.5 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating your Echo..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
          >
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
