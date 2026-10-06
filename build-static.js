/**
 * BelleAura — Static Site Generator
 * =================================
 * Pre-renders every Express route to plain HTML so the site can be hosted on
 * any static host (Cloudflare Pages, Netlify, GitHub Pages, S3, ...).
 *
 * Output: ./dist
 *   dist/index.html
 *   dist/about/index.html
 *   dist/services/hair-styling/index.html
 *   dist/404.html
 *   dist/sitemap.xml, dist/robots.txt
 *   dist/css|js|images|fonts/...   (copied from public/)
 *
 * Usage:  npm run build
 */

// Prevent app.js from opening its own listener when it is required.
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.VERCEL = process.env.VERCEL || '1';

const http = require('http');
const fsp = require('fs/promises');
const path = require('path');

const app = require('./app');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const PUBLIC_DIR = path.join(ROOT, 'public');

// ---------------------------------------------------------------
// Routes to pre-render
// ---------------------------------------------------------------
const services = (app.locals && app.locals.services) || [];

const PAGE_ROUTES = [
  '/',
  '/about',
  '/services',
  '/gallery',
  '/reviews',
  '/contact',
  '/team',
  '/pricing',
  '/faq',
  '/blog',
  '/book',
  '/privacy-policy',
  '/terms',
  ...services.map((s) => `/services/${s.slug}`)
];

const SEO_FILES = ['/sitemap.xml', '/robots.txt'];

// A path that intentionally does not exist, to capture the 404 view.
const NOT_FOUND_PROBE = '/__belleaura_404_probe__';

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
function routeToFile(route) {
  if (route === '/') return path.join(DIST, 'index.html');
  return path.join(DIST, route.replace(/^\//, ''), 'index.html');
}

function fetchFrom(port, urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port, path: urlPath }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error(`Timed out fetching ${urlPath}`)));
  });
}

async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  const entries = await fsp.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(from, to);
    } else {
      await fsp.copyFile(from, to);
    }
  }
}

function humanSize(bytes) {
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

async function dirSize(dir) {
  let total = 0;
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    total += e.isDirectory() ? await dirSize(p) : (await fsp.stat(p)).size;
  }
  return total;
}

// ---------------------------------------------------------------
// Build
// ---------------------------------------------------------------
async function main() {
  const siteUrl = (app.locals.site && app.locals.site.url) || '';
  const usingEnvUrl = Boolean(process.env.SITE_URL);

  console.log('\n  BelleAura — building static site');
  console.log('  ' + '-'.repeat(46));
  console.log(`  SITE_URL : ${siteUrl}${usingEnvUrl ? '' : '  (default — set SITE_URL for production!)'}`);

  if (!usingEnvUrl) {
    console.log('  ! WARNING: SITE_URL is not set. Canonical tags, sitemap.xml and');
    console.log('    robots.txt will point at the fallback domain. Set SITE_URL to');
    console.log('    your live domain (e.g. https://belleaura.pages.dev) before deploying.');
  }

  // 1. clean + copy static assets
  await fsp.rm(DIST, { recursive: true, force: true });
  await fsp.mkdir(DIST, { recursive: true });
  await copyDir(PUBLIC_DIR, DIST);
  console.log('\n  static assets copied  public/ -> dist/');

  // 2. serve the app on an ephemeral port
  const server = http.createServer(app);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const port = server.address().port;

  let rendered = 0;
  let failed = 0;

  try {
    // 3. pre-render pages
    console.log('\n  pages');
    for (const route of PAGE_ROUTES) {
      const { status, body } = await fetchFrom(port, route);
      if (status !== 200) {
        console.error(`    ${status}  ${route}`);
        failed++;
        continue;
      }
      const file = routeToFile(route);
      await fsp.mkdir(path.dirname(file), { recursive: true });
      await fsp.writeFile(file, body);
      rendered++;
      console.log(`    200  ${route.padEnd(34)} -> ${path.relative(ROOT, file)}`);
    }

    // 4. SEO files (generated from SITE_URL by the Express routes)
    console.log('\n  seo files');
    for (const file of SEO_FILES) {
      const { status, body } = await fetchFrom(port, file);
      if (status !== 200) {
        console.error(`    ${status}  ${file}`);
        failed++;
        continue;
      }
      await fsp.writeFile(path.join(DIST, file.replace(/^\//, '')), body);
      rendered++;
      console.log(`    200  ${file}`);
    }

    // 5. 404 page
    const notFound = await fetchFrom(port, NOT_FOUND_PROBE);
    await fsp.writeFile(path.join(DIST, '404.html'), notFound.body);
    console.log(`\n  ${notFound.status}  /404.html  (from ${NOT_FOUND_PROBE})`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }

  const size = await dirSize(DIST);
  console.log('\n  ' + '-'.repeat(46));
  console.log(`  ${rendered} files rendered, ${failed} failed`);
  console.log(`  output: dist/  (${humanSize(size)})`);
  console.log('  ' + '-'.repeat(46) + '\n');

  if (failed > 0) {
    console.error('  Build FAILED — some routes did not render.\n');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n  Build error:', err.message, '\n');
  process.exit(1);
});
