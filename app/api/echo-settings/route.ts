// app/api/echo-settings/route.ts
import { NextResponse } from "next/server";

/**
 * This route is no longer used.
 * Dashboard now loads echo_settings directly from Supabase on the client.
 */
export async function GET() {
  return NextResponse.json(
    { error: "echo_settings API route not used" },
    { status: 404 }
  );
}
