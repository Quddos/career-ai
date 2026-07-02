const GRAPH_API = "https://graph.facebook.com/v25.0";

export async function sendMessage(
  to: string,
  message: string
) {
  const url = `${GRAPH_API}/${process.env.PHONE_NUMBER_ID}/messages`;

  // normalize recipient: remove non-digit characters (strip +, spaces, dashes)
  const normalizedTo = String(to).replace(/\D/g, "");

  const body = {
    messaging_product: "whatsapp",
    to: normalizedTo,
    type: "text",
    text: {
      body: message,
    },
  };

  // Minimal token redaction for logs
  const tokenPreview = process.env.WHATSAPP_TOKEN
    ? `${process.env.WHATSAPP_TOKEN.slice(0, 8)}...${process.env.WHATSAPP_TOKEN.slice(-8)}`
    : "(no-token)";

  console.log("===== WHATSAPP REQUEST =====");
  console.log("URL:", url);
  console.log("To:", normalizedTo);
  console.log("TokenPreview:", tokenPreview);
  console.log("Body:", JSON.stringify(body, null, 2));

  let response;
  try {
    response = await fetch(url, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Network error when calling WhatsApp API:", err);
    throw err;
  }

  const status = response.status;
  const statusText = response.statusText;

  let text;
  try {
    text = await response.text();
  } catch (err) {
    console.error("Failed to read response text:", err);
    text = undefined;
  }

  let json;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch (err) {
    console.warn("Response is not valid JSON, returning raw text");
    json = { raw: text };
  }

  console.log("===== WHATSAPP RESPONSE =====");
  console.log("Status:", status, statusText);
  console.log("Body:", JSON.stringify(json, null, 2));

  // If the response indicates an auth error, throw so caller logs it clearly
  if (status === 401 || status === 403 || (json && json.error)) {
    console.error("WhatsApp API returned an error", { status, json });
  }

  return json;
}