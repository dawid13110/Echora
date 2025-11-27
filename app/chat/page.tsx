"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ChatPage() {
  const [session, setSession] = useState<any>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

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

    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    // 1) Fetch memories
    const { data: memData } = await supabase
      .from("conversation_memory")
      .select("memory")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(8);

    const memories = memData?.map((m) => m.memory) ?? [];

    // 2) Send to echo
    const response = await fetch("/api/echo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, memories }),
    });

    const result = await response.json();
    const reply = result.reply || "ECHORA could not respond.";

    setMessages((m) => [...m, { role: "assistant", text: reply }]);

    // 3) Extract memory
    const memResponse = await fetch("/api/memory/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const memResult = await memResponse.json();
    if (memResult?.memory) {
      await supabase.from("conversation_memory").insert({
        user_id: session.user.id,
        memory: memResult.memory,
      });
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-zinc-900 p-4 rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-4 text-purple-300">ECHORA Chat</h1>

        <div className="h-[450px] overflow-y-auto space-y-3 border border-zinc-700 p-3 rounded">
          {messages.map((m, i) => (
            <div key={i}>
              <p className={m.role === "user" ? "text-purple-300" : "text-green-300"}>
                <strong>{m.role === "user" ? "You" : "ECHORA"}:</strong> {m.text}
              </p>
            </div>
          ))}
          {loading && <p className="text-sm text-gray-400">ECHORA is thinking…</p>}
        </div>

        <div className="flex mt-4 gap-2">
          <input
            className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
