#!/usr/bin/env python3
"""
Busca imágenes libres en Wikimedia Commons para cada artículo del blog
y actualiza el frontmatter con la ruta local, alt y créditos.

Uso:
  python tools/fill_images_commons.py --force   # reemplaza imágenes existentes
  python tools/fill_images_commons.py --limit 5 # procesa solo 5 artículos

Requisitos: requests, pyyaml, Pillow
"""
from __future__ import annotations

import argparse
import io
import json
import mimetypes
import re
from pathlib import Path
from typing import Dict, Tuple

import requests
import yaml
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "content" / "blog"
IMG_BASE = ROOT / "public" / "images" / "blog"
API = "https://commons.wikimedia.org/w/api.php"

ALLOWED_LICENSES = {
    "cc-zero",
    "cc-by",
    "cc-by-sa",
    "public domain",
}


def parse_frontmatter(text: str) -> Tuple[Dict, str]:
    if not text.startswith("---\n"):
        return {}, text
    parts = text.split("\n---\n", 1)
    if len(parts) != 2:
        return {}, text
    fm_text = parts[0].replace("---\n", "", 1)
    body = parts[1]
    data = yaml.safe_load(fm_text) or {}
    return data, body


def dump_frontmatter(data: Dict) -> str:
    return "---\n" + yaml.safe_dump(data, allow_unicode=True, sort_keys=False) + "---\n\n"


def normalize_slug(name: str) -> str:
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = s.strip("-")
    return s[:80]


def search_commons(query: str) -> Dict:
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": query,
        "gsrlimit": 10,
        "prop": "imageinfo",
        "iiprop": "url|mime|extmetadata",
        "iiurlwidth": 1920,
    }
    r = requests.get(API, params=params, timeout=20)
    r.raise_for_status()
    return r.json()


def pick_image(resp: Dict) -> Dict | None:
    pages = (resp.get("query", {}).get("pages", {}) or {}).values()
    for p in pages:
        infos = p.get("imageinfo") or []
        if not infos:
            continue
        info = infos[0]
        extmeta = info.get("extmetadata") or {}
        # Normaliza claves
        def val(key):
            v = extmeta.get(key, {}).get("value")
            return (v or "").strip().lower()

        license_code = val("LicenseShortName") or val("License")
        usage_terms = val("UsageTerms")
        # Excluir NC/ND
        if "noncommercial" in usage_terms or "noderivatives" in usage_terms:
            continue
        if not any(code in license_code for code in ALLOWED_LICENSES):
            continue
        return {
            "title": p.get("title"),
            "thumburl": info.get("thumburl") or info.get("url"),
            "mime": info.get("mime"),
            "descriptionurl": info.get("descriptionurl") or info.get("url"),
            "artist": extmeta.get("Artist", {}).get("value"),
            "license": extmeta.get("LicenseShortName", {}).get("value"),
        }
    return None


def download_to_webp(url: str, dst_base: Path) -> Path:
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    # Intentamos deducir formato
    mime = r.headers.get("Content-Type", "image/jpeg")
    if not mime.startswith("image/"):
        mime = "image/jpeg"
    # Convertimos a WEBP con recorte 16:9
    im = Image.open(io.BytesIO(r.content))
    fitted = ImageOps.fit(im, (1920, 1080), method=Image.LANCZOS, centering=(0.5, 0.5))
    out = dst_base.with_suffix(".webp")
    out.parent.mkdir(parents=True, exist_ok=True)
    fitted.save(out, format="WEBP", quality=85, method=6)
    return out


def process_article(path: Path, force: bool = False) -> bool:
    text = path.read_text(encoding="utf-8")
    fm, body = parse_frontmatter(text)
    slug = fm.get("slug") or normalize_slug(path.stem)
    img_rel = fm.get("image")
    if img_rel and not force:
        return False

    topic = fm.get("title") or slug.replace("-", " ")
    # Consultas específicas por categoría para mejorar resultados
    cat = (fm.get("category") or "").lower()
    extra = ""
    if cat == "seguridad":
        extra = " CCTV IP retail shop"
    elif cat == "informática" or cat == "informatica":
        extra = " network rack switches PoE"
    elif cat == "sonido":
        extra = " professional audio event"
    elif cat == "electricidad":
        extra = " electrical panel"

    query = f"{topic} {extra}".strip()
    resp = search_commons(query)
    pick = pick_image(resp)
    if not pick:
        # Segundo intento, sin extra
        resp = search_commons(topic)
        pick = pick_image(resp)
    if not pick:
        return False

    dst_dir = IMG_BASE / slug
    base = dst_dir / f"{slug}-hero-commons"
    out = download_to_webp(pick["thumburl"], base)
    rel = "/images/blog/{}/{}".format(slug, out.name)

    # Actualiza frontmatter
    fm["image"] = rel
    fm.setdefault("imageAlt", topic)
    fm["imageCreditText"] = (pick.get("artist") or "Wikimedia Commons") + f" ({pick.get('license') or ''})"
    fm["imageCreditUrl"] = pick.get("descriptionurl")

    new_text = dump_frontmatter(fm) + body
    path.write_text(new_text, encoding="utf-8")
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="Reemplaza imágenes existentes")
    ap.add_argument("--limit", type=int, default=0, help="Máximo de artículos a procesar")
    args = ap.parse_args()

    processed = 0
    for mdx in sorted(BLOG_DIR.glob("*.mdx")):
        if args.limit and processed >= args.limit:
            break
        changed = process_article(mdx, force=args.force)
        if changed:
            processed += 1
            print(f"[OK] Imagen añadida: {mdx.name}")
        else:
            print(f"[SKIP] {mdx.name}")
    print(f"Hecho. Artículos procesados: {processed}")


if __name__ == "__main__":
    main()

