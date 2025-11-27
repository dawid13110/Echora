import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ memory: null });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You extract ONLY long-term facts about the user.

Valid memory examples:
- Preferences (favorite color, foods, styles)
- Personality traits the user claims
- Values, goals
- Biographical details they choose to share

INVALID memory examples:
- Temporary emotions
- Temporary states ("I'm tired", "I'm hungry")
- Questions
- Context that won't matter later

Return ONLY the memory text, or "NONE" if nothing should be saved.
          `,
        },
        { role: "user", content: message },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "NONE";

    if (raw === "NONE") {
      return NextResponse.json({ memory: null });
    }

    return NextResponse.json({ memory: raw });
  } catch (err) {
    console.error("Memory extractor error:", err);
    return NextResponse.json({ memory: null });
  }
}
