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
import requests

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


def convert_to_webp(src: Path, quality: int = 85) -> Path | None:
    """Convierte una imagen a WEBP y devuelve la ruta nueva. Si falla, devuelve None.
    Mantiene el nombre base y cambia la extensión a .webp. Elimina el original si la conversión tiene éxito.
    """
    try:
        from PIL import Image
        dst = src.with_suffix(".webp")
        # Evitar reconvertir si ya es .webp
        if src.suffix.lower() == ".webp":
            return src
        with Image.open(src) as im:
            im.save(dst, format="WEBP", quality=quality, method=6)
        try:
            src.unlink(missing_ok=True)
        except Exception:
            pass
        return dst
    except Exception as e:
        print(f"[WARN] Conversión a WEBP falló para {src.name}: {e}")
        return None


def _extract_gemini_text(resp) -> str:
    try:
        # Muchos SDK exponen resp.text directo
        if getattr(resp, "text", None):
            return resp.text
        # Alternativamente, a través de candidates/parts
        cand = resp.candidates[0]
        parts = getattr(cand.content, "parts", [])
        buf = []
        for p in parts:
            t = getattr(p, "text", None)
            if t:
                buf.append(t)
        return "".join(buf)
    except Exception:
        return ""


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
                print(f"[INFO] Intentando con modelo: {m}")
                for chunk in client.models.generate_content_stream(model=m, contents=contents, config=config):
                    if not chunk.candidates or not chunk.candidates[0].content:
                        continue
                    for part in (chunk.candidates[0].content.parts or []):
                        inline = getattr(part, "inline_data", None)
                        if inline and getattr(inline, "data", None):
                            stem = unique_image_path(target_dir, slug, stem="hero")
                            out_path = save_inline_image(stem, inline.mime_type, inline.data)
                            
                            # Verificar que la imagen se guardó correctamente
                            if out_path.exists() and out_path.stat().st_size > 1000:
                                images.append(out_path)
                                print(f"[INFO] Imagen generada: {out_path.name} ({out_path.stat().st_size} bytes)")
                                if len(images) >= how_many:
                                    return images
                            else:
                                print(f"[WARN] Imagen inválida generada: {out_path}")
            except Exception as e:
                print(f"[WARN] Error con modelo {m}: {e}")
                continue
        return images
    except Exception as e:
        print(f"[WARN] Generación de imágenes falló: {e}")
        return []


def gen_images_with_openai(prompt: str, slug: str, how_many: int = 1) -> List[Path]:
    api = os.environ.get("OPENAI_API_KEY")
    if not api or OpenAI is None:
        return []
    try:
        client = OpenAI(api_key=api)
        images: List[Path] = []
        target_dir = (IMAGES_DIR / slug)
        target_dir.mkdir(parents=True, exist_ok=True)
        n = max(1, how_many)
        
        print(f"[INFO] Generando {n} imagen(es) con OpenAI...")
        # gpt-image-1 acepta size tipo 1920x1080 para 16:9
        res = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size="1920x1080",
            n=n,
        )
        
        for i, d in enumerate(res.data):
            b64 = getattr(d, "b64_json", None)
            if not b64:
                print(f"[WARN] Imagen {i+1} sin datos base64")
                continue
            
            try:
                stem = unique_image_path(target_dir, slug, stem="hero")
                out_path = stem.with_suffix(".png")
                image_data = base64.b64decode(b64)
                out_path.write_bytes(image_data)
                
                # Verificar que la imagen se guardó correctamente
                if out_path.exists() and out_path.stat().st_size > 1000:
                    images.append(out_path)
                    print(f"[INFO] Imagen {i+1} generada: {out_path.name} ({out_path.stat().st_size} bytes)")
                else:
                    print(f"[WARN] Imagen {i+1} inválida: {out_path}")
            except Exception as e:
                print(f"[WARN] Error procesando imagen {i+1}: {e}")
        
        return images
    except Exception as e:
        print(f"[WARN] OpenAI imágenes falló: {e}")
        return []


def gen_images_with_kie(prompt: str, slug: str, how_many: int = 1) -> List[Path]:
    """Genera imágenes usando la API externa KIE (https://api.kie.ai).
    Soporta respuestas con 'fileUrl' o campos base64 ('b64', 'b64_json').
    """
    api = os.environ.get("KIE_API_KEY")
    if not api:
        return []
    url = "https://api.kie.ai/api/v1/gpt4o-image/generate"
    images: List[Path] = []
    target_dir = (IMAGES_DIR / slug)
    target_dir.mkdir(parents=True, exist_ok=True)

    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {api}'
    }

    for i in range(max(1, how_many)):
        try:
            payload = {
                'prompt': prompt,
                # usar ratio 16:9 para cabeceras de blog
                'size': '16:9'
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=120)
            resp.raise_for_status()
            j = resp.json()

            # Prefer fileUrl
            file_url = j.get('fileUrl') or (j.get('data') and j.get('data').get('fileUrl'))
            if file_url:
                r2 = requests.get(file_url, timeout=120)
                stem = unique_image_path(target_dir, slug, stem='hero')
                ext = mimetypes.guess_extension(r2.headers.get('content-type', '')) or '.png'
                out_path = stem.with_suffix(ext)
                out_path.write_bytes(r2.content)
                images.append(out_path)
                print(f"[INFO] KIE image downloaded: {out_path.name}")
                continue

            # Try base64 fields
            b64 = j.get('b64') or j.get('b64_json') or (j.get('data') and j.get('data').get('b64'))
            if b64:
                stem = unique_image_path(target_dir, slug, stem='hero')
                out_path = stem.with_suffix('.png')
                out_path.write_bytes(base64.b64decode(b64))
                images.append(out_path)
                print(f"[INFO] KIE image generated: {out_path.name}")
                continue

            # Some responses include an array under 'data'
            data_list = j.get('data') or []
            if isinstance(data_list, list):
                handled = False
                for d in data_list:
                    b = d.get('b64') or d.get('b64_json') or d.get('fileUrl')
                    if not b:
                        continue
                    if d.get('fileUrl'):
                        r2 = requests.get(d.get('fileUrl'), timeout=120)
                        stem = unique_image_path(target_dir, slug, stem='hero')
                        ext = mimetypes.guess_extension(r2.headers.get('content-type', '')) or '.png'
                        out_path = stem.with_suffix(ext)
                        out_path.write_bytes(r2.content)
                        images.append(out_path)
                        handled = True
                        break
                    else:
                        stem = unique_image_path(target_dir, slug, stem='hero')
                        out_path = stem.with_suffix('.png')
                        out_path.write_bytes(base64.b64decode(b))
                        images.append(out_path)
                        handled = True
                        break
                if handled:
                    continue

            print(f"[WARN] KIE response did not contain image data: {j}")
        except Exception as e:
            print(f"[WARN] KIE image generation failed: {e}")
            continue

    return images


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
        raise

    # Primer encabezado como título si existe
    title = topic
    for line in text.splitlines():
        if line.strip().startswith("# "):
            title = line.strip().lstrip("# ").strip()
            break
    return title, text


def gen_article_with_gemini(topic: str, category: str | None) -> Tuple[str, str]:
    api = os.environ.get("GEMINI_API_KEY")
    if not api or genai is None:
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
    config = gem_types.GenerateContentConfig(response_modalities=["TEXT"])
    resp = client.models.generate_content(model=model, contents=contents, config=config)
    text = _extract_gemini_text(resp)
    if not text.strip():
        raise RuntimeError("Gemini devolvió texto vacío")
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

    # 2) Generar imágenes con Gemini y fallback a OpenAI
    prompt = (
        f"Genera una ilustración/fotografía digital para un artículo web sobre {topic}.\n"
        f"- Estilo: {args.style}\n"
        "- Formato: 16:9, pensado para encabezado de blog\n"
        "- Fondo: limpio, profesional, sin texto ni marcas de agua\n"
        f"- Paleta: colores neutros con acento en {args.accent}\n"
        f"- Elementos clave: {args.details or 'elementos del tema de forma clara y profesional'}\n"
        "- Uso final: imagen hero para web, debe ser clara y atractiva"
    )

    # Prefer KIE if disponible
    images = []
    if os.environ.get('KIE_API_KEY'):
        print('[INFO] KIE API key found: attempting KIE image generation')
        images = gen_images_with_kie(prompt, slug, how_many=max(1, args.images))

    # Intentar generar imágenes con Gemini; si falla (p.ej. falta API key), hacer fallback a OpenAI
    if not images:
        try:
            images = gen_images_with_gemini(prompt, slug, how_many=max(1, args.images))
        except Exception as e:
            print(f"[WARN] Generación con Gemini falló: {e}. Intento fallback con OpenAI...")
            images = []

    if not images:
        images = gen_images_with_openai(prompt, slug, how_many=max(1, args.images))
    
    # Convertir a WEBP para optimizar y verificar que las imágenes son válidas
    out_images: List[Path] = []
    for p in images:
        if p.exists() and p.stat().st_size > 1000:  # Verificar que la imagen es válida (>1KB)
            wp = convert_to_webp(p)
            out_images.append(wp or p)
        else:
            print(f"[WARN] Imagen inválida o muy pequeña: {p}")
    
    images = out_images
    
    # Generar ruta de imagen para el frontmatter
    image_path = None
    if images:
        # Usar la primera imagen válida
        first_image = images[0]
        if first_image.exists() and first_image.stat().st_size > 1000:
            image_path = f"/images/blog/{slug}/{first_image.name}"
            print(f"✅ Imagen principal: {image_path}")
        else:
            print(f"⚠️  Imagen principal inválida: {first_image}")
    
    if not image_path:
        print("⚠️  No se pudo generar una imagen válida")
        print("🖼️  Generando imagen de placeholder...")
        try:
            from generate_placeholder_image import create_placeholder_image
            placeholder_path = create_placeholder_image(slug, topic, args.style, args.accent)
            if placeholder_path.exists() and placeholder_path.stat().st_size > 1000:
                image_path = f"/images/blog/{slug}/{placeholder_path.name}"
                print(f"✅ Imagen de placeholder generada: {image_path}")
            else:
                print("❌ Error generando imagen de placeholder")
        except Exception as e:
            print(f"❌ Error generando placeholder: {e}")

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


if __name__ == "__main__":
    main()
