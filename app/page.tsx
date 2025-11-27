// app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
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
              <p className="text-sm font-semibold tracking-tight">
                ECHORA
              </p>
              <p className="text-[11px] text-zinc-400">
                Your personal AI echo
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            <a href="#how-it-works" className="hover:text-zinc-100 transition">
              How it works
            </a>
            <a href="#use-cases" className="hover:text-zinc-100 transition">
              Use cases
            </a>
            <a href="#safety" className="hover:text-zinc-100 transition">
              Safety
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500 hover:text-white transition"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-purple-600 px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-lg shadow-purple-500/40 hover:bg-purple-500 transition"
            >
              Enter the Echo Chamber
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-14 md:flex-row md:items-center md:pt-20">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[11px] text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live · Your personal Echo is always on
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Train an AI version of you.
            <span className="block text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-sky-400 bg-clip-text">
              Let it talk, sell, and support in your style.
            </span>
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            ECHORA lets you create an AI “echo” of yourself.  
            Teach it your tone, boundaries, and stories — then let it handle
            DMs, support, and conversations while you focus on your real life.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-purple-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 hover:bg-purple-500 transition"
            >
              Start for free
            </Link>
            <p className="text-xs text-zinc-400">
              No credit card needed to test.  
              <span className="block sm:inline"> Bring your own OpenAI key when you’re ready.</span>
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-1 gap-3 text-xs text-zinc-300 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <p className="mb-1 text-[11px] font-semibold text-zinc-100">
                Your tone, not generic AI
              </p>
              <p className="text-[11px] text-zinc-400">
                Train Echo with your style, boundaries, and examples.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <p className="mb-1 text-[11px] font-semibold text-zinc-100">
                Built on top-tier models
              </p>
              <p className="text-[11px] text-zinc-400">
                Uses OpenAI models with your own API key and limits.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <p className="mb-1 text-[11px] font-semibold text-zinc-100">
                You stay in control
              </p>
              <p className="text-[11px] text-zinc-400">
                Clear safety rules so Echo never crosses your line.
              </p>
            </div>
          </div>
        </div>

        {/* Mock UI preview */}
        <div className="flex-1">
          <div className="mx-auto max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-xl shadow-purple-900/30">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-200">
                Echo Chat · Dawid&apos;s Echo
              </p>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Auto-reply ON
              </span>
            </div>

            <div className="space-y-3 rounded-2xl bg-zinc-900/80 p-3">
              <div className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-purple-600 px-3 py-2 text-[11px] text-white">
                  Hey Echo, answer DMs like me but stay kind & honest.
                </div>
              </div>
              <div className="flex">
                <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-zinc-800 px-3 py-2 text-[11px] text-zinc-100">
                  Got it. I&apos;ll keep it real, respectful, and aligned with
                  your values. Nothing fake, nothing sugar-coated.
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-[11px] text-zinc-400">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-purple-600/80 text-[10px] text-white">
                E
              </span>
              <span>“Train once. Let me handle the repetitive replies.”</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-zinc-800/60 bg-black/40"
      >
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            How ECHORA works
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <p className="mb-1 text-xs font-semibold text-zinc-200">
                1 · Train your Echo
              </p>
              <p className="text-xs text-zinc-400">
                Set your tones, base prompt, and safety rules in a guided flow.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <p className="mb-1 text-xs font-semibold text-zinc-200">
                2 · Talk to it
              </p>
              <p className="text-xs text-zinc-400">
                Use the Echo Chat to refine responses until it feels “like you”.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <p className="mb-1 text-xs font-semibold text-zinc-200">
                3 · Let it work
              </p>
              <p className="text-xs text-zinc-400">
                Turn on auto-reply and let Echo help with conversations,
                support, and repetitive questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section id="safety" className="border-t border-zinc-800/60 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-zinc-200">
                Safety first, then autonomy.
              </h3>
              <p className="mb-3 text-xs text-zinc-400">
                You define hard boundaries your Echo will never cross:
                topics to avoid, tones to refuse, and when to escalate back to
                you. ECHORA is designed to be a tool, not a replacement.
              </p>
              <p className="text-xs text-zinc-400">
                Under the hood, every reply is filtered through your safety
                rules before being sent. If something feels off, you can always
                disable auto-reply and switch to manual mode.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-zinc-800 bg-black/60 p-4 text-xs text-zinc-300">
              <p className="font-semibold text-zinc-100 text-[11px]">
                Example safety rules your Echo can follow:
              </p>
              <ul className="space-y-1 text-[11px] text-zinc-400">
                <li>• No medical, legal, or financial advice.</li>
                <li>• Stay respectful, no insults or humiliation.</li>
                <li>• If someone is in crisis, encourage real-world help.</li>
                <li>• Never pretend to be the real Dawid without saying so.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 bg-black/90">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-[11px] text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ECHORA. Built by Dawid & Echo.</p>
          <div className="flex gap-4">
            <a
              href="/login"
              className="hover:text-zinc-300 transition"
            >
              Sign in
            </a>
            <a
              href="https://github.com/dawid13110/Echora"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-300 transition"
            >
              View code
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
