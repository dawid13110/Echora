// app/api/echo/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY in environment");
      return NextResponse.json(
        { error: "Server is missing OpenAI API key." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const message: string = body.message;
    const memories: string[] = Array.isArray(body.memories) ? body.memories : [];

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const memoryText =
      memories.length > 0
        ? memories.map((m, i) => `${i + 1}. ${m}`).join("\n")
        : "None yet.";

    const systemPrompt = `
You are ECHORA, a calm, direct, kind AI that echoes the user's style.

You are talking to the owner of this Echo.
You can see some past "memories" about them below.
Use memories only when clearly helpful and NEVER invent new ones.

Memories:
${memoryText}
`.trim();

    const completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

// Safely read the text from the Responses API
const firstOutput = completion.output[0];

let reply = "ECHORA couldn’t generate a response this time.";

// Narrow the union: only "message" items have `content`
if (firstOutput && firstOutput.type === "message") {
  const firstPart = firstOutput.content[0];

  if (firstPart && firstPart.type === "output_text" && firstPart.text) {
    reply = firstPart.text;
  }
}

return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Echo API error:", error);
    return NextResponse.json(
      { error: "ECHORA had a problem generating a reply." },
      { status: 500 }
    );
  }
}
