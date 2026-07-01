import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasToken: !!process.env.WHATSAPP_TOKEN,
    tokenLength: process.env.WHATSAPP_TOKEN?.length ?? 0,
    hasPhoneId: !!process.env.PHONE_NUMBER_ID,
    phoneId: process.env.PHONE_NUMBER_ID,
  });
}