export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { sendMessage } from "@/services/whatsapp";

export async function GET() {
  try {
    const result = await sendMessage(
      "919032782704",
      "🎉 Career AI test message!"
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
      }
    );
  }
}