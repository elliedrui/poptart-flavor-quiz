"""Build images/banner.jpg: the six flavor photos as cutouts on a pink background.

Usage (from the repo root): python tools/make_banner.py images images/banner.jpg
Requires Pillow (pip install pillow).
"""
import math
import random
import sys
from PIL import Image, ImageFilter, ImageChops, ImageDraw

images_dir, out_path = sys.argv[1], sys.argv[2]

W, H = 1600, 400
BG = (255, 228, 241)          # soft pink, a shade deeper than the page
SPRINKLES = [(232, 69, 139), (120, 190, 255), (255, 205, 70), (130, 210, 140), (190, 140, 255)]


MARK = (255, 0, 255)  # sentinel colour that never appears in the photos


def cutout(img, tolerance):
    """Remove the background by flood-filling inward from the photo's border.

    Only background connected to the edge is removed, so white frosting
    enclosed by crust stays opaque.
    """
    rgb = img.convert('RGB')
    marked = rgb.copy()
    w, h = marked.size
    # seed along all four edges so every bit of edge-connected background fills
    for x in range(0, w, 20):
        for y in (0, h - 1):
            if marked.getpixel((x, y)) != MARK:
                ImageDraw.floodfill(marked, (x, y), MARK, thresh=tolerance)
    for y in range(0, h, 20):
        for x in (0, w - 1):
            if marked.getpixel((x, y)) != MARK:
                ImageDraw.floodfill(marked, (x, y), MARK, thresh=tolerance)

    r, g, b = marked.split()
    is_mark = ImageChops.multiply(
        ImageChops.multiply(r.point(lambda v: 255 if v == 255 else 0),
                            g.point(lambda v: 255 if v == 0 else 0)),
        b.point(lambda v: 255 if v == 255 else 0))
    alpha = ImageChops.invert(is_mark)
    # shave the halo and soften the edge
    alpha = alpha.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.2))
    out = rgb.convert('RGBA')
    out.putalpha(alpha)
    return out.crop(alpha.point(lambda a: 255 if a > 20 else 0).getbbox())


# (file, flood-fill tolerance, pastries in the photo, rotation in degrees)
pieces = [
    ('strawberry.jpg', 30, 2, 6),
    ('blueberry.jpg', 60, 1, -7),
    ('cherry.jpg', 30, 2, 5),
    ('smores.jpg', 30, 2, -6),
    ('chocolate.jpg', 60, 1, 7),
    ('brownsugar.jpg', 30, 2, -5),
]

canvas = Image.new('RGBA', (W, H), BG + (255,))

# a light scatter of sprinkles in the background
draw = ImageDraw.Draw(canvas)
rng = random.Random(7)  # fixed seed so the banner is reproducible
for _ in range(140):
    x, y = rng.randrange(W), rng.randrange(H)
    length, angle = rng.randint(10, 18), rng.uniform(0, 3.14)
    dx, dy = math.cos(angle) * length / 2, math.sin(angle) * length / 2
    draw.line([(x - dx, y - dy), (x + dx, y + dy)], fill=rng.choice(SPRINKLES) + (150,), width=5)

PAD = 50  # keep the end pastries off the edges
slot_w = (W - 2 * PAD) / len(pieces)
for i, (name, tolerance, count, angle) in enumerate(pieces):
    piece = cutout(Image.open(f'{images_dir}/{name}'), tolerance)

    # pairs get a box a bit wider than their slot so neighbours overlap;
    # single pastries get a smaller box so they match a pair's pastry size
    if count == 2:
        target_w, target_h = slot_w * 1.3, H * 0.72
    else:
        target_w, target_h = slot_w * 0.85, H * 0.62
    scale = min(target_w / piece.width, target_h / piece.height)
    piece = piece.resize((int(piece.width * scale), int(piece.height * scale)), Image.LANCZOS)
    piece = piece.rotate(angle, resample=Image.BICUBIC, expand=True)

    # soft drop shadow from the piece's own alpha
    shadow = Image.new('RGBA', piece.size, (90, 30, 60, 0))
    shadow.putalpha(piece.getchannel('A').point(lambda a: a * 0.35).filter(ImageFilter.GaussianBlur(10)))

    cx = int(PAD + slot_w * i + slot_w / 2)
    cy = H // 2 + (12 if i % 2 else -12)
    x, y = cx - piece.width // 2, cy - piece.height // 2
    # paste (unlike alpha_composite) accepts offsets that hang off the edge
    canvas.paste(shadow, (x + 8, y + 12), shadow)
    canvas.paste(piece, (x, y), piece)

canvas.convert('RGB').save(out_path, quality=85, optimize=True, progressive=True)
print('wrote', out_path, canvas.size)
