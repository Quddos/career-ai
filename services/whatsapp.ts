const GRAPH_API = "https://graph.facebook.com/v25.0";

export async function sendMessage(
  to: string,
  message: string
) {
  try {
    console.log("Sending WhatsApp message...");
    console.log("To:", to);

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

    const data = await response.json();

    console.log("WhatsApp API Status:", response.status);
    console.log("WhatsApp API Response:");
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("sendMessage Error:");
    console.error(error);
    throw error;
  }
}