import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/services/whatsapp";

// GET: Used by Meta to verify your webhook
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.VERIFY_TOKEN
  ) {
    console.log("✅ Webhook verified");

    return new Response(challenge, {
      status: 200,
    });
  }

  return NextResponse.json(
    { error: "Verification failed" },
    { status: 403 }
  );
}

// POST: Receives WhatsApp messages here
export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log(JSON.stringify(body, null, 2));

  const message =
    body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) {
    return NextResponse.json({
      received: true,
    });
  }

  const phone = message.from;

  await sendMessage(
    phone,
    "👋 Welcome to Career AI!\n\nI'm your AI Career Assistant.\n\n1️⃣ Create CV\n2️⃣ Portfolio Website\n3️⃣ Improve Resume"
  );

  return NextResponse.json({
    received: true,
  });
}