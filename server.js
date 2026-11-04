const express = require('express');
const path = require('path');
const { Readable } = require('stream');

const app = express();
const PORT = process.env.PORT || 3000;

const UPSTREAM = (process.env.MUSIC_UPSTREAM || 'https://saavn.dev').replace(/\/$/, '');

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Service-Worker-Allowed', '/');
    }
  }
}));

app.get('/api/music', async (req, res) => {
  try {
    const { p, ...params } = req.query;
    if (!p) return res.status(400).json({ success: false, message: 'Missing p parameter' });
    const url = UPSTREAM + p + (Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '');
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'ANKY-MUSIC-HUB/1.0',
        'Accept': 'application/json'
      }
    });
    const contentType = r.headers.get('content-type') || 'application/json';
    res.status(r.status).set('Content-Type', contentType).send(await r.text());
  } catch (e) {
    console.error('[music proxy]', e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/dl', async (req, res) => {
  try {
    const u = req.query.u;
    if (!u) return res.status(400).send('Missing url');
    const r = await fetch(u, { headers: { 'User-Agent': 'ANKY-MUSIC-HUB/1.0' } });
    if (!r.ok) return res.status(r.status).end();
    res.setHeader('Content-Type', r.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (r.headers.get('content-length')) res.setHeader('Content-Length', r.headers.get('content-length'));
    Readable.fromWeb(r.body).pipe(res);
  } catch (e) {
    res.status(500).send('Download failed');
  }
});

app.get('/healthz', (req, res) => res.send('ok'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ANKY MUSIC HUB running on port ${PORT}`);
});