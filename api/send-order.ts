// zalo-proxy/api/send-order.ts
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userInfo, messageToken, data } = req.body;

    const response = await fetch("https://your-supabase-url/functions/v1/send-order-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY!}`,
      },
      body: JSON.stringify({ userInfo, messageToken, data }),
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
}
