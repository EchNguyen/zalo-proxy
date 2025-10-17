// zalo-proxy/api/send-order.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userInfo, messageToken, data } = req.body;

    // 🔍 Log dữ liệu nhận được
    console.log("📦 userInfo:", userInfo);
    console.log("🔑 messageToken:", messageToken);
    console.log("🧾 data:", data);

    const response = await fetch("https://jyvgikwgrzhjrwqljkns.supabase.co/functions/v1/send-order-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY!}`,
      },
      body: JSON.stringify({ userInfo, messageToken, data }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const result = await response.json();
    res.status(200).json(result);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
}
