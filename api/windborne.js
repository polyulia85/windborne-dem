export default async function handler(req, res) {
  const hour = req.query.h || '00';
  const url = `https://a.windbornesystems.com/treasure/${hour}.json`;

  try {
    const r = await fetch(url);
    if (!r.ok) {
      return res.status(r.status).json({ error: "Upstream error" });
    }
    const data = await r.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
