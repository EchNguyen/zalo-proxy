import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("📡 HTTP method:", req.method);

  // ✅ Xử lý CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey");
    return res.status(200).end();
  }

  // ✅ Chỉ cho phép POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userInfo, messageToken, data } = req.body;

    // 🔍 Log dữ liệu nhận được
    console.log("📦 userInfo:", JSON.stringify(userInfo, null, 2));
    console.log("🔑 messageToken:", messageToken);
    console.log("🧾 data:", JSON.stringify(data, null, 2));

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
      console.error("❌ Supabase error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const result = await response.json();
    console.log("✅ Supabase response:", JSON.stringify(result, null, 2));
   // ✅ Set headers cho phản hồi POST
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey");
    res.setHeader("Content-Type", "application/json");

    res.status(200).json(result);
  } catch (err) {
    console.error("🔥 Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
}
