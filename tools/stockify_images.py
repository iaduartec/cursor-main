"""
Resumen generado automáticamente.

tools/stockify_images.py

2025-09-13T06:20:07.390Z

——————————————————————————————
Archivo .py: stockify_images.py
Tamaño: 5288 caracteres, 162 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
"""
#!/usr/bin/env python3
"""
Genera/Forza imágenes hero para TODOS los artículos usando fotos stock por categoría.

Uso:
  python tools/stockify_images.py [--only-missing] [--min-bytes 1000] [--force] [--filter TEXT]

Por defecto actúa en todos los posts de content/blog. Con --force, sobreescribe
imágenes existentes; con --only-missing (default), solo crea las que faltan o son pequeñas.
"""

from __future__ import annotations

from pathlib import Path
import argparse
import re
from typing import Optional, Tuple

from PIL import Image, ImageOps
import hashlib

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content" / "blog"
IMAGES_DIR = ROOT / "public" / "images" / "blog"
STOCK_DIR = ROOT / "public" / "images" / "proyectos"


def parse_frontmatter(p: Path) -> tuple[str, str, Optional[str]]:
    text = p.read_text(encoding="utf-8", errors="replace")
    if not text.startswith("---"):
        slug = p.stem
        title = slug.replace('-', ' ')
        return slug, title, None
    parts = text.split("---", 2)
    if len(parts) < 3:
        slug = p.stem
        title = slug.replace('-', ' ')
        return slug, title, None
    fm = parts[1]
    def _field(key: str) -> Optional[str]:
        m = re.search(rf"^{key}:\s*(.+)$", fm, re.MULTILINE)
        if not m:
            return None
        v = m.group(1).strip().strip("'\"")
        return v
    slug = _field('slug') or p.stem
    title = _field('title') or slug.replace('-', ' ')
    category = _field('category') or 'General'
    return slug, title, category


def stock_list_for_category(category: Optional[str]) -> list[Path]:
    # Múltiples imágenes por categoría para evitar repetición visual
    mapping: dict[str, list[str]] = {
        'Seguridad': [
            'CCTV.jpeg',
            'seguridad_red.jpeg',
            'racks.jpeg',
        ],
        'Electricidad': [
            'electricidad.jpeg',
            'electricidad1.jpeg',
        ],
        'Informática': [
            'servers.jpeg',
            'server_backup.jpeg',
            'ordenadores.jpeg',
            'portatiles.jpeg',
            'impresoras.jpeg',
            'racks.jpeg',
        ],
        'Informatica': [  # fallback por si la tilde varía en frontmatter
            'servers.jpeg',
            'server_backup.jpeg',
            'ordenadores.jpeg',
            'portatiles.jpeg',
            'impresoras.jpeg',
            'racks.jpeg',
        ],
        'Sonido': [
            'sonido.jpeg',
            'auditorio.jpeg',
        ],
        'General': [
            'CCTV.jpeg',
            'servers.jpeg',
            'electricidad.jpeg',
            'sonido.jpeg',
            'seguridad_red.jpeg',
        ],
    }
    key = (category or 'General').strip()
    names = mapping.get(key) or mapping['General']
    paths = [STOCK_DIR / n for n in names if (STOCK_DIR / n).exists()]
    # si ninguna existe, usar cualquier archivo del directorio como último recurso
    if not paths:
        paths = list(STOCK_DIR.glob('*.*'))
    return paths


def pick_stock_for_slug(category: Optional[str], slug: str) -> Optional[Path]:
    items = stock_list_for_category(category)
    if not items:
        return None
    h = hashlib.sha1(slug.encode('utf-8')).hexdigest()
    idx = int(h, 16) % len(items)
    return items[idx]


def save_cover_webp(src: Path, dst: Path, size=(1920, 1080), quality=85):
    dst.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        out = ImageOps.fit(im, size, method=Image.Resampling.LANCZOS)
        out.save(dst, format='WEBP', quality=quality, method=6)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--only-missing', dest='only_missing', action='store_true', help='Solo crear si falta o es pequeña')
    ap.add_argument('--min-bytes', type=int, default=1000, help='Tamaño mínimo válido')
    ap.add_argument('--force', action='store_true', help='Sobrescribir siempre')
    ap.add_argument('--filter', type=str, default=None, help='Procesar solo slugs/títulos que contengan este texto')
    args = ap.parse_args()

    mdx_files = sorted(CONTENT_DIR.glob('*.mdx'))
    created = 0
    skipped = 0
    candidates = 0

    for p in mdx_files:
        slug, title, category = parse_frontmatter(p)
        if args.filter and (args.filter.lower() not in (slug + ' ' + title).lower()):
            continue
        stock = pick_stock_for_slug(category, slug)
        if not stock:
            skipped += 1
            continue
        out = IMAGES_DIR / slug / f"{slug}-hero-001.webp"
        size = out.stat().st_size if out.exists() else 0
        needs = args.force or (not out.exists()) or (size < args.min_bytes)
        if args.only_missing and not needs:
            skipped += 1
            continue
        candidates += 1
        try:
            save_cover_webp(stock, out)
            out_size = out.stat().st_size
            print(f"[OK] {slug} -> {out.relative_to(ROOT)} ({out_size} bytes)")
            created += 1
        except Exception as e:
            print(f"[ERR] {slug}: {e}")

    print("\nResumen:")
    print(f"  Candidatos: {candidates}")
    print(f"  Creados:    {created}")
    print(f"  Omitidos:   {skipped}")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
