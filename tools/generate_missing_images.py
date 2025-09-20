<<<<<<< HEAD
=======
"""
Resumen generado automáticamente.

tools/generate_missing_images.py

2025-09-13T06:20:07.390Z

——————————————————————————————
Archivo .py: generate_missing_images.py
Tamaño: 5278 caracteres, 169 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
"""
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
#!/usr/bin/env python3
"""
Generate placeholder hero images for blog posts when the image is missing
or too small, using the local placeholder generator (no external APIs).

Quick usage:
  python tools/generate_missing_images.py --only-missing --min-bytes 1000
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import Optional, Tuple

import re
import sys

try:
    import yaml  # type: ignore
except Exception:
    print("[ERR] PyYAML not installed. Run: pip install pyyaml", file=sys.stderr)
    raise

# Import placeholder generator
ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT / "tools"))
try:
    from generate_placeholder_image import create_placeholder_image  # type: ignore
except Exception:
    print("[ERR] Could not import generate_placeholder_image.\n"
          "Make sure Pillow is installed: pip install Pillow", file=sys.stderr)
    raise


IMAGES_DIR = ROOT / "public" / "images" / "blog"
CONTENT_DIR = ROOT / "content" / "blog"


@dataclass
class Article:
    path: Path
    title: str
    slug: str
    image_path: Optional[str]


def parse_frontmatter(p: Path) -> Article:
    text = p.read_text(encoding="utf-8", errors="replace")
    if not text.startswith("---"):
        # No frontmatter; fall back to filename heuristics
        return Article(path=p, title=p.stem.replace("-", " "), slug=p.stem, image_path=None)

    parts = text.split("---", 2)
    if len(parts) < 3:
        return Article(path=p, title=p.stem.replace("-", " "), slug=p.stem, image_path=None)
    fm_raw = parts[1]

    # Normalize common smart quotes
    fm_norm = (fm_raw
               .replace('\u2018', "'")
               .replace('\u2019', "'")
               .replace('\u201c', '"')
               .replace('\u201d', '"'))

    title = None
    slug = None
    image = None

    try:
        data = yaml.safe_load(fm_norm)
        if isinstance(data, dict):
            title = data.get("title")
            slug = data.get("slug")
            image = data.get("image")
    except Exception:
        pass

    # Regex fallbacks
    if title is None:
        m = re.search(r"^title:\s*(.+)$", fm_norm, re.MULTILINE)
        if m:
            title = m.group(1).strip().strip("'\"")
    if slug is None:
        m = re.search(r"^slug:\s*([\w\-]+)$", fm_norm, re.MULTILINE)
        slug = m.group(1).strip() if m else p.stem
    if image is None:
        m = re.search(r"^image:\s*(.+)$", fm_norm, re.MULTILINE)
        if m:
            image = m.group(1).strip().strip("'\"")

    return Article(
        path=p,
        title=(title or p.stem.replace("-", " ")),
        slug=(slug or p.stem),
        image_path=image,
    )


def target_from_image_field(image_path: Optional[str], fallback_slug: str) -> Tuple[str, Path]:
    """Return (dir_slug, target_image_path)."""
    if image_path and "/images/blog/" in image_path:
        try:
            parts = image_path.split("/images/blog/")[1].split("/")
            dir_slug = parts[0]
            filename = f"{dir_slug}-hero-001.webp"
            return dir_slug, IMAGES_DIR / dir_slug / filename
        except Exception:
            pass
    dir_slug = fallback_slug
    filename = f"{dir_slug}-hero-001.webp"
    return dir_slug, IMAGES_DIR / dir_slug / filename


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only-missing", dest="only_missing", action="store_true", default=True,
                    help="Generate only if missing or too small (default)")
    ap.add_argument("--min-bytes", type=int, default=1000,
                    help="Minimum valid size in bytes (default: 1000)")
    ap.add_argument("--dry-run", action="store_true", help="Report only, do not write")
    ap.add_argument("--filter", type=str, default=None,
                    help="Process only articles whose slug or title contains this text")
    args = ap.parse_args()

    mdx_files = sorted(CONTENT_DIR.glob("*.mdx"))
    created = 0
    skipped = 0
    candidates = 0

    for p in mdx_files:
        art = parse_frontmatter(p)
        if args.filter:
            key = (art.slug + " " + art.title).lower()
            if args.filter.lower() not in key:
                continue

        dir_slug, target = target_from_image_field(art.image_path, art.slug)
        size = target.stat().st_size if target.exists() else 0
        needs = (not target.exists()) or (size < args.min_bytes)

        if args.only_missing and not needs:
            skipped += 1
            continue

        candidates += 1
        print(f"[GEN] {art.path.name} -> {target.relative_to(ROOT)}")
        if args.dry_run:
            continue
        try:
            target.parent.mkdir(parents=True, exist_ok=True)
            out = create_placeholder_image(dir_slug, art.title)
            out_size = out.stat().st_size if out.exists() else 0
            print(f"   created: {out.relative_to(ROOT)} ({out_size} bytes)")
            created += 1
        except Exception as e:
            print(f"   error: {e}")

    print("\nSummary:")
    print(f"  Candidates: {candidates}")
    print(f"  Created:    {created}")
    print(f"  Skipped:    {skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
