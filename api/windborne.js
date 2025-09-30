// /api/windborne.js  — Node (CommonJS) handler for Vercel
const handler = async (req, res) => {
  const hour = (req.query && req.query.h) ? String(req.query.h).padStart(2, '0') : '00';
  const url = `https://a.windbornesystems.com/treasure/${hour}.json`;

  try {
    const r = await fetch(url);
    if (!r.ok) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(r.status).json({ error: `Upstream HTTP ${r.status}` });
    }
    const data = await r.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: e.message || 'fetch failed' });
  }
};

module.exports = handler;
