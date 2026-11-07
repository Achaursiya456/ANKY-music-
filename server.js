'use strict';
/* Singify server: public/ ki static files + /api/music + /api/dl. Koi npm package nahi chahiye (Node 18+). */
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const music = require('./api/music.js');
const dl = require('./api/dl.js');

const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, 'public');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8'
};
const GZ = new Map(); // path -> {m, buf}

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(PUB, rel));
  if (!file.startsWith(PUB + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    const ext = path.extname(file).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    /* app + sw + version hamesha fresh (app ka apna update system hai); icons ko cache */
    const h = { 'Content-Type': type, 'Cache-Control': ext === '.png' ? 'public, max-age=86400' : 'no-cache' };
    if (path.basename(file) === 'sw.js') h['Service-Worker-Allowed'] = '/';
    const wantGz = /\bgzip\b/.test(req.headers['accept-encoding'] || '') && /^(text\/|application\/json|image\/svg)/.test(type);
    fs.readFile(file, (e, buf) => {
      if (e) { res.writeHead(500); return res.end('Error'); }
      if (wantGz) {
        let c = GZ.get(file);
        if (!c || c.m !== st.mtimeMs) { c = { m: st.mtimeMs, buf: zlib.gzipSync(buf) }; GZ.set(file, c); }
        h['Content-Encoding'] = 'gzip'; h['Vary'] = 'Accept-Encoding'; h['Content-Length'] = c.buf.length;
        res.writeHead(200, h); return req.method === 'HEAD' ? res.end() : res.end(c.buf);
      }
      h['Content-Length'] = buf.length;
      res.writeHead(200, h); req.method === 'HEAD' ? res.end() : res.end(buf);
    });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    const p = url.pathname;
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (p === '/health') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }
    if (p === '/api/music') return await music(req, res, url);
    if (p === '/api/dl') return await dl(req, res, url);
    if (p.startsWith('/api/')) { res.writeHead(404, { 'Content-Type': 'application/json' }); return res.end('{"success":false,"message":"not found"}'); }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    serveStatic(req, res, p);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end('{"success":false,"message":"server error"}');
  }
});

server.keepAliveTimeout = 65000;
server.listen(PORT, '0.0.0.0', () => console.log('Singify running on port ' + PORT + ' | music api: ' + (process.env.MUSIC_API_URL || 'https://jio.shnwaz.dev')));
