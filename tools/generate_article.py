#!/usr/bin/env python3
"""
Generador de artículos + imágenes para el blog.

Uso rápido:
  GEMINI_API_KEY=... OPENAI_API_KEY=... \
  python tools/generate_article.py --topic "Cámara en directo en Santo Domingo de Silos" \
    --style fotografico --accent azul \
    --details "plano general del pueblo, entorno montañoso"

Requisitos:
  pip install --upgrade google-genai openai pyyaml python-slugify

Produce:
  - content/blog/<slug>.mdx
  - public/images/blog/<slug>/<slug>-hero-001.<ext> (y más si procede)
"""

import argparse
import base64
import datetime as dt
import json
import mimetypes
import os
from pathlib import Path
from typing import List, Tuple

import yaml
from slugify import slugify

try:
    from google import genai
    from google.genai import types as gem_types
except Exception as e:  # pragma: no cover
    genai = None
    gem_types = None

try:
    from openai import OpenAI
except Exception:
    OpenAI = None


ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content" / "blog"
IMAGES_DIR = ROOT / "public" / "images" / "blog"
CONTENT_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)


def unique_image_path(base_dir: Path, slug: str, stem: str = "hero") -> Path:
    base_dir.mkdir(parents=True, exist_ok=True)
    idx = 1
    while True:
        candidate = base_dir / f"{slug}-{stem}-{idx:03d}"
        # La extensión la añadimos después al conocer mime_type
        # Para evitar colisiones cuando haya varios formatos, miramos cualquier ext conocida
        if not any(candidate.with_suffix(ext).exists() for ext in [".png", ".jpg", ".jpeg", ".webp"]):
            return candidate
        idx += 1


def save_inline_image(target_stem: Path, mime: str, data_b64: str) -> Path:
    ext = mimetypes.guess_extension(mime or "") or ".png"
    out_path = target_stem.with_suffix(ext)
    out_path.write_bytes(base64.b64decode(data_b64))
    return out_path


def gen_images_with_gemini(prompt: str, slug: str, how_many: int = 1) -> List[Path]:
    api = os.environ.get("GEMINI_API_KEY")
    if not api:
        raise RuntimeError("Falta GEMINI_API_KEY en el entorno")
    if genai is None:
        raise RuntimeError("Falta dependencia: google-genai. Ejecuta: pip install google-genai")

    try:
        client = genai.Client(api_key=api)
        # Algunos tenants no tienen habilitado el modelo de preview; probamos con ambos
        candidate_models = [
            "gemini-2.5-flash-image-preview",
            "gemini-1.5-flash",
        ]
        model = candidate_models[0]

        contents = [
            gem_types.Content(
                role="user",
                parts=[gem_types.Part.from_text(text=prompt)],
            )
        ]
        config = gem_types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"])

        images: List[Path] = []
        target_dir = IMAGES_DIR / slug
        target_dir.mkdir(parents=True, exist_ok=True)

        for m in candidate_models:
            try:
                for chunk in client.models.generate_content_stream(model=m, contents=contents, config=config):
                    if not chunk.candidates or not chunk.candidates[0].content:
                        continue
                    for part in (chunk.candidates[0].content.parts or []):
                        inline = getattr(part, "inline_data", None)
                        if inline and getattr(inline, "data", None):
                            stem = unique_image_path(target_dir, slug, stem="hero")
                            out_path = save_inline_image(stem, inline.mime_type, inline.data)
                            images.append(out_path)
                            if len(images) >= how_many:
                                return images
            except Exception:
                # Intentamos con el siguiente modelo
                continue
        return images
    except Exception as e:
        print(f"[WARN] Generación de imágenes falló: {e}")
        return []


def mdx_frontmatter(**kwargs) -> str:
    data = {k: v for k, v in kwargs.items() if v is not None}
    return "---\n" + yaml.safe_dump(data, allow_unicode=True, sort_keys=False) + "---\n\n"


def gen_article_with_openai(topic: str, category: str | None) -> Tuple[str, str]:
    """Devuelve (title, mdx_body) sin frontmatter."""
    api = os.environ.get("OPENAI_API_KEY")
    if not api:
        raise RuntimeError("Falta OPENAI_API_KEY en el entorno")
    if OpenAI is None:
        raise RuntimeError("Falta dependencia: openai. Ejecuta: pip install openai")

    client = OpenAI(api_key=api)

    system = (
        "Eres un redactor técnico senior. Escribe artículos con estructura SEO,"
        " tono claro, E-E-A-T, listas, subtítulos H2/H3, y ejemplos prácticos."
        " Salida en Markdown puro, sin frontmatter. No inventes datos sensibles."
    )

    user = (
        f"Tema: {topic}. Categoría sugerida: {category or 'General'}."
        " Público objetivo: empresas y ayuntamientos en Burgos."
        " Incluye una introducción breve, 4-6 secciones con H2, y un cierre con CTA suave."
    )

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=0.7,
        )
        text = completion.choices[0].message.content or ""
    except Exception as e:
        print(f"[WARN] OpenAI falló, uso plantilla local: {e}")
        text = (
            f"# {topic}\n\n"
            "## Introducción\n\nResumen del tema con enfoque práctico y profesional.\n\n"
            "## Puntos clave\n\n- Requisito 1\n- Requisito 2\n- Requisito 3\n\n"
            "## Implantación\n\nPasos recomendados.\n\n"
            "## Mantenimiento\n\nBuenas prácticas y periodicidad.\n\n"
            "## Conclusión\n\nCTA suave orientado a contacto profesional.\n"
        )

    # Primer encabezado como título si existe
    title = topic
    for line in text.splitlines():
        if line.strip().startswith("# "):
            title = line.strip().lstrip("# ").strip()
            break
    return title, text


def main():
    parser = argparse.ArgumentParser(description="Genera un artículo y sus imágenes")
    parser.add_argument("--topic", required=True, help="Tema del artículo")
    parser.add_argument("--style", default="fotográfico", help="Estilo de la imagen (fotográfico/minimalista/...) ")
    parser.add_argument("--accent", default="azul", help="Color acento para la paleta")
    parser.add_argument("--details", default="", help="Detalles clave para la imagen")
    parser.add_argument("--category", default=None, help="Categoría del post")
    parser.add_argument("--images", type=int, default=1, help="Número de imágenes a generar")
    args = parser.parse_args()

    topic = args.topic.strip()
    slug = slugify(topic)[:80]
    today = dt.date.today().isoformat()

    # 1) Generar artículo (texto)
    title, body_md = gen_article_with_openai(topic, args.category)

    # 2) Generar imágenes con Gemini
    prompt = (
        f"Genera una ilustración/fotografía digital para un artículo web sobre {topic}.\n"
        f"- Estilo: {args.style}\n"
        "- Formato: 16:9, pensado para encabezado de blog\n"
        "- Fondo: limpio, profesional, sin texto ni marcas de agua\n"
        f"- Paleta: colores neutros con acento en {args.accent}\n"
        f"- Elementos clave: {args.details or 'elementos del tema de forma clara y profesional'}\n"
        "- Uso final: imagen hero para web, debe ser clara y atractiva"
    )

    images = gen_images_with_gemini(prompt, slug, how_many=max(1, args.images))
    image_path = "/images/blog/{}/{}".format(slug, images[0].name) if images else "/images/blog/placeholder-16x9.svg"

    # 3) Crear MDX con frontmatter + cuerpo
    post_path = CONTENT_DIR / f"{slug}.mdx"
    fm = mdx_frontmatter(
        title=title,
        description=f"{title} — artículo técnico",  # se puede editar
        date=today,
        slug=slug,
        category=args.category or "General",
        image=image_path,
    )
    post_path.write_text(fm + body_md, encoding="utf-8")
    print(f"Artículo guardado en: {post_path}")
    if images:
        print("Imágenes:")
        for p in images:
            print(" -", p)
    else:
        print("[INFO] No se generaron imágenes; se usó un placeholder.")


if __name__ == "__main__":
    main()
