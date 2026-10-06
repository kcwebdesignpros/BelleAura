"""
Process AI-generated images: center-crop to target aspect ratio, resize,
and save as optimized JPEGs into public/images/ with the site's expected names.
"""
from PIL import Image
import os

SRC = ".workbuddy-ai/genimg"
DST = "public/images"
os.makedirs(DST, exist_ok=True)

# generated filename prefix -> (target name, target W, target H, quality)
MAP = [
    ("Professional_female_beauty_sty",  "hero.jpg",           900, 1100, 84),
    ("Hairstylist_styling_a_client_s",  "service-hair.jpg",   800, 1000, 84),
    ("Woman_receiving_a_relaxing_fac",  "service-facial.jpg", 800, 1000, 84),
    ("Close_up_of_elegant_manicured_",  "service-nails.jpg",  800, 1000, 84),
    ("Makeup_artist_applying_makeup_",  "service-makeup.jpg", 800, 1000, 84),
    ("Serene_luxury_spa_treatment_ro",  "service-spa.jpg",    800, 1000, 84),
    ("Bride_getting_her_hair_and_mak",  "service-bridal.jpg", 800, 1000, 84),
    ("Interior_of_an_elegant_luxury_",  "about-story.jpg",    640,  760, 84),
    ("Beautiful_balayage_hair_color_",  "gallery-1.jpg",      600,  750, 82),
    ("Glowing_radiant_facial_skin_cl",  "gallery-2.jpg",      600,  750, 82),
    ("Artistic_elegant_nail_art_desi",  "gallery-3.jpg",      600,  750, 82),
    ("Professional_glam_makeup_beaut",  "gallery-4.jpg",      600,  750, 82),
    ("Vibrant_hair_color_transformat",  "gallery-5.jpg",      600,  750, 82),
    ("Luxury_spa_still_life_arrangem",  "gallery-6.jpg",      600,  750, 82),
    ("Elegant_manicured_hands_with_n",  "gallery-7.jpg",      600,  750, 82),
    ("Skincare_routine_flat_lay_with",  "gallery-8.jpg",      600,  750, 82),
    ("Professional_headshot_portrait_2026-10-06T09-28-36", "team-1.jpg", 500, 625, 84),
    ("Professional_headshot_portrait_2026-10-06T09-28-26", "team-2.jpg", 500, 625, 84),
    ("Professional_headshot_portrait_2026-10-06T09-28-35", "team-3.jpg", 500, 625, 84),
    ("Professional_headshot_portrait_2026-10-06T09-29-58", "team-4.jpg", 500, 625, 84),
    ("Summer_hair_care_concept__woma",  "blog-1.jpg",        800,  600, 82),
    ("Fall_skincare_routine_flat_lay",  "blog-2.jpg",        800,  600, 82),
    ("Trendy_modern_nail_designs_fla",  "blog-3.jpg",        800,  600, 82),
    ("Bridal_beauty_preparation_conc",  "blog-4.jpg",        800,  600, 82),
    ("Cozy_self_care_spa_day_at_home",  "blog-5.jpg",        800,  600, 82),
    ("Hair_color_correction_concept_",  "blog-6.jpg",        800,  600, 82),
    ("Luxurious_modern_beauty_salon_",  "salon-interior.jpg", 640, 760, 84),
    ("Elegant_luxury_beauty_salon_br",  "og-image.jpg",     1200,  630, 86),
]

def find_src(prefix):
    for f in os.listdir(SRC):
        if f.startswith(prefix) and f.lower().endswith(".png"):
            return os.path.join(SRC, f)
    return None

def center_crop_resize(img, tw, th):
    """Center-crop to target aspect ratio, then resize."""
    w, h = img.size
    target_ratio = tw / th
    cur_ratio = w / h
    if cur_ratio > target_ratio:
        # too wide -> crop width
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        img = img.crop((left, 0, left + new_w, h))
    else:
        # too tall -> crop height
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        img = img.crop((0, top, w, top + new_h))
    return img.resize((tw, th), Image.LANCZOS)

count = 0
for prefix, name, tw, th, q in MAP:
    src = find_src(prefix)
    if not src:
        print(f"  MISSING source for {name} (prefix {prefix})")
        continue
    img = Image.open(src).convert("RGB")
    img = center_crop_resize(img, tw, th)
    out = os.path.join(DST, name)
    img.save(out, "JPEG", quality=q, optimize=True, progressive=True)
    count += 1
    print(f"  {name}  ({tw}x{th})")

# apple-touch-icon from the hero image
hero_src = find_src("Professional_female_beauty_sty")
if hero_src:
    icon = Image.open(hero_src).convert("RGB")
    icon = center_crop_resize(icon, 180, 180)
    icon.save(os.path.join(DST, "apple-touch-icon.png"), "PNG", optimize=True)
    print("  apple-touch-icon.png (180x180)")

print(f"\nDone: {count} JPEGs + icon written to {DST}/")
