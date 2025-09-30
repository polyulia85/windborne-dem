// /api/windborne.js — Node (CommonJS) handler for Vercel

const handler = async (req, res) => {
  const hour = (req.query && req.query.h) ? String(req.query.h).padStart(2,'0') : '00';
  const url  = `https://a.windbornesystems.com/treasure/${hour}.json`;

  // всегда отключаем кеш
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) {
      return res.status(r.status).json({ error: `Upstream HTTP ${r.status}` });
    }
    const data = await r.json();

    // если апстрим пустой/битый — отдадим мок
    const asText = JSON.stringify(data || {});
    if (!asText || asText.length < 5) {
      return res.status(200).json(makeMock(hour));
    }

    return res.status(200).json(data);
  } catch (e) {
    // на любой сбой — тоже мок, но с пометкой
    return res.status(200).json(makeMock(hour, String(e && e.message || 'fetch failed')));
  }
};

function makeMock(hour, note) {
  // 3 фиктивные «шарика» вокруг SF/LA, чтобы проверить отрисовку
  const base = [
    { id: 'WB-M1', lat: 37.7749, lon: -122.4194, alt: 8000, t: Math.floor(Date.now()/1000) },
    { id: 'WB-M2', lat: 34.0522, lon: -118.2437, alt: 7500, t: Math.floor(Date.now()/1000) },
    { id: 'WB-M3', lat: 36.7783, lon: -119.4179, alt: 7000, t: Math.floor(Date.now()/1000) }
  ];
  return { mock: true, hour, note: note || null, balloons: base };
}

module.exports = handler;
