"use client";

import {
  useEffect,
  useState,
  FormEvent,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type EchoSettings = {
  tones: string[] | null;
  base_prompt: string | null;
  safety_rules: string | null;
};

type ChatMessage = {
  id: string;
  role: "user" | "echo";
  content: string;
  createdAt: string;
};

export default function EchoChatPage() {
  const router = useRouter();

  const [checkingSession, setCheckingSession] = useState(true);
  const [settings, setSettings] = useState<EchoSettings | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔐 Check session + load echo_settings
  useEffect(() => {
    const checkSessionAndLoad = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("echo_settings")
        .select("tones, base_prompt, safety_rules")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading echo_settings:", error);
      } else if (data) {
        setSettings({
          tones: data.tones ?? null,
          base_prompt: data.base_prompt ?? null,
          safety_rules: data.safety_rules ?? null,
        });
      }

      setCheckingSession(false);
    };

    checkSessionAndLoad();
  }, [router]);

  // ⬇ auto-scroll when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    // 🧠 STEP 4 FUTURE: call /api/echo here.
    // For now, we simulate a reply so the UI works.
    setTimeout(() => {
      const echoMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "echo",
        content:
          `This is a placeholder Echo reply.\n\n` +
          `Later I'll answer using your real Echo brain. You said:\n"${text}"`,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, echoMsg]);
      setSending(false);
    }, 500);
  };

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-gray-400">
          Checking your Echo session…
        </p>
      </main>
    );
  }

  const tonesLabel = Array.isArray(settings?.tones)
    ? settings?.tones.join(", ")
    : settings?.tones ?? "Not set";

  return (
    <main className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-4xl flex flex-col px-4 py-6 gap-4">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-2">
              Talk to your Echo
            </h1>
            <p className="text-xs md:text-sm text-gray-400">
              Your AI version of you – powered by your tone & rules.
            </p>

            {settings ? (
              <div className="mt-3 text-xs md:text-sm text-gray-300 space-y-1">
                <p>
                  <span className="font-medium text-gray-200">Tones:</span>{" "}
                  {tonesLabel}
                </p>
                {settings.base_prompt && (
                  <p className="line-clamp-2">
                    <span className="font-medium text-gray-200">
                      Base prompt:
                    </span>{" "}
                    {settings.base_prompt}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-xs text-amber-300">
                You haven&apos;t trained your Echo yet. Go to{" "}
                <a
                  href="/onboarding"
                  className="underline text-purple-400"
                >
                  onboarding
                </a>{" "}
                to set it up.
              </p>
            )}
          </div>

          <a
            href="/dashboard"
            className="text-xs md:text-sm text-gray-400 hover:text-white border border-gray-700 px-3 py-1 rounded-full"
          >
            ← Back to dashboard
          </a>
        </header>

        {/* Chat area */}
        <section className="flex-1 min-h-[55vh] bg-gradient-to-b from-slate-900/70 to-black border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-center text-sm text-gray-500">
                <p>
                  Start talking to your Echo. Tell it about your day,
                  ask it to write something like you, or let it reply
                  to a message in your style.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-br-sm"
                      : "bg-slate-800 text-gray-100 rounded-bl-sm"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-wide mb-1 opacity-70">
                    {msg.role === "user" ? "You" : "Echo"}
                  </p>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="border-t border-slate-800 bg-black/70 px-4 py-3 md:px-6 flex items-center gap-3"
          >
            <input
              className="flex-1 bg-slate-900/70 border border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Say something to your Echo…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 px-4 py-2 text-sm font-medium"
            >
              {sending ? "Echo is thinking…" : "Send"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
