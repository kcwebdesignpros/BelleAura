/**
 * BelleAura — Static preview server
 * =================================
 * Serves ./dist the way Cloudflare Pages does, so you can verify a static
 * build locally before deploying.
 *
 *   /                -> dist/index.html
 *   /about           -> dist/about/index.html
 *   /about/          -> dist/about/index.html
 *   /css/style.css   -> dist/css/style.css
 *   anything missing -> dist/404.html   (HTTP 404)
 *
 * Usage:  npm run preview      (defaults to port 4173)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function send(res, status, body, type) {
  res.writeHead(status, {
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return send(res, 400, 'Bad request');
  }

  // Block path traversal
  const safe = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const target = path.join(DIST, safe);

  if (!target.startsWith(DIST)) {
    return send(res, 403, 'Forbidden');
  }

  const candidates = [];
  if (pathname.endsWith('/')) {
    candidates.push(path.join(target, 'index.html'));
  } else {
    candidates.push(target);
    candidates.push(path.join(target, 'index.html')); // clean URL
  }

  for (const file of candidates) {
    let stat;
    try {
      stat = fs.statSync(file);
    } catch {
      continue;
    }
    if (stat.isFile()) {
      const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
      return send(res, 200, fs.readFileSync(file), type);
    }
  }

  // Cloudflare Pages fallback
  const notFound = path.join(DIST, '404.html');
  if (fs.existsSync(notFound)) {
    return send(res, 404, fs.readFileSync(notFound), MIME['.html']);
  }
  send(res, 404, 'Not found');
});

server.listen(PORT, () => {
  console.log(`\n  Static preview (Cloudflare Pages style)`);
  console.log(`  Serving dist/ at http://localhost:${PORT}\n`);
});
