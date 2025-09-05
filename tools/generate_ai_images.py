#!/usr/bin/env python3
"""
Generate AI hero images for existing blog posts using Google Gemini only.

For each content/blog/*.mdx, read frontmatter (title, slug, category),
build an image prompt, and create a 16:9 WEBP hero image at:
  public/images/blog/{slug}/{slug}-hero-001.webp

Provider:
  - Google Gemini (GEMINI_API_KEY)

Usage examples:
  python tools/generate_ai_images.py --only-missing --min-bytes 1000
  python tools/generate_ai_images.py --filter videovigilancia --force
"""

from __future__ import annotations

import argparse
import base64
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Optional, List

import requests
from PIL import Image

# Gemini (Google) SDK
try:
    from google import genai  # type: ignore
    from google.genai import types as gem_types  # type: ignore
except Exception:  # pragma: no cover
    genai = None
    gem_types = None

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content" / "blog"
IMAGES_DIR = ROOT / "public" / "images" / "blog"


@dataclass
class Post:
    path: Path
    slug: str
    title: str
    category: str
    image_field: Optional[str]


def parse_frontmatter(p: Path) -> Post:
    text = p.read_text(encoding="utf-8", errors="replace")
    slug = p.stem
    title = slug.replace("-", " ")
    category = "General"
    image = None
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            fm = parts[1]
            def _field(k: str) -> Optional[str]:
                m = re.search(rf"^{k}:\s*(.+)$", fm, re.MULTILINE)
                if not m:
                    return None
                v = m.group(1).strip().strip("'\"")
                return v
            slug = _field('slug') or slug
            title = _field('title') or title
            category = _field('category') or category
            image = _field('image')
    return Post(path=p, slug=slug, title=title, category=category, image_field=image)


def ensure_dir(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def to_webp(src_png: Path, dst_webp: Path, quality: int = 85) -> None:
    with Image.open(src_png) as im:
        im.save(dst_webp, format="WEBP", quality=quality, method=6)


def target_path_for(post: Post) -> Path:
    # Always normalize to blog/{slug}/{slug}-hero-001.webp
    return IMAGES_DIR / post.slug / f"{post.slug}-hero-001.webp"


def build_prompt(post: Post, style: str, accent: str) -> str:
    # Short, provider-agnostic prompt
    return (
        f"Professional 16:9 hero photograph for a technical blog article.\n"
        f"Topic: {post.title}. Category: {post.category}.\n"
        f"Style: {style}. Realistic, modern, clean composition, depth of field, no text or logos."
    )


def gen_with_gemini(prompt: str, n: int = 1) -> List[bytes]:
    """Generate images using Google Gemini via google-genai SDK."""
    api = os.environ.get("GEMINI_API_KEY")
    if not api or genai is None or gem_types is None:
        return []

    client = genai.Client(api_key=api)
    models = [
        "gemini-2.5-flash-image-preview",
        "gemini-1.5-flash",
    ]
    cfg = gem_types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"])  # type: ignore
    contents = [gem_types.Content(role="user", parts=[gem_types.Part.from_text(text=prompt)])]

    out: List[bytes] = []
    for model in models:
        try:
            # Streaming to capture multiple inline images if present
            for chunk in client.models.generate_content_stream(model=model, contents=contents, config=cfg):  # type: ignore
                cand = getattr(chunk, "candidates", None)
                if not cand:
                    continue
                content = cand[0].content if cand[0] else None
                parts = getattr(content, "parts", None)
                if not parts:
                    continue
                for part in parts:
                    inline = getattr(part, "inline_data", None)
                    data = getattr(inline, "data", None)
                    if data:
                        # google-genai may already provide bytes; ensure bytes
                        if isinstance(data, str):
                            try:
                                out.append(base64.b64decode(data))
                            except Exception:
                                pass
                        elif isinstance(data, (bytes, bytearray)):
                            out.append(bytes(data))
                        if len(out) >= n:
                            return out
            # Non-streaming fallback
            if len(out) < n:
                resp = client.models.generate_content(model=model, contents=contents, config=cfg)  # type: ignore
                cand = getattr(resp, "candidates", None)
                if cand:
                    content = cand[0].content if cand[0] else None
                    parts = getattr(content, "parts", None)
                    if parts:
                        for part in parts:
                            inline = getattr(part, "inline_data", None)
                            data = getattr(inline, "data", None)
                            if data:
                                if isinstance(data, str):
                                    try:
                                        out.append(base64.b64decode(data))
                                    except Exception:
                                        pass
                                elif isinstance(data, (bytes, bytearray)):
                                    out.append(bytes(data))
                                if len(out) >= n:
                                    return out
        except Exception as e:  # pragma: no cover
            print(f"[WARN] Gemini generation failed with model {model}: {e}")
            continue
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--only-missing', dest='only_missing', action='store_true', help='Only if missing or small')
    ap.add_argument('--min-bytes', type=int, default=1000)
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--filter', type=str, default=None)
    ap.add_argument('--style', type=str, default='photographic')
    ap.add_argument('--accent', type=str, default='blue')
    ap.add_argument('--n', type=int, default=1)
    args = ap.parse_args()

    posts = [parse_frontmatter(p) for p in sorted(CONTENT_DIR.glob('*.mdx'))]
    created = 0
    skipped = 0
    candidates = 0

    for post in posts:
        if args.filter:
            key = (post.slug + ' ' + post.title).lower()
            if args.filter.lower() not in key:
                continue
        dst = target_path_for(post)
        size = dst.stat().st_size if dst.exists() else 0
        needs = args.force or (not dst.exists()) or (size < args.min_bytes)
        if args.only_missing and not needs:
            skipped += 1
            continue

        candidates += 1
        prompt = build_prompt(post, args.style, args.accent)
        # Use Google Gemini only
        images = gen_with_gemini(prompt, n=args.n)
        if not images:
            print(f"[ERR] Gemini did not return image(s) for: {post.slug}")
            continue

        # Save the first image as WEBP hero
        tmp_png = dst.with_suffix('.png')
        try:
            ensure_dir(dst)
            tmp_png.write_bytes(images[0])
            to_webp(tmp_png, dst, quality=85)
            try:
                tmp_png.unlink(missing_ok=True)
            except Exception:
                pass
            out_size = dst.stat().st_size if dst.exists() else 0
            print(f"[OK] {post.slug} -> {dst.relative_to(ROOT)} ({out_size} bytes)")
            created += 1
        except Exception as e:
            print(f"[ERR] Failed saving image for {post.slug}: {e}")

    print("\nSummary:")
    print(f"  Candidates: {candidates}")
    print(f"  Created:    {created}")
    print(f"  Skipped:    {skipped}")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
