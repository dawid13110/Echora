import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message: string | undefined = body?.message;
    const memories: string[] = Array.isArray(body?.memories)
      ? body.memories
      : [];

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing in .env.local");
      return NextResponse.json(
        { error: "Server is not configured with an OpenAI API key." },
        { status: 500 }
      );
    }

    const memoryContext =
      memories.length > 0
        ? `Here are some important facts the user previously shared. Use them only if relevant to the current question:\n- ${memories.join(
            "\n- "
          )}`
        : "No prior memory is available for this user yet.";

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are ECHORA, an AI that gives calm, direct, grounded, compassionate and honest guidance.
You help users gain clarity, see truth more clearly, and make wiser decisions.

You respond in a hybrid style:
- mostly conversational and human,
- but when helpful, you add structure (bullets / steps) for clarity.

Respect this context about the user if it's relevant to the current question:
${memoryContext}
          `.trim(),
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ??
      "Sorry, I couldn't generate a reply.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("OpenAI error in /api/echo:", err);

    // Quota / credits error
    if (err?.status === 429) {
      return NextResponse.json(
        {
          error:
            "ECHORA hit the OpenAI quota limit. Top up API credits or update your key.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Unexpected server error talking to ECHORA." },
      { status: 500 }
    );
  }
}
