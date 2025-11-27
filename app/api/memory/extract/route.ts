import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lastUserMessage: string | undefined = body?.lastUserMessage;

    if (!lastUserMessage || typeof lastUserMessage !== "string") {
      return NextResponse.json(
        { error: "lastUserMessage is required" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You are a memory extraction module for an AI assistant.
Your job is to decide if the user's latest message should be stored as a SHORT, STABLE memory.
Store things like: goals, long-term struggles, stable preferences, important people, important constraints.
Do NOT store temporary moods, random jokes, or highly sensitive details (health, trauma, crimes, explicit content).

Respond ONLY in valid JSON, with this shape:
{
  "shouldWrite": true or false,
  "memory": "null or short memory string"
}
If you set "shouldWrite" to false, set "memory" to null.
Keep memory under 120 characters if you write one.
`,
        },
        {
          role: "user",
          content: lastUserMessage,
        },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";

    let parsed: { shouldWrite: boolean; memory: string | null } = {
      shouldWrite: false,
      memory: null,
    };

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse memory JSON:", raw, err);
      return NextResponse.json(
        { shouldWrite: false, memory: null },
        { status: 200 }
      );
    }

    if (typeof parsed.shouldWrite !== "boolean") {
      parsed.shouldWrite = false;
      parsed.memory = null;
    }

    if (parsed.shouldWrite && typeof parsed.memory !== "string") {
      parsed.shouldWrite = false;
      parsed.memory = null;
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (err) {
    console.error("Memory extractor error:", err);
    return NextResponse.json(
      { error: "Memory extractor failed" },
      { status: 500 }
    );
  }
}
