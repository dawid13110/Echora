// app/api/echo-settings/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type EchoSettingsRow = {
  user_id: string;
  tone_style: string | null;
  base_prompt: string | null;
  safety_rules: string | null;
  auto_reply_default: boolean | null;
};

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Echo settings GET session error:", sessionError);
      return NextResponse.json(
        { error: "Failed to get session" },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("echo_settings")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle<EchoSettingsRow>();

    if (error) {
      // PGRST116 = "Results contain 0 rows" when using single()
      if ((error as any).code !== "PGRST116") {
        console.error("Echo settings GET error:", error);
        return NextResponse.json(
          { error: "Failed to load echo settings" },
          { status: 500 }
        );
      }
    }

    // If no row yet, return null – the dashboard already handles this state
    return NextResponse.json({ data: data ?? null });
  } catch (err) {
    console.error("Echo settings GET unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error loading echo settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tone_style,
      base_prompt,
      safety_rules,
      auto_reply_default,
    } = body;

    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Echo settings POST session error:", sessionError);
      return NextResponse.json(
        { error: "Failed to get session" },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload: EchoSettingsRow = {
      user_id: session.user.id,
      tone_style: tone_style ?? null,
      base_prompt: base_prompt ?? null,
      safety_rules: safety_rules ?? null,
      auto_reply_default:
        typeof auto_reply_default === "boolean"
          ? auto_reply_default
          : null,
    };

    const { data, error } = await supabase
      .from("echo_settings")
      .upsert(payload, { onConflict: "user_id" })
      .select("*")
      .maybeSingle<EchoSettingsRow>();

    if (error) {
      console.error("Echo settings POST error:", error);
      return NextResponse.json(
        { error: "Failed to save echo settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Echo settings POST unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error saving echo settings" },
      { status: 500 }
    );
  }
}
