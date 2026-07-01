import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/services/whatsapp";

// Verify Webhook
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.VERIFY_TOKEN
  ) {
    console.log("Webhook Verified");

    return new Response(challenge, {
      status: 200,
    });
  }

  return new Response("Forbidden", {
    status: 403,
  });
}

// Receive WhatsApp Messages
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("========== WEBHOOK ==========");
    console.log(JSON.stringify(body, null, 2));
    console.log("=============================");

    const message =
      body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      console.log("No incoming message found.");
      return NextResponse.json({ received: true });
    }

    const phone = message.from;

    console.log("Sender:", phone);

    const result = await sendMessage(
      phone,
      "👋 Welcome To Career AI!\n\nI'm your AI Career Assistant.\n\n1️⃣ Create CV\n2️⃣ Portfolio Website\n3️⃣ Improve Resume"
    );

    console.log("Message sent result:");
    console.log(JSON.stringify(result, null, 2));

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook Error:");
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}