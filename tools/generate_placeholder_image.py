#!/usr/bin/env python3
"""
Generador de imágenes de placeholder para artículos cuando las APIs de IA fallan.
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import textwrap

ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = ROOT / "public" / "images" / "blog"

def create_placeholder_image(slug: str, topic: str, style: str = "fotográfico", accent_color: str = "azul") -> Path:
    """
    Crea una imagen de placeholder para un artículo.
    
    Args:
        slug: Slug del artículo
        topic: Título del artículo
        style: Estilo de la imagen
        accent_color: Color de acento
    
    Returns:
        Path a la imagen generada
    """
    
    # Configurar colores según el acento
    color_map = {
        "azul": "#2563eb",
        "verde": "#059669", 
        "rojo": "#dc2626",
        "amarillo": "#d97706",
        "morado": "#7c3aed",
        "rosa": "#db2777"
    }
    
    accent = color_map.get(accent_color.lower(), "#2563eb")
    
    # Crear imagen
    width, height = 1920, 1080
    img = Image.new('RGB', (width, height), color='#f8fafc')
    draw = ImageDraw.Draw(img)
    
    # Añadir gradiente de fondo
    for y in range(height):
        # Gradiente sutil del color de acento
        alpha = int(255 * (1 - y / height) * 0.1)  # Muy sutil
        color = tuple(int(accent[i:i+2], 16) for i in (1, 3, 5)) + (alpha,)
        draw.line([(0, y), (width, y)], fill=color)
    
    # Configurar fuente
    try:
        # Intentar usar una fuente del sistema
        font_large = ImageFont.truetype("arial.ttf", 72)
        font_medium = ImageFont.truetype("arial.ttf", 48)
        font_small = ImageFont.truetype("arial.ttf", 32)
    except:
        # Fallback a fuente por defecto
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Dividir el título en líneas
    lines = textwrap.wrap(topic, width=30)
    
    # Calcular posición del texto
    line_height = 80
    total_height = len(lines) * line_height
    start_y = (height - total_height) // 2
    
    # Dibujar texto con sombra
    for i, line in enumerate(lines):
        y = start_y + i * line_height
        
        # Sombra
        draw.text((width//2 + 3, y + 3), line, font=font_large, fill='#64748b', anchor='mm')
        # Texto principal
        draw.text((width//2, y), line, font=font_large, fill='#1e293b', anchor='mm')
    
    # Añadir subtítulo
    subtitle = f"Artículo técnico • {style.title()}"
    draw.text((width//2, start_y + total_height + 50), subtitle, font=font_medium, fill='#64748b', anchor='mm')
    
    # Añadir marca de agua sutil
    watermark = "Imagen generada automáticamente"
    draw.text((width - 20, height - 20), watermark, font=font_small, fill='#94a3b8', anchor='rb')
    
    # Crear directorio si no existe
    target_dir = IMAGES_DIR / slug
    target_dir.mkdir(parents=True, exist_ok=True)
    
    # Guardar imagen
    image_path = target_dir / f"{slug}-hero-001.webp"
    img.save(image_path, format="WEBP", quality=85, method=6)
    
    return image_path

def main():
    """Función principal para pruebas."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Genera imagen de placeholder")
    parser.add_argument("--slug", required=True, help="Slug del artículo")
    parser.add_argument("--topic", required=True, help="Título del artículo")
    parser.add_argument("--style", default="fotográfico", help="Estilo de la imagen")
    parser.add_argument("--accent", default="azul", help="Color de acento")
    
    args = parser.parse_args()
    
    image_path = create_placeholder_image(
        args.slug, 
        args.topic, 
        args.style, 
        args.accent
    )
    
    print(f"✅ Imagen de placeholder generada: {image_path}")
    print(f"📏 Tamaño: {image_path.stat().st_size} bytes")

if __name__ == "__main__":
    main()
