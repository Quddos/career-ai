const GRAPH_API = "https://graph.facebook.com/v23.0";

export async function sendMessage(
  to: string,
  message: string
) {
  const response = await fetch(
    `${GRAPH_API}/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        messaging_product: "whatsapp",

        to,

        type: "text",

        text: {
          body: message,
        },
      }),
    }
  );

  return response.json();
}