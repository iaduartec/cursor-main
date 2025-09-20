tools/create_stock_hero.py
#!/usr/bin/env python3
"""
Crear/forzar imagen hero a partir de una foto stock por categoría para un post.

Uso:
  python tools/create_stock_hero.py --slug videovigilancia-ip-comercios-burgos-2025
Opcional:
  --stock <ruta>  (si quieres forzar una foto distinta)
"""

from pathlib import Path
import argparse
import re
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content" / "blog"
IMAGES_DIR = ROOT / "public" / "images" / "blog"
STOCK_DIR = ROOT / "public" / "images" / "proyectos"


def read_frontmatter(slug: str):
    p = CONTENT_DIR / f"{slug}.mdx"
    if not p.exists():
        return None, None
    t = p.read_text(encoding="utf-8", errors="replace")
    if not t.startswith("---"):
        return None, None
    parts = t.split("---", 2)
    if len(parts) < 3:
        return None, None
    fm = parts[1]
    cat = None
    img = None
    m = re.search(r"^category:\s*(.+)$", fm, re.MULTILINE)
    if m:
        cat = m.group(1).strip().strip("'\"")
    m2 = re.search(r"^image:\s*(.+)$", fm, re.MULTILINE)
    if m2:
        img = m2.group(1).strip().strip("'\"")
    return cat, img


def pick_stock(category: str | None) -> Path | None:
    mapping = {
        'Seguridad': 'CCTV.jpeg',
        'Electricidad': 'electricidad.jpeg',
        'Informática': 'servers.jpeg',
        'Informatica': 'servers.jpeg',
        'Sonido': 'sonido.jpeg',
    }
    fname = mapping.get((category or 'Seguridad').strip(), 'seguridad_red.jpeg')
    cand = STOCK_DIR / fname
    return cand if cand.exists() else None


def save_cover_webp(src: Path, dst: Path, size=(1920, 1080), quality=85):
    dst.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        out = ImageOps.fit(im, size, method=Image.Resampling.LANCZOS)
        out.save(dst, format='WEBP', quality=quality, method=6)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--slug', required=True)
    ap.add_argument('--stock', required=False)
    args = ap.parse_args()

    category, image_field = read_frontmatter(args.slug)
    stock = Path(args.stock) if args.stock else pick_stock(category)
    if not stock or not stock.exists():
        print(f"[ERR] No se encontró stock para categoría '{category}'.")
        return 1

    dst = IMAGES_DIR / args.slug / f"{args.slug}-hero-001.webp"
    save_cover_webp(stock, dst)
    size = dst.stat().st_size
    print(f"[OK] Generada imagen hero: {dst} ({size} bytes)")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

