# BelleAura Beauty Salon - Kansas City

A premium, SEO-optimized, page-speed-optimized Node.js web application for a beauty salon in Kansas City. Built with Express.js and EJS templates, deployable to Vercel with zero database requirements.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Quick Start](#quick-start)
6. [Local Development](#local-development)
7. [Deploy to Vercel](#deploy-to-vercel)
8. [Deploy to Cloudflare Pages](#deploy-to-cloudflare-pages)
9. [SEO Features](#seo-features)
10. [Page Speed Optimization](#page-speed-optimization)
11. [Pages Included](#pages-included)
12. [Services](#services)
13. [Customization Guide](#customization-guide)
14. [Environment Variables](#environment-variables)
15. [Troubleshooting](#troubleshooting)

---

## Overview

BelleAura is a full-featured beauty salon website targeting Kansas City, MO. It includes all necessary pages for a complete web presence, 6 detailed service pages, SEO optimization, and is ready to deploy to **Vercel** (serverless SSR) or **Cloudflare Pages** (pre-rendered static).

- **Location targeted:** Kansas City, Missouri
- **No database required** - all content is stored in JSON/JS data structures
- **Vercel-ready** - configured for serverless deployment
- **Premium design** - elegant, professional UI with smooth animations

---

## Features

### Core Features
- Responsive, mobile-first design
- Premium typography (Cormorant Garamond + Inter fonts)
- Smooth scroll animations
- Interactive FAQ accordion
- Gallery with category filtering
- Contact and booking forms (front-end validated)
- Mobile navigation menu
- Stats counter animations

### SEO Features
- Unique meta titles & descriptions for every page
- Open Graph tags for social sharing
- Twitter Card support
- Local Business Schema (JSON-LD structured data)
- Canonical URLs
- Dynamic `sitemap.xml` generation
- Dynamic `robots.txt`
- Semantic HTML5 markup
- Breadcrumb-friendly URL structure
- Kansas City local SEO targeting

### Performance Features
- Gzip compression (Express middleware)
- Static asset caching (1 year for images/CSS/JS)
- Lazy-loaded images (`loading="lazy"`)
- Font preconnect hints
- Minimal external dependencies
- No render-blocking JavaScript (deferred)
- CSS optimized for critical rendering
- Helmet security headers

### Security Features
- Helmet middleware for security headers
- Content Security Policy ready
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy configured

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js 4.x |
| Template Engine | EJS 3.x |
| Layout System | express-ejs-layouts |
| Security | Helmet |
| Compression | compression |
| Sitemap | sitemap (npm) |
| Deployment | Vercel (Serverless) |

---

## Project Structure

```
belleaura/
├── app.js                      # Main Express application (routes + data)
├── build-static.js             # Static site generator -> dist/  (Cloudflare build)
├── preview-static.js           # Local preview server for dist/
├── package.json                # Dependencies and scripts
├── vercel.json                 # Vercel deployment config
├── .nvmrc                      # Node version pin (20)
├── .env.example                # Environment variable template
├── .gitignore                  # Git ignore rules
├── process_images.py           # Resizes AI-generated images into public/images
├── generate_images.py          # Flat placeholder generator (opt-in, guarded)
├── README.md                   # This file
│
├── views/                      # EJS templates
│   ├── layout.ejs              # Master layout
│   ├── index.ejs               # Home page
│   ├── about.ejs               # About page
│   ├── services.ejs            # Services overview
│   ├── gallery.ejs             # Gallery page
│   ├── reviews.ejs             # Reviews page
│   ├── contact.ejs             # Contact page
│   ├── team.ejs                # Team page
│   ├── pricing.ejs             # Pricing page
│   ├── faq.ejs                 # FAQ page
│   ├── blog.ejs                # Blog listing
│   ├── book.ejs                # Booking page
│   ├── privacy.ejs             # Privacy policy
│   ├── terms.ejs               # Terms of service
│   ├── 404.ejs                 # 404 error page
│   ├── partials/               # Reusable components
│   │   ├── head.ejs            # <head> with SEO meta
│   │   ├── header.ejs          # Navigation header
│   │   ├── footer.ejs          # Footer with CTA
│   │   └── scripts.ejs         # JavaScript includes
│   └── services/               # Individual service pages
│       ├── hair-styling.ejs
│       ├── facials.ejs
│       ├── nail-care.ejs
│       ├── makeup.ejs
│       ├── spa-treatments.ejs
│       └── bridal-packages.ejs
│
├── public/                     # Static assets (copied to dist/ at build)
│   ├── css/
│   │   └── style.css           # All styles (single file)
│   ├── js/
│   │   └── main.js             # All JavaScript (single file)
│   ├── images/                 # Photos + brand assets (logo, favicons)
│   ├── fonts/                  # Self-hosted fonts (if any)
│   ├── _headers                # Cloudflare Pages headers
│   └── manifest.json           # PWA manifest
│
├── dist/                       # Build output (generated, git-ignored)
└── data/                       # (Reserved for future JSON data)
```

> `sitemap.xml` and `robots.txt` are **not** stored in `public/`. They are generated
> at request/build time from the `SITE_URL` environment variable, so the URLs are
> always correct for whichever host you deploy to.

---

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Install & Run

```bash
# 1. Clone or download the project
cd belleaura

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# Visit: http://localhost:3000
```

---

## Local Development

### Start the dev server (with auto-reload)
```bash
npm run dev
```
This uses `nodemon` to auto-restart the server on file changes.

### Start the production server
```bash
npm start
```

### Regenerate placeholder images
If you want to regenerate the placeholder images (e.g., after changing colors):
```bash
python generate_images.py
```
Requires: `pip install Pillow`

---

## Deploy to Vercel

This project is fully configured for Vercel deployment. No database or external services are needed.

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI globally:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy from project root:**
```bash
cd belleaura
vercel
```

4. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `belleaura-salon` (or your choice)
   - Framework preset: `Other`
   - Root directory: `./` (press Enter)
   - Override settings: `N`

5. **Deploy to production:**
```bash
vercel --prod
```

6. **Your site is live!** Vercel will give you a URL like:
   `https://belleaura-salon.vercel.app`

### Method 2: GitHub Integration

1. **Push the project to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: BelleAura Beauty Salon"
git remote add origin https://github.com/yourusername/belleaura.git
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects the configuration from `vercel.json`
   - Click "Deploy"

3. **Set environment variables (optional):**
   In Vercel Dashboard > Settings > Environment Variables, add:
   ```
   SITE_URL=https://your-domain.com
   SITE_EMAIL=hello@belleaura.com
   SITE_PHONE=(816) 555-0123
   GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### Custom Domain Setup

1. In Vercel Dashboard > Settings > Domains
2. Add your custom domain (e.g., `belleaura.com`)
3. Update DNS records as instructed by Vercel
4. Set the `SITE_URL` environment variable to your domain (e.g. `https://belleaura.com`)

> `SITE_URL` drives the canonical tags, `sitemap.xml` and `robots.txt`. You no longer need to edit those files by hand — they are generated from this value.

---

## Deploy to Cloudflare Pages

Cloudflare Pages serves **static files**, but this project renders pages on the server with Express + EJS. To bridge that, the project ships a **static site generator** (`build-static.js`) that pre-renders every route to plain HTML at build time.

You do **not** need to change any code — Cloudflare just needs the right build settings.

### Build settings (Cloudflare Pages dashboard)

When you create the Pages project and connect the GitHub repo, enter:

| Setting | Value |
|---|---|
| Framework preset | **None** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `20` (already pinned via `.nvmrc`) |

> ⚠️ If you leave the build command empty, Cloudflare will look for an existing static folder and fail with *"Could not detect a directory containing static files"*. The `npm run build` command is what creates `dist/`.

### Required environment variable

Add this under **Settings → Environment variables** (Production *and* Preview):

| Name | Value |
|---|---|
| `SITE_URL` | `https://<your-project>.pages.dev` (or your custom domain) |

`SITE_URL` sets the absolute URLs used in canonical tags, Open Graph tags, `sitemap.xml` and `robots.txt`. Without it, those will point at the fallback domain.

### Method 1: Git integration (recommended)

1. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**
2. Select `kcwebdesignpros/BelleAura`
3. Set the build command to `npm run build` and the output directory to `dist`
4. Add the `SITE_URL` environment variable
5. Click **Save and Deploy**

Every push to `main` triggers a new build and deploy.

### Method 2: Wrangler CLI

```bash
# Install the CLI
npm install -g wrangler

# Build the static output
SITE_URL="https://belleaura.pages.dev" npm run build

# Deploy the dist/ folder
wrangler pages deploy dist --project-name=belleaura
```

### Verify the static build locally

```bash
npm run build     # pre-renders every page into dist/
npm run preview   # serves dist/ at http://localhost:4173
```

`npm run preview` mimics Cloudflare Pages routing — clean URLs (`/about` → `about/index.html`) and a `404.html` fallback — so you can confirm the build before deploying.

### What gets generated

```
dist/
├── index.html                    # /
├── about/index.html              # /about
├── services/index.html           # /services
├── services/hair-styling/index.html   # /services/hair-styling  (+ 5 more)
├── gallery|reviews|contact|team|pricing|faq|blog|book/index.html
├── privacy-policy/index.html
├── terms/index.html
├── 404.html                      # not-found fallback
├── sitemap.xml                   # generated from SITE_URL
├── robots.txt                    # generated from SITE_URL
├── _headers                      # Cloudflare security + cache headers
└── css/ js/ images/ fonts/ manifest.json   (copied from public/)
```

### Custom domain on Cloudflare

1. **Workers & Pages → your project → Custom domains → Set up a domain**
2. Add e.g. `belleaura.com` and follow the DNS instructions
3. Update the `SITE_URL` environment variable to the custom domain
4. Redeploy so canonical tags and the sitemap pick up the new URL

### Notes

- The Express server (`npm start`) is still used for local development. Cloudflare only runs `npm run build`.
- `dist/` is git-ignored — it is a build artifact, not source.
- Form submissions (`/contact`, `/book`) are client-side only in this build (no backend). To collect them on Cloudflare, wire the forms to a Pages Function or a third-party form service.

---

## SEO Features

### What's Included

1. **Meta Tags**: Unique title, description, keywords for every page
2. **Open Graph**: Social sharing optimization for Facebook, LinkedIn
3. **Twitter Cards**: Optimized for Twitter/X sharing
4. **Schema.org**: BeautySalon structured data (JSON-LD)
5. **Canonical URLs**: Prevent duplicate content issues
6. **Sitemap.xml**: Auto-generated with all pages and service details
7. **Robots.txt**: Search engine crawling instructions
8. **Semantic HTML**: Proper heading hierarchy, ARIA labels
9. **Local SEO**: Kansas City targeted throughout content
10. **Mobile-Friendly**: Responsive design passes mobile-first indexing

### Adding Google Analytics

1. Get your GA4 Measurement ID from Google Analytics
2. Add to `.env`:
   ```
   GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. Or pass it in your render call:
   ```js
   res.render('index', { gaId: 'G-XXXXXXXXXX', ... })
   ```

### Adding Google Search Console

1. Verify your domain in Google Search Console
2. Add the verification code to `.env`:
   ```
   GOOGLE_SITE_VERIFICATION=your-code
   ```

### Submitting Sitemap

After deployment, submit your sitemap:
1. Google Search Console > Sitemaps
2. Enter: `https://your-domain.com/sitemap.xml`
3. Submit

---

## Page Speed Optimization

### What's Optimized

1. **Gzip Compression**: All responses compressed via `compression` middleware
2. **Static Asset Caching**: 1-year cache for images, CSS, JS with immutable headers
3. **Lazy Loading**: All images use `loading="lazy"` for deferred loading
4. **Font Optimization**: Google Fonts with `preconnect` hints and `display=swap`
5. **Minimal JavaScript**: Single deferred JS file, no render-blocking scripts
6. **Single CSS File**: All styles in one optimized file
7. **No External Libraries**: No jQuery, Bootstrap, or other heavy frameworks
8. **Server-Side Rendering**: EJS templates render HTML on the server
9. **Security Headers**: Helmet adds CSP-ready headers without overhead

### Lighthouse Score Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

---

## Pages Included

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, services, about, stats, gallery, reviews |
| About | `/about` | Story, values, team, stats |
| Services | `/services` | All 6 services with details |
| Hair Styling | `/services/hair-styling` | Detailed service page |
| Facials | `/services/facials` | Detailed service page |
| Nail Care | `/services/nail-care` | Detailed service page |
| Makeup | `/services/makeup` | Detailed service page |
| Spa Treatments | `/services/spa-treatments` | Detailed service page |
| Bridal Packages | `/services/bridal-packages` | Detailed service page |
| Gallery | `/gallery` | Filterable image portfolio |
| Reviews | `/reviews` | Client testimonials with ratings |
| Team | `/team` | Meet the beauty experts |
| Pricing | `/pricing` | Transparent service pricing |
| FAQ | `/faq` | 10 common questions with accordion |
| Blog | `/blog` | Beauty tips and articles |
| Contact | `/contact` | Contact form, map, details |
| Book | `/book` | Online appointment booking form |
| Privacy Policy | `/privacy-policy` | Legal compliance |
| Terms of Service | `/terms` | Legal compliance |
| 404 Error | (any invalid URL) | Custom error page |

**Total: 20 pages including 6 service pages**

---

## Services

1. **Hair Styling** - Cuts, color, blowouts, extensions, treatments
2. **Facials** - Deep cleansing, anti-aging, hydrating, acne treatment
3. **Nail Care** - Manicures, pedicures, gel, nail art, extensions
4. **Makeup** - Everyday, evening, bridal, photoshoot, lessons
5. **Spa Treatments** - Massage, body wraps, aromatherapy, wellness
6. **Bridal Packages** - Trials, day-of, bridal party, destination

Each service has its own dedicated page with:
- Full description
- Feature list
- Pricing
- Duration
- Process steps
- Why choose us section
- Related services

---

## Customization Guide

### Update Business Information

Edit `app.js` > `SITE_CONFIG`:
```js
const SITE_CONFIG = {
  name: 'Your Salon Name',
  tagline: 'Your Tagline',
  url: 'https://your-domain.com',
  email: 'contact@yoursalon.com',
  phone: '(XXX) XXX-XXXX',
  address: 'Your Address, City, ST ZIP',
  hours: 'Your Business Hours',
  social: {
    instagram: 'https://instagram.com/youraccount',
    facebook: 'https://facebook.com/youraccount',
    pinterest: 'https://pinterest.com/youraccount'
  },
  ogImage: '/images/og-image.jpg'
};
```

### Update Services

Edit `app.js` > `services` array. Each service object:
```js
{
  slug: 'service-slug',           // URL: /services/service-slug
  name: 'Service Name',
  icon: 'cut',                   // cut|face|nail|makeup|spa|crown
  shortDescription: 'Short text',
  fullDescription: 'Longer description...',
  image: '/images/service-name.jpg',
  features: ['Feature 1', 'Feature 2', ...],
  pricing: 'Starting at $XX',
  duration: 'XX-XX minutes'
}
```

### Update Team Members

Edit `app.js` > `team` array:
```js
{ name: 'Person Name', role: 'Job Title', specialty: 'Expertise', image: '/images/team-X.jpg' }
```

### Update Reviews

Edit `app.js` > `reviews` array:
```js
{ name: 'Client Name', location: 'City, ST', rating: 5, text: '"Review text"', service: 'Service Name' }
```

### Change Colors

Edit `public/css/style.css` > `:root` variables:
```css
:root {
  --color-primary: #d4a5a5;      /* Main brand color */
  --color-primary-dark: #b8868a;  /* Hover/dark variant */
  --color-accent: #c9a96e;       /* Accent/gold */
  --color-dark: #3d2c2e;         /* Dark text/sections */
  --color-bg: #fdf8f6;           /* Background */
}
```

### Replace Placeholder Images

1. Add your real photos to `public/images/` with matching filenames
2. Or run `python generate_images.py` to regenerate placeholders
3. Recommended sizes:
   - Service images: 800x1000px
   - Gallery images: 600x750px
   - Team photos: 400x500px
   - Blog images: 600x450px
   - OG image: 1200x630px

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | production |
| `SITE_URL` | Production URL | https://belleaura-salon.vercel.app |
| `SITE_EMAIL` | Contact email | hello@belleaura.com |
| `SITE_PHONE` | Phone number | (816) 555-0123 |
| `GA_MEASUREMENT_ID` | Google Analytics 4 ID | (none) |
| `GOOGLE_SITE_VERIFICATION` | Search Console verification | (none) |

---

## Troubleshooting

### Port already in use
```bash
# Use a different port
PORT=3001 npm start
```

### Images not showing
- Run `python generate_images.py` to generate placeholder images
- Ensure images are in `public/images/` directory
- Check image paths in `app.js` > `services` array

### EJS template error
- Ensure all npm packages are installed: `npm install`
- Check that `views/` directory structure is intact
- Verify `app.locals` assignments in `app.js`

### Vercel deployment fails
- Ensure `vercel.json` is present
- Check Node.js version: `engines: { node: ">=18.0.0" }` in `package.json`
- Verify `app.js` exports the app: `module.exports = app;`

### Sitemap not updating
- `/sitemap.xml` is generated at runtime from the `SITE_URL` environment variable
- There is no static `public/sitemap.xml` to keep in sync any more
- On a static build, `sitemap.xml` and `robots.txt` are written into `dist/` by `npm run build`
- If the URLs look wrong, `SITE_URL` is not set — set it and rebuild/redeploy

### Cloudflare: "Could not detect a directory containing static files"
- This project renders with Express, so Cloudflare needs a build step that produces static HTML
- Set **Build command** = `npm run build` and **Build output directory** = `dist`
- Do not leave the build command empty — that is what triggers this error
- See [Deploy to Cloudflare Pages](#deploy-to-cloudflare-pages)

### Contact form not submitting
- Forms use front-end validation only (no backend)
- To add email functionality, integrate a service like:
  - Formspree
  - EmailJS
  - Vercel Serverless Functions with SendGrid/Nodemailer

---

## License

MIT License - feel free to use this project for your salon business.

---

## Credits

- **Fonts**: Cormorant Garamond & Inter (Google Fonts)
- **Icons**: Custom SVG illustrations
- **Framework**: Express.js
- **Deployment**: Vercel (serverless SSR) · Cloudflare Pages (pre-rendered static)

---

*BelleAura Beauty Salon - Beauty, Care, Confidence | Kansas City, MO*