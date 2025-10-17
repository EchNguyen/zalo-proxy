import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userInfo, messageToken, data } = req.body;

    const response = await fetch('https://jyvgikwgrzhjrwqljkns.supabase.co/functions/v1/send-order-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY!}`,
      },
      body: JSON.stringify({ userInfo, messageToken, data }),
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy failed' });
  }
}