"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatPage() {
  const [session, setSession] = useState<any>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.href = "/login";
      } else {
        setSession(data.session);
      }
    });
  }, []);

  async function handleSend() {
    if (!input.trim() || !session) return;

    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    // 1) Fetch last memories for this user
    const { data: memData } = await supabase
      .from("conversation_memory")
      .select("memory")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(8);

    const memories = memData?.map((m) => m.memory as string) ?? [];

    // 2) Call /api/echo with message + userId + memories
    const res = await fetch("/api/echo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        userId: session.user.id,
        memories,
      }),
    });

    const data = await res.json();
    const reply: string = data.reply || "ECHORA could not respond.";

    setMessages((prev) => [...prev, { role: "assistant", text: reply }]);

    // 3) Extract + store a new memory from this user message
    const memRes = await fetch("/api/memory/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const memJson = await memRes.json();
    if (memJson?.memory) {
      await supabase.from("conversation_memory").insert({
        user_id: session.user.id,
        memory: memJson.memory,
      });
    }

    setLoading(false);
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-sm text-zinc-400">Checking your session…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-zinc-900 p-4 rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-4 text-purple-300">
          ECHORA Chat
        </h1>

        <div className="h-[450px] overflow-y-auto space-y-3 border border-zinc-700 p-3 rounded bg-black/40">
          {messages.map((m, i) => (
            <div key={i}>
              <p
                className={
                  m.role === "user" ? "text-purple-300" : "text-green-300"
                }
              >
                <strong>{m.role === "user" ? "You" : "ECHORA"}:</strong>{" "}
                {m.text}
              </p>
            </div>
          ))}
          {loading && (
            <p className="text-sm text-gray-400">ECHORA is thinking…</p>
          )}
        </div>

        <div className="flex mt-4 gap-2">
          <input
  className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-sm"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  placeholder="Type your message..."
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }}
/>

          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-purple-600 px-4 py-2 rounded text-sm font-semibold hover:bg-purple-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
