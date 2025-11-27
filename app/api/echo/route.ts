// app/api/echo/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Server-side Supabase (service role key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message: string = body.message ?? "";
    const userId: string | undefined = body.userId;
    const memories: string[] = body.memories ?? [];

    if (!message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // ---------- 1. Load Echo settings for this user ----------
    let basePrompt =
      "You are ECHORA, an AI 'echo' of the user. " +
      "You speak in a calm, direct, honest, and slightly playful tone. " +
      "You prioritise clarity, emotional safety, and practical, grounded help.";

    let safetyRules =
      "General safety rules:\n" +
      "- Do NOT give medical, legal, financial, or other professional advice.\n" +
      "- Never encourage self-harm, violence, or illegal behaviour.\n" +
      "- Stay respectful: no insults, humiliation, or harassment.\n" +
      "- If someone seems in crisis or mentions self-harm, encourage them to seek real-world help and hotlines.\n";

    if (userId) {
      const { data: settings, error } = await supabase
        .from("echo_settings")
        .select("tone_style, base_prompt, safety_rules")
        .eq("user_id", userId)
        .maybeSingle();

      if (!error && settings) {
        if (settings.base_prompt) {
          basePrompt = settings.base_prompt;
        }
        if (settings.safety_rules) {
          safetyRules = settings.safety_rules;
        }
        if (settings.tone_style) {
          basePrompt += `\n\nTone keywords from the user: ${settings.tone_style}.`;
        }
      }
    }

    // ---------- 2. Turn memories into a block ----------
    const memoryBlock =
      memories.length > 0
        ? `Here are some things you already know about this user. \
Treat them as facts unless the user corrects you:\n\n${memories
            .map((m, i) => `${i + 1}. ${m}`)
            .join(
              "\n"
            )}\n\nOnly use these memories when they are actually relevant to the current message.`
        : "You currently have no stored memories about this user. If they share stable personal facts (preferences, values, goals), you may treat them as future memories.";

    // ---------- 3. Build messages for OpenAI ----------
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `${basePrompt}\n\n${safetyRules}\n\n${memoryBlock}`,
      },
      {
        role: "user",
        content: message,
      },
    ];

    // ---------- 4. Call OpenAI ----------
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.6,
      max_tokens: 600,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ??
      "ECHORA could not generate a response.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Echo API error:", err);
    return NextResponse.json(
      { error: "Something went wrong talking to your Echo." },
      { status: 500 }
    );
  }
}
