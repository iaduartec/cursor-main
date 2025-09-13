"""
Resumen generado automáticamente.

tools/generate_article.py

2025-09-13T06:20:07.389Z

——————————————————————————————
Archivo .py: generate_article.py
Tamaño: 7072 caracteres, 195 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
"""
#!/usr/bin/env python3
"""
Generador de artículos (solo texto) para el blog.

Ahora la creación de imágenes se ejecuta en CI (GitHub Actions) mediante
`.github/workflows/generate-article.yml`, que llama a `tools/generate_ai_images.py`.

Este script:
- Genera el contenido del artículo (Markdown) usando OpenAI o Gemini (fallback).
- Escribe el MDX con frontmatter completo apuntando a la ruta esperada de la imagen hero:
  /images/blog/<slug>/<slug>-hero-001.webp

Requisitos (se usan solo para generar texto):
  pip install --upgrade google-genai openai pyyaml python-slugify

Uso rápido:
  GEMINI_API_KEY=... OPENAI_API_KEY=... \
  python tools/generate_article.py --topic "Cámara en directo en Santo Domingo de Silos" \
    --style fotografico --accent azul --details "plano general del pueblo"
"""

from __future__ import annotations

import argparse
import datetime as dt
import os
from pathlib import Path
from typing import Tuple

import yaml
from slugify import slugify

# SDKs opcionales (solo texto)
try:
    from openai import OpenAI  # type: ignore
except Exception:
    OpenAI = None  # type: ignore

try:
    from google import genai  # type: ignore
    from google.genai import types as gem_types  # type: ignore
except Exception:
    genai = None  # type: ignore
    gem_types = None  # type: ignore


ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content" / "blog"
CONTENT_DIR.mkdir(parents=True, exist_ok=True)


def mdx_frontmatter(**kwargs) -> str:
    data = {k: v for k, v in kwargs.items() if v is not None}
    return "---\n" + yaml.safe_dump(data, allow_unicode=True, sort_keys=False) + "---\n\n"


def gen_article_with_openai(topic: str, category: str | None) -> Tuple[str, str]:
    """Devuelve (title, mdx_body) sin frontmatter."""
    api = os.environ.get("OPENAI_API_KEY")
    if not api or OpenAI is None:
        raise RuntimeError("OPENAI_API_KEY no disponible o SDK no instalado")

    client = OpenAI(api_key=api)

    system = (
        "Eres un redactor técnico senior. Escribe artículos con estructura SEO,"
        " tono claro, E-E-A-T, listas, subtítulos H2/H3 y ejemplos prácticos."
        " Salida en Markdown puro, sin frontmatter. No inventes datos sensibles."
    )

    user = (
        f"Tema: {topic}. Categoría sugerida: {category or 'General'}."
        " Público objetivo: empresas y ayuntamientos en Burgos."
        " Incluye introducción breve, 4-6 secciones con H2 y un cierre con CTA suave."
    )

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.7,
    )
    text = completion.choices[0].message.content or ""

    # Primer encabezado como título si existe
    title = topic
    for line in text.splitlines():
        if line.strip().startswith("# "):
            title = line.strip().lstrip("# ").strip()
            break
    return title, text


def gen_article_with_gemini(topic: str, category: str | None) -> Tuple[str, str]:
    if genai is None or gem_types is None:
        raise RuntimeError("google-genai no disponible")
    api = os.environ.get("GEMINI_API_KEY")
    if not api:
        raise RuntimeError("GEMINI_API_KEY no disponible")

    client = genai.Client(api_key=api)
    model = "gemini-1.5-flash"
    contents = [
        gem_types.Content(
            role="user",
            parts=[gem_types.Part.from_text(text=(
                "Eres redactor técnico senior. Escribe en Markdown un artículo optimizado para SEO,"
                " con H2/H3, listas y tono profesional. No añadas frontmatter.\n\n"
                f"Tema: {topic}. Categoría sugerida: {category or 'General'}."
            ))],
        )
    ]
    config = gem_types.GenerateContentConfig(response_modalities=["TEXT"])  # type: ignore
    resp = client.models.generate_content(model=model, contents=contents, config=config)  # type: ignore

    # Extraer texto
    text = ""
    try:
        text = getattr(resp, "text", None) or ""
        if not text:
            cand = getattr(resp, "candidates", None)
            if cand:
                parts = getattr(cand[0].content, "parts", [])
                text = "".join([getattr(p, "text", "") for p in parts])
    except Exception:
        text = ""
    if not text.strip():
        raise RuntimeError("Gemini devolvió texto vacío")

    title = topic
    for line in text.splitlines():
        if line.strip().startswith("# "):
            title = line.strip().lstrip("# ").strip()
            break
    return title, text


def main() -> int:
    parser = argparse.ArgumentParser(description="Genera un artículo (texto) y frontmatter")
    parser.add_argument("--topic", required=True, help="Tema del artículo")
    parser.add_argument("--style", default="fotográfico", help="Estilo deseado (solo informativo para imagen)")
    parser.add_argument("--accent", default="azul", help="Color acento (solo informativo para imagen)")
    parser.add_argument("--details", default="", help="Detalles clave (solo informativo para imagen)")
    parser.add_argument("--category", default=None, help="Categoría del post")
    parser.add_argument("--images", type=int, default=1, help="(Ignorado) número de imágenes")
    args = parser.parse_args()

    topic = args.topic.strip()
    slug = slugify(topic)[:80]
    today = dt.date.today().isoformat()

    # 1) Generar artículo (texto) con fallback OpenAI -> Gemini -> plantilla
    try:
        title, body_md = gen_article_with_openai(topic, args.category)
    except Exception as e1:
        print(f"[WARN] OpenAI texto falló: {e1}. Intento con Gemini...")
        try:
            title, body_md = gen_article_with_gemini(topic, args.category)
        except Exception as e2:
            print(f"[WARN] Gemini texto también falló: {e2}. Uso plantilla local.")
            body_md = (
                f"# {topic}\n\n"
                "## Introducción\n\nResumen del tema con enfoque práctico y profesional.\n\n"
                "## Puntos clave\n\n- Requisito 1\n- Requisito 2\n- Requisito 3\n\n"
                "## Implantación\n\nPasos recomendados.\n\n"
                "## Mantenimiento\n\nBuenas prácticas y periodicidad.\n\n"
                "## Conclusión\n\nCTA suave orientado a contacto profesional.\n"
            )
            title = topic

    # 2) La generación de imágenes la hace CI. Ruta esperada para la hero
    image_path = f"/images/blog/{slug}/{slug}-hero-001.webp"

    # 3) Crear MDX con frontmatter + cuerpo
    post_path = CONTENT_DIR / f"{slug}.mdx"
    fm = mdx_frontmatter(
        title=title,
        description=f"{title} — artículo técnico",  # editable
        date=today,
        slug=slug,
        category=args.category or "General",
        image=image_path,
    )
    post_path.write_text(fm + body_md, encoding="utf-8")
    print(f"Artículo guardado en: {post_path}")
    print(f"Imagen esperada: {image_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

