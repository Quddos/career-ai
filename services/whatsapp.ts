const GRAPH_API = "https://graph.facebook.com/v25.0";

export async function sendMessage(
  to: string,
  message: string
) {
  const url = `${GRAPH_API}/${process.env.PHONE_NUMBER_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: {
      body: message,
    },
  };

  console.log("===== WHATSAPP REQUEST =====");
  console.log(url);
  console.log(JSON.stringify(body, null, 2));

  const response = await fetch(url, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify(body),
  });

  const json = await response.json();

  console.log("===== WHATSAPP RESPONSE =====");
  console.log(JSON.stringify(json, null, 2));

  return json;
}