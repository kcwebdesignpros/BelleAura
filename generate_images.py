"""
BelleAura Beauty Salon - FLAT PLACEHOLDER Image Generator
=========================================================

WARNING: This script generates flat 2D geometric PLACEHOLDER images and writes
them directly into public/images/ using the SAME filenames as the real
AI-generated photos. Running it WILL OVERWRITE the production images.

The live site uses real photorealistic images produced by the AI generation
pipeline (see process_images.py, which crops/resizes the AI output into
public/images/). Only run this script if you deliberately want to fall back
to lightweight flat placeholders (e.g. to shrink repo size or work offline).

Set the environment variable BELLEAURA_ALLOW_PLACEHOLDER_OVERWRITE=1 to
confirm you really want to overwrite the real images.
"""

import os
import sys

if os.environ.get('BELLEAURA_ALLOW_PLACEHOLDER_OVERWRITE') != '1':
    sys.exit(
        "\n[ABORTED] This would overwrite the real AI-generated photos in "
        "public/images/.\n"
        "If you truly want flat placeholders, re-run with:\n"
        "  BELLEAURA_ALLOW_PLACEHOLDER_OVERWRITE=1 python generate_images.py\n"
    )

from PIL import Image, ImageDraw, ImageFont  # noqa: E402
import math  # noqa: E402

# ---- New Premium 2D Palette (matching CSS design tokens) ----
PALETTE = {
    'rose':       (201, 139, 139),   # #c98b8b
    'rose_deep':  (166, 107, 107),   # #a66b6b
    'rose_soft':  (232, 209, 209),   # #e8d1d1
    'rose_mist':  (246, 235, 233),   # #f6ebe9
    'blush':      (242, 224, 220),   # #f2e0dc
    'gold':       (184, 147, 90),    # #b8935a
    'gold_light': (212, 184, 134),   # #d4b886
    'gold_soft':  (240, 230, 211),   # #f0e6d3
    'plum':       (45, 31, 34),      # #2d1f22
    'plum_light': (74, 53, 57),      # #4a3539
    'cream':      (250, 245, 242),   # #faf5f2
    'cream_deep': (245, 237, 232),   # #f5ede8
    'white':      (255, 255, 255),
    'ink':        (26, 21, 23),      # #1a1517
    'stone':      (138, 122, 126),   # #8a7a7e
    'stone_light':(181, 167, 171),  # #b5a7ab
}

# ---- Font helpers ----
def get_font(size, bold=False):
    """Try to load a premium-looking font."""
    candidates = [
        "C:/Windows/Fonts/georgia.ttf",
        "C:/Windows/Fonts/times.ttf",
        "C:/Windows/Fonts/cambria.ttc",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except:
            continue
    return ImageFont.load_default()

def get_sans_font(size, bold=False):
    """Load a clean sans-serif font."""
    paths = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
    ]
    for path in paths:
        try:
            return ImageFont.truetype(path, size)
        except:
            continue
    return ImageFont.load_default()

# ---- Drawing primitives (flat 2D style) ----
def flat_bg(width, height, color):
    """Create a solid flat background."""
    return Image.new('RGB', (width, height), color)

def draw_circle(draw, cx, cy, r, fill):
    """Draw a filled circle."""
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill)

def draw_ring(draw, cx, cy, r, thickness, color):
    """Draw a ring (outline circle)."""
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=thickness)

def draw_half_circle(draw, cx, cy, r, fill, quadrant='top'):
    """Draw a half circle for flat 2D decoration."""
    bbox = [cx - r, cy - r, cx + r, cy + r]
    if quadrant == 'top':
        draw.pieslice(bbox, 180, 360, fill=fill)
    elif quadrant == 'bottom':
        draw.pieslice(bbox, 0, 180, fill=fill)
    elif quadrant == 'left':
        draw.pieslice(bbox, 90, 270, fill=fill)
    elif quadrant == 'right':
        draw.pieslice(bbox, 270, 90, fill=fill)

def draw_arc(draw, cx, cy, r, start, end, color, thickness):
    """Draw an arc."""
    draw.arc([cx - r, cy - r, cx + r, cy + r], start, end, fill=color, width=thickness)

def draw_rect(draw, x, y, w, h, fill):
    """Draw a rectangle."""
    draw.rectangle([x, y, x + w, y + h], fill=fill)

def draw_rounded_rect(draw, x, y, w, h, r, fill):
    """Draw a rounded rectangle."""
    draw.rounded_rectangle([x, y, x + w, y + h], radius=r, fill=fill)

def draw_line(draw, x1, y1, x2, y2, color, width=2):
    """Draw a line."""
    draw.line([(x1, y1), (x2, y2)], fill=color, width=width)

def draw_dot_pattern(draw, x, y, cols, rows, spacing, dot_r, color):
    """Draw a dot grid pattern."""
    for r in range(rows):
        for c in range(cols):
            cx = x + c * spacing
            cy = y + r * spacing
            draw.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=color)

def draw_wave(draw, x, y, w, amp, color, thickness=2):
    """Draw a simple wave line."""
    points = []
    for i in range(0, w + 1, 3):
        cy = y + int(amp * math.sin(i * 0.04))
        points.append((x + i, cy))
    draw.line(points, fill=color, width=thickness, joint='curve')

def center_text(draw, text, cx, y, font, fill):
    """Center text horizontally."""
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = cx - tw // 2
    draw.text((x, y), text, fill=fill, font=font)
    return tw

# ---- Image generators ----
def gen_service_image(title, subtitle, filename, bg_color, accent_color, deco_color):
    """Generate a premium flat 2D service image (800x1000)."""
    w, h = 800, 1000
    img = flat_bg(w, h, bg_color)
    draw = ImageDraw.Draw(img)

    # Top decorative band
    draw_rect(draw, 0, 0, w, 6, accent_color)

    # Large circle top-right (partial)
    draw_circle(draw, w + 80, 120, 200, deco_color)

    # Ring accent
    draw_ring(draw, 650, 250, 90, 3, accent_color)

    # Dot pattern bottom-left
    draw_dot_pattern(draw, 60, h - 180, 6, 4, 28, 4, deco_color)

    # Small circle accent
    draw_circle(draw, 100, h - 60, 50, accent_color)

    # Center content area
    cx = w // 2

    # Service icon area — large circle with ring
    icon_cy = 360
    draw_circle(draw, cx, icon_cy, 80, deco_color)
    draw_ring(draw, cx, icon_cy, 95, 3, accent_color)

    # Service name
    font_title = get_font(44)
    center_text(draw, title, cx, 480, font_title, PALETTE['plum'])

    # Divider line
    draw_line(draw, cx - 40, 550, cx + 40, 550, accent_color, 3)

    # Subtitle
    font_sub = get_sans_font(20)
    center_text(draw, subtitle, cx, 570, font_sub, PALETTE['stone'])

    # BelleAura label at bottom
    font_brand = get_sans_font(16, bold=True)
    center_text(draw, "BELLEAURA", cx, h - 120, font_brand, accent_color)
    font_loc = get_sans_font(14)
    center_text(draw, "Kansas City", cx, h - 90, font_loc, PALETTE['stone_light'])

    img.save(f'public/images/{filename}', 'JPEG', quality=92)
    print(f'  Created: {filename}')

def gen_gallery_image(title, filename, bg_color, accent_color, deco_color):
    """Generate a premium flat 2D gallery image (600x750)."""
    w, h = 600, 750
    img = flat_bg(w, h, bg_color)
    draw = ImageDraw.Draw(img)

    # Top decorative bar
    draw_rect(draw, 0, 0, w, 5, accent_color)

    # Large circle bottom-right (partial)
    draw_circle(draw, w - 50, h - 50, 180, deco_color)

    # Ring
    draw_ring(draw, 80, 120, 60, 3, accent_color)

    # Small circle
    draw_circle(draw, w - 100, 200, 35, accent_color)

    # Dot pattern
    draw_dot_pattern(draw, 40, h - 200, 5, 3, 30, 3, deco_color)

    # Title text
    cx = w // 2
    font_title = get_font(36)
    center_text(draw, title, cx, h // 2 - 20, font_title, PALETTE['plum'])

    # Divider
    draw_line(draw, cx - 30, h // 2 + 40, cx + 30, h // 2 + 40, accent_color, 2)

    # Label
    font_sub = get_sans_font(14)
    center_text(draw, "BELLEAURA", cx, h // 2 + 55, font_sub, accent_color)

    img.save(f'public/images/{filename}', 'JPEG', quality=92)
    print(f'  Created: {filename}')

def gen_team_image(name, role, filename):
    """Generate a premium flat 2D team member image (400x500)."""
    w, h = 400, 500
    img = flat_bg(w, h, PALETTE['cream_deep'])
    draw = ImageDraw.Draw(img)

    # Top bar
    draw_rect(draw, 0, 0, w, 5, PALETTE['gold'])

    # Large circle for avatar placeholder
    cx = w // 2
    avatar_cy = 180
    draw_circle(draw, cx, avatar_cy, 75, PALETTE['rose_soft'])
    draw_ring(draw, cx, avatar_cy, 90, 3, PALETTE['gold'])

    # Initials in circle
    initials = ''.join([n[0] for n in name.split()[:2]])
    font_initials = get_font(40)
    center_text(draw, initials, cx, avatar_cy - 20, font_initials, PALETTE['rose_deep'])

    # Decorative dots
    draw_dot_pattern(draw, 30, 300, 8, 2, 25, 3, PALETTE['rose_soft'])

    # Name
    font_name = get_font(26)
    center_text(draw, name, cx, 320, font_name, PALETTE['plum'])

    # Divider
    draw_line(draw, cx - 25, 360, cx + 25, 360, PALETTE['gold'], 2)

    # Role
    font_role = get_sans_font(16)
    center_text(draw, role, cx, 370, font_role, PALETTE['stone'])

    # BelleAura at bottom
    font_brand = get_sans_font(12, bold=True)
    center_text(draw, "BELLEAURA", cx, h - 50, font_brand, PALETTE['gold'])
    font_loc = get_sans_font(11)
    center_text(draw, "Kansas City", cx, h - 30, font_loc, PALETTE['stone_light'])

    img.save(f'public/images/{filename}', 'JPEG', quality=92)
    print(f'  Created: {filename}')

def gen_blog_image(title, filename, bg_color, accent_color, deco_color):
    """Generate a premium flat 2D blog image (600x450)."""
    w, h = 600, 450
    img = flat_bg(w, h, bg_color)
    draw = ImageDraw.Draw(img)

    # Top bar
    draw_rect(draw, 0, 0, w, 5, accent_color)

    # Decorative shapes
    draw_circle(draw, w - 60, 80, 100, deco_color)
    draw_ring(draw, 80, h - 80, 50, 3, accent_color)
    draw_circle(draw, 60, 80, 25, accent_color)

    # Dot pattern
    draw_dot_pattern(draw, w - 120, h - 100, 4, 3, 22, 3, deco_color)

    # Title (truncated)
    display_title = title[:28] + ('...' if len(title) > 28 else '')
    cx = w // 2
    font_title = get_font(30)
    center_text(draw, display_title, cx, h // 2 - 20, font_title, PALETTE['plum'])

    # Divider
    draw_line(draw, cx - 30, h // 2 + 30, cx + 30, h // 2 + 30, accent_color, 2)

    # Label
    font_sub = get_sans_font(13)
    center_text(draw, "BELLEAURA BLOG", cx, h // 2 + 45, font_sub, accent_color)

    img.save(f'public/images/{filename}', 'JPEG', quality=92)
    print(f'  Created: {filename}')

def gen_interior_image(filename, w, h):
    """Generate a premium flat 2D salon interior image."""
    img = flat_bg(w, h, PALETTE['cream'])
    draw = ImageDraw.Draw(img)

    # Top bar
    draw_rect(draw, 0, 0, w, 6, PALETTE['gold'])

    # Large decorative circle top-right
    draw_circle(draw, w - 80, 100, 200, PALETTE['rose_mist'])
    draw_ring(draw, w - 80, 100, 220, 3, PALETTE['gold_light'])

    # Medium circle bottom-left
    draw_circle(draw, 80, h - 100, 140, PALETTE['rose_soft'])

    # Ring accent
    draw_ring(draw, w - 200, h - 150, 70, 3, PALETTE['gold'])

    # Dot pattern
    draw_dot_pattern(draw, 50, 50, 8, 3, 30, 4, PALETTE['rose_soft'])

    # Center content
    cx = w // 2

    # Brand name
    font_brand = get_font(52)
    center_text(draw, "BelleAura", cx, h // 2 - 60, font_brand, PALETTE['plum'])

    # Divider
    draw_line(draw, cx - 50, h // 2, cx + 50, h // 2, PALETTE['gold'], 3)

    # Tagline
    font_tag = get_sans_font(20)
    center_text(draw, "Kansas City Beauty Salon", cx, h // 2 + 20, font_tag, PALETTE['stone'])

    # Small label
    font_small = get_sans_font(14, bold=True)
    center_text(draw, "PREMIUM BEAUTY SERVICES", cx, h - 80, font_small, PALETTE['gold'])

    img.save(f'public/images/{filename}', 'JPEG', quality=92)
    print(f'  Created: {filename}')

def gen_about_image(filename):
    """Generate a premium flat 2D about story image."""
    w, h = 600, 700
    img = flat_bg(w, h, PALETTE['cream_deep'])
    draw = ImageDraw.Draw(img)

    # Top bar
    draw_rect(draw, 0, 0, w, 6, PALETTE['gold'])

    # Large circle bottom-right
    draw_circle(draw, w - 50, h - 50, 180, PALETTE['rose_mist'])
    draw_ring(draw, w - 50, h - 50, 200, 3, PALETTE['gold_light'])

    # Medium circle top-left
    draw_circle(draw, 60, 80, 100, PALETTE['rose_soft'])

    # Ring
    draw_ring(draw, 120, h - 200, 60, 3, PALETTE['gold'])

    # Dot pattern
    draw_dot_pattern(draw, 40, 40, 6, 4, 25, 3, PALETTE['rose_soft'])

    # Center content
    cx = w // 2

    # Title
    font_title = get_font(44)
    center_text(draw, "Our Story", cx, h // 2 - 40, font_title, PALETTE['plum'])

    # Divider
    draw_line(draw, cx - 40, h // 2 + 10, cx + 40, h // 2 + 10, PALETTE['gold'], 3)

    # Since 2019
    font_sub = get_sans_font(20)
    center_text(draw, "Since 2019", cx, h // 2 + 30, font_sub, PALETTE['stone'])

    # BelleAura
    font_brand = get_sans_font(16, bold=True)
    center_text(draw, "BELLEAURA", cx, h - 80, font_brand, PALETTE['gold'])
    font_loc = get_sans_font(14)
    center_text(draw, "Kansas City, MO", cx, h - 55, font_loc, PALETTE['stone_light'])

    img.save(f'public/images/{filename}', 'JPEG', quality=92)
    print(f'  Created: {filename}')

def gen_og_image(filename):
    """Generate Open Graph image (1200x630)."""
    w, h = 1200, 630
    img = flat_bg(w, h, PALETTE['plum'])
    draw = ImageDraw.Draw(img)

    # Left accent panel
    draw_rect(draw, 0, 0, 6, h, PALETTE['gold'])

    # Large circle right side
    draw_circle(draw, w - 100, 150, 250, PALETTE['plum_light'])
    draw_ring(draw, w - 100, 150, 270, 3, PALETTE['gold'])

    # Ring bottom-left
    draw_ring(draw, 150, h - 100, 120, 3, PALETTE['gold_light'])

    # Dot pattern
    draw_dot_pattern(draw, 80, 80, 10, 4, 30, 3, PALETTE['plum_light'])

    # Center-left content
    cx = 400

    # Brand name
    font_brand = get_font(60)
    center_text(draw, "BelleAura", cx, 200, font_brand, PALETTE['white'])

    # Divider
    draw_line(draw, cx - 60, 280, cx + 60, 280, PALETTE['gold'], 3)

    # Tagline
    font_tag = get_sans_font(24)
    center_text(draw, "Beauty, Care, Confidence", cx, 300, font_tag, PALETTE['gold_light'])

    # Location
    font_loc = get_sans_font(18)
    center_text(draw, "Kansas City's Premier Beauty Salon", cx, 340, font_loc, PALETTE['stone_light'])

    img.save(f'public/images/{filename}', 'JPEG', quality=92)
    print(f'  Created: {filename}')


def main():
    images_dir = 'public/images'
    os.makedirs(images_dir, exist_ok=True)

    print('=' * 50)
    print('BelleAura Beauty Salon — Premium 2D Images')
    print('=' * 50)

    # ---- Service Images ----
    print('\nService Images:')
    services = [
        ('Hair Styling',    'service-hair.jpg',    PALETTE['rose_mist'],   PALETTE['gold'],       PALETTE['rose_soft']),
        ('Facials',         'service-facial.jpg',  PALETTE['gold_soft'],    PALETTE['rose_deep'],   PALETTE['gold_light']),
        ('Nail Care',       'service-nails.jpg',   PALETTE['rose_mist'],    PALETTE['gold'],        PALETTE['rose']),
        ('Makeup',          'service-makeup.jpg',  PALETTE['cream_deep'],    PALETTE['rose_deep'],   PALETTE['rose_soft']),
        ('Spa Treatments',  'service-spa.jpg',     PALETTE['gold_soft'],     PALETTE['plum'],        PALETTE['gold_light']),
        ('Bridal Packages', 'service-bridal.jpg',  PALETTE['rose_soft'],    PALETTE['gold'],        PALETTE['rose']),
    ]
    for title, fname, bg, accent, deco in services:
        gen_service_image(title, 'BelleAura Beauty Salon', fname, bg, accent, deco)

    # ---- Interior & About ----
    print('\nInterior & About Images:')
    gen_interior_image('salon-interior.jpg', 600, 700)
    gen_about_image('about-story.jpg')

    # ---- Gallery Images ----
    print('\nGallery Images:')
    gallery = [
        ('Hair Styling',     'gallery-1.jpg', PALETTE['rose_mist'],   PALETTE['gold'],       PALETTE['rose_soft']),
        ('Facial Treatment', 'gallery-2.jpg', PALETTE['gold_soft'],    PALETTE['rose_deep'],   PALETTE['gold_light']),
        ('Nail Art',         'gallery-3.jpg', PALETTE['rose_soft'],    PALETTE['gold'],        PALETTE['rose']),
        ('Makeup',           'gallery-4.jpg', PALETTE['cream_deep'],    PALETTE['rose_deep'],   PALETTE['rose_soft']),
        ('Hair Color',       'gallery-5.jpg', PALETTE['rose_mist'],    PALETTE['plum'],        PALETTE['rose_soft']),
        ('Spa Treatment',    'gallery-6.jpg', PALETTE['gold_soft'],     PALETTE['rose_deep'],   PALETTE['gold_light']),
        ('Manicure',         'gallery-7.jpg', PALETTE['cream_deep'],    PALETTE['gold'],        PALETTE['rose']),
        ('Skincare',         'gallery-8.jpg', PALETTE['rose_mist'],    PALETTE['rose_deep'],   PALETTE['rose_soft']),
    ]
    for title, fname, bg, accent, deco in gallery:
        gen_gallery_image(title, fname, bg, accent, deco)

    # ---- Team Images ----
    print('\nTeam Images:')
    team = [
        ('Isabella M.', 'Master Stylist',     'team-1.jpg'),
        ('Olivia C.',   'Lead Esthetician',   'team-2.jpg'),
        ('Sophia W.',   'Nail Artist',        'team-3.jpg'),
        ('Ava J.',      'Makeup Artist',      'team-4.jpg'),
    ]
    for name, role, fname in team:
        gen_team_image(name, role, fname)

    # ---- Blog Images ----
    print('\nBlog Images:')
    blog = [
        ('Summer Hair Care Tips',     'blog-1.jpg', PALETTE['rose_mist'],   PALETTE['gold'],       PALETTE['rose_soft']),
        ('Fall Skincare Routine',     'blog-2.jpg', PALETTE['gold_soft'],    PALETTE['rose_deep'],   PALETTE['gold_light']),
        ('2026 Nail Trends',          'blog-3.jpg', PALETTE['rose_soft'],    PALETTE['gold'],        PALETTE['rose']),
        ('Bridal Beauty Timeline',    'blog-4.jpg', PALETTE['cream_deep'],    PALETTE['rose_deep'],   PALETTE['rose_soft']),
        ('Self-Care Sundays',         'blog-5.jpg', PALETTE['rose_mist'],    PALETTE['plum'],        PALETTE['rose_soft']),
        ('Color Correction Guide',    'blog-6.jpg', PALETTE['gold_soft'],     PALETTE['rose_deep'],   PALETTE['gold_light']),
    ]
    for title, fname, bg, accent, deco in blog:
        gen_blog_image(title, fname, bg, accent, deco)

    # ---- OG Image ----
    print('\nSocial Images:')
    gen_og_image('og-image.jpg')

    print('\n' + '=' * 50)
    print(f'All images generated in {images_dir}/')
    print(f'Total: 28 images')
    print('=' * 50)


if __name__ == '__main__':
    main()
