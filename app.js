/**
 * BelleAura Beauty Salon - Express Application
 * Premium beauty salon website for Kansas City
 * Optimized for Vercel serverless deployment
 */

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const expressLayouts = require('express-ejs-layouts');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// CONFIGURATION
// =============================================
const SITE_CONFIG = {
  name: 'BelleAura Beauty Salon',
  tagline: 'Beauty, Care, Confidence',
  description: 'Premium beauty salon in Kansas City offering hair styling, facials, nail care, makeup, spa treatments, and bridal packages. Book your appointment today.',
  url: 'https://belleaura-salon.vercel.app',
  email: 'hello@belleaura.com',
  phone: '(816) 555-0123',
  address: '4820 JCT Country Club Road, Kansas City, MO 64112',
  hours: 'Mon-Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM',
  social: {
    instagram: 'https://instagram.com/belleaura',
    facebook: 'https://facebook.com/belleaura',
    pinterest: 'https://pinterest.com/belleaura'
  },
  ogImage: '/images/og-image.jpg'
};

// Make config available to all views
app.locals.site = SITE_CONFIG;

// =============================================
// MIDDLEWARE
// =============================================
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// =============================================
// SERVICES DATA (No Database)
// =============================================
const services = [
  {
    slug: 'hair-styling',
    name: 'Hair Styling',
    icon: 'cut',
    shortDescription: 'Cuts, color, blowouts & more',
    fullDescription: 'Transform your look with our expert hair styling services. From precision cuts to stunning color transformations, our master stylists create personalized looks that enhance your natural beauty.',
    image: '/images/service-hair.jpg',
    features: ['Precision Haircuts', 'Professional Coloring', 'Blowouts & Styling', 'Hair Treatments', 'Extensions', 'Bridal Hair'],
    pricing: 'Starting at $45',
    duration: '45-120 minutes'
  },
  {
    slug: 'facials',
    name: 'Facials',
    icon: 'face',
    shortDescription: 'Rejuvenate your skin naturally',
    fullDescription: 'Reveal your natural radiance with our premium facial treatments. Our licensed estheticians customize each facial to address your unique skin concerns, using only the finest professional products.',
    image: '/images/service-facial.jpg',
    features: ['Deep Cleansing', 'Anti-Aging Treatments', 'Hydrating Facials', 'Acne Treatment', 'Chemical Peels', 'Microdermabrasion'],
    pricing: 'Starting at $75',
    duration: '60-90 minutes'
  },
  {
    slug: 'nail-care',
    name: 'Nail Care',
    icon: 'nail',
    shortDescription: 'Manicures, pedicures & nail art',
    fullDescription: 'Pamper your hands and feet with our luxurious nail care services. From classic manicures to intricate nail art, our technicians deliver flawless results in a relaxing, upscale environment.',
    image: '/images/service-nails.jpg',
    features: ['Classic Manicure', 'Spa Pedicure', 'Gel Nails', 'Nail Art & Design', 'Acrylic Extensions', 'Nail Repair'],
    pricing: 'Starting at $35',
    duration: '30-90 minutes'
  },
  {
    slug: 'makeup',
    name: 'Makeup',
    icon: 'makeup',
    shortDescription: 'For everyday to special occasions',
    fullDescription: 'Whether you need a polished everyday look or glamorous bridal makeup, our professional makeup artists create stunning results tailored to your style, skin tone, and occasion.',
    image: '/images/service-makeup.jpg',
    features: ['Everyday Makeup', 'Evening Glam', 'Bridal Makeup', 'Photoshoot Looks', 'Makeup Lessons', 'Special Occasion'],
    pricing: 'Starting at $65',
    duration: '45-90 minutes'
  },
  {
    slug: 'spa-treatments',
    name: 'Spa Treatments',
    icon: 'spa',
    shortDescription: 'Relax, refresh, rejuvenate',
    fullDescription: 'Escape the everyday with our indulgent spa treatments. Our full-body therapies combine ancient techniques with contemporary wellness practices to restore balance to your body and mind.',
    image: '/images/service-spa.jpg',
    features: ['Swedish Massage', 'Hot Stone Therapy', 'Body Wraps', 'Aromatherapy', 'Couples Massage', 'Wellness Packages'],
    pricing: 'Starting at $95',
    duration: '60-120 minutes'
  },
  {
    slug: 'bridal-packages',
    name: 'Bridal Packages',
    icon: 'crown',
    shortDescription: 'Look stunning on your big day',
    fullDescription: 'Make your wedding day unforgettable with our comprehensive bridal beauty packages. We provide pre-wedding trials, day-of services, and complete bridal party coordination for stress-free perfection.',
    image: '/images/service-bridal.jpg',
    features: ['Bridal Hair & Makeup', 'Trial Sessions', 'Bridal Party Services', 'Engagement Photos', 'Day-of Touch-ups', 'Destination Wedding'],
    pricing: 'Starting at $350',
    duration: '2-6 hours'
  }
];

const team = [
  { name: 'Isabella Martinez', role: 'Master Stylist', specialty: 'Color & Cuts', image: '/images/team-1.jpg' },
  { name: 'Olivia Chen', role: 'Lead Esthetician', specialty: 'Advanced Skincare', image: '/images/team-2.jpg' },
  { name: 'Sophia Williams', role: 'Nail Artist', specialty: 'Nail Art Design', image: '/images/team-3.jpg' },
  { name: 'Ava Johnson', role: 'Makeup Artist', specialty: 'Bridal & Glam', image: '/images/team-4.jpg' }
];

const reviews = [
  {
    name: 'Sarah M.',
    location: 'Kansas City, MO',
    rating: 5,
    text: '"BelleAura is my happy place! The team is so professional and friendly. My hair has never looked better!"',
    service: 'Hair Styling'
  },
  {
    name: 'Jennifer L.',
    location: 'Overland Park, KS',
    rating: 5,
    text: '"The facial treatment was amazing! My skin was so bright and glowing after. Highly recommend!"',
    service: 'Facials'
  },
  {
    name: 'Emily R.',
    location: 'Kansas City, MO',
    rating: 5,
    text: '"Beautiful salon, amazing service. I cannot wait for my next visit. Truly a luxury experience!"',
    service: 'Nail Care'
  },
  {
    name: 'Megan T.',
    location: 'Prairie Village, KS',
    rating: 5,
    text: '"The bridal package was perfect for my wedding day. The team made me feel like a queen!"',
    service: 'Bridal Package'
  },
  {
    name: 'Rachel K.',
    location: 'Lee\'s Summit, MO',
    rating: 5,
    text: '"Best spa day ever! So relaxing and the atmosphere is gorgeous. Will definitely return."',
    service: 'Spa Treatment'
  },
  {
    name: 'Hannah P.',
    location: 'Kansas City, MO',
    rating: 5,
    text: '"The makeup for my engagement photos was flawless. Everyone complimented my look!"',
    service: 'Makeup'
  },
  {
    name: 'Amanda S.',
    location: 'Shawnee, KS',
    rating: 5,
    text: '"I have been coming to BelleAura for two years and they never disappoint. Consistent, warm, and always worth it."',
    service: 'Hair Styling'
  },
  {
    name: 'Nicole B.',
    location: 'Kansas City, MO',
    rating: 5,
    text: '"My balayage turned out exactly like the inspiration photo. The color still looks fresh months later!"',
    service: 'Hair Color'
  },
  {
    name: 'Lauren D.',
    location: 'Leawood, KS',
    rating: 5,
    text: '"The estheticians actually listen. My sensitive skin has never been this calm and clear. Truly expert care."',
    service: 'Facials'
  },
  {
    name: 'Brittany H.',
    location: 'Independence, MO',
    rating: 5,
    text: '"Best manicure in Kansas City, hands down. The attention to detail on the nail art is incredible."',
    service: 'Nail Care'
  },
  {
    name: 'Chloe W.',
    location: 'Kansas City, MO',
    rating: 5,
    text: '"I booked the spa package for my birthday and it was pure bliss. I left feeling completely renewed."',
    service: 'Spa Treatment'
  },
  {
    name: 'Grace M.',
    location: 'Olathe, KS',
    rating: 5,
    text: '"They handled my entire bridal party beautifully. Everyone was ready on time and looked stunning."',
    service: 'Bridal Package'
  }
];

// Make all data available globally to all EJS views (footer, header, etc.)
app.locals.services = services;
app.locals.team = team;
app.locals.reviews = reviews;

// =============================================
// ROUTES
// =============================================

// Home
app.get('/', (req, res) => {
  res.render('index', {
    title: 'BelleAura Beauty Salon Kansas City | Premium Beauty Services',
    description: 'BelleAura Beauty Salon offers premium hair styling, facials, nail care, makeup, and spa treatments in Kansas City. Book your appointment today and discover beauty, care, confidence.',
    canonical: '/',
    services: services.slice(0, 6),
    reviews: reviews,
    pageClass: 'home'
  });
});

// About
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About BelleAura | Premier Beauty Salon Kansas City',
    description: 'Learn about BelleAura Beauty Salon - Kansas City\'s premier destination for premium beauty services. Meet our experienced team of certified professionals.',
    canonical: '/about',
    team: team,
    pageClass: 'about'
  });
});

// Services (overview)
app.get('/services', (req, res) => {
  res.render('services', {
    title: 'Beauty Services Kansas City | Hair, Facials, Nails, Makeup',
    description: 'Explore our complete range of professional beauty treatments. Hair care, facials, nail services, makeup artistry, spa treatments, and bridal packages in Kansas City.',
    canonical: '/services',
    services: services,
    pageClass: 'services'
  });
});

// Individual service pages
app.get('/services/:slug', (req, res) => {
  const service = services.find(s => s.slug === req.params.slug);
  if (!service) return res.status(404).render('404', { pageClass: 'error' });

  res.render(`services/${service.slug}`, {
    title: `${service.name} Kansas City | BelleAura Beauty Salon`,
    description: `${service.fullDescription.substring(0, 155)}...`,
    canonical: `/services/${service.slug}`,
    service: service,
    relatedServices: services.filter(s => s.slug !== service.slug).slice(0, 3),
    pageClass: 'service-detail'
  });
});

// Gallery
app.get('/gallery', (req, res) => {
  res.render('gallery', {
    title: 'Gallery | BelleAura Beauty Salon Kansas City',
    description: 'Browse our portfolio of stunning beauty transformations. Hair styling, makeup, nail art, and skincare results from our Kansas City salon.',
    canonical: '/gallery',
    pageClass: 'gallery'
  });
});

// Reviews
app.get('/reviews', (req, res) => {
  res.render('reviews', {
    title: 'Client Reviews | BelleAura Beauty Salon Kansas City',
    description: 'Read genuine reviews from our satisfied clients. See why Kansas City trusts BelleAura Beauty Salon for their beauty needs.',
    canonical: '/reviews',
    reviews: reviews,
    pageClass: 'reviews'
  });
});

// Contact
app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us | BelleAura Beauty Salon Kansas City',
    description: 'Get in touch with BelleAura Beauty Salon. Located in Kansas City, MO. Call, email, or visit us for bookings and inquiries.',
    canonical: '/contact',
    pageClass: 'contact'
  });
});

// Team
app.get('/team', (req, res) => {
  res.render('team', {
    title: 'Our Expert Team | BelleAura Beauty Salon',
    description: 'Meet the talented beauty experts at BelleAura. Our certified stylists, estheticians, and artists deliver exceptional results.',
    canonical: '/team',
    team: team,
    pageClass: 'team'
  });
});

// Pricing
app.get('/pricing', (req, res) => {
  res.render('pricing', {
    title: 'Service Pricing | BelleAura Beauty Salon Kansas City',
    description: 'Transparent pricing for all BelleAura beauty services. Hair styling, facials, nail care, makeup, spa treatments, and bridal packages.',
    canonical: '/pricing',
    services: services,
    pageClass: 'pricing'
  });
});

// FAQ
app.get('/faq', (req, res) => {
  res.render('faq', {
    title: 'FAQ | BelleAura Beauty Salon Kansas City',
    description: 'Frequently asked questions about BelleAura Beauty Salon services, booking, pricing, and policies in Kansas City.',
    canonical: '/faq',
    pageClass: 'faq'
  });
});

// Blog
app.get('/blog', (req, res) => {
  res.render('blog', {
    title: 'Beauty Blog | BelleAura Beauty Tips & Trends',
    description: 'Expert beauty tips, trends, and advice from BelleAura\'s professional team. Skincare, haircare, and wellness insights.',
    canonical: '/blog',
    pageClass: 'blog'
  });
});

// Book appointment
app.get('/book', (req, res) => {
  res.render('book', {
    title: 'Book Appointment | BelleAura Beauty Salon Kansas City',
    description: 'Book your beauty appointment at BelleAura Kansas City. Easy scheduling for hair, nails, facials, makeup, and spa services.',
    canonical: '/book',
    services: services,
    pageClass: 'book'
  });
});

// Privacy Policy
app.get('/privacy-policy', (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy | BelleAura Beauty Salon',
    description: 'BelleAura Beauty Salon privacy policy. How we collect, use, and protect your personal information.',
    canonical: '/privacy-policy',
    pageClass: 'legal'
  });
});

// Terms of Service
app.get('/terms', (req, res) => {
  res.render('terms', {
    title: 'Terms of Service | BelleAura Beauty Salon',
    description: 'BelleAura Beauty Salon terms of service. Service agreements, booking policies, and customer responsibilities.',
    canonical: '/terms',
    pageClass: 'legal'
  });
});

// 404
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found | BelleAura Beauty Salon',
    description: 'The page you are looking for could not be found.',
    canonical: '/404',
    pageClass: 'error'
  });
});

// =============================================
// SITEMAP.XML
// =============================================
const { Readable } = require('stream');

app.get('/sitemap.xml', async (req, res) => {
  try {
    const stream = new SitemapStream({ hostname: SITE_CONFIG.url });

    const links = [
      { url: '/', changefreq: 'weekly', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/services', changefreq: 'weekly', priority: 0.9 },
      { url: '/gallery', changefreq: 'weekly', priority: 0.7 },
      { url: '/reviews', changefreq: 'weekly', priority: 0.7 },
      { url: '/contact', changefreq: 'monthly', priority: 0.8 },
      { url: '/team', changefreq: 'monthly', priority: 0.6 },
      { url: '/pricing', changefreq: 'monthly', priority: 0.7 },
      { url: '/faq', changefreq: 'monthly', priority: 0.6 },
      { url: '/blog', changefreq: 'weekly', priority: 0.7 },
      { url: '/book', changefreq: 'monthly', priority: 0.9 }
    ];

    services.forEach(s => {
      links.push({
        url: `/services/${s.slug}`,
        changefreq: 'monthly',
        priority: 0.8
      });
    });

    links.push({ url: '/privacy-policy', changefreq: 'yearly', priority: 0.3 });
    links.push({ url: '/terms', changefreq: 'yearly', priority: 0.3 });

    const xml = await streamToPromise(Readable.from(links).pipe(stream));
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml.toString());
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

// =============================================
// ROBOTS.TXT (served dynamically with correct URL)
// =============================================
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${SITE_CONFIG.url}/sitemap.xml`);
});

// =============================================
// START SERVER
// =============================================
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✨ BelleAura Beauty Salon running on port ${PORT}`);
    console.log(`🌹 Visit: http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;