#!/usr/bin/env python3
"""
Script de diagnóstico para probar la generación de imágenes.
"""

import os
import sys
from pathlib import Path

# Añadir el directorio tools al path
sys.path.insert(0, str(Path(__file__).parent / "tools"))

from generate_article import gen_images_with_gemini, gen_images_with_openai, convert_to_webp

def test_image_generation():
    """Prueba la generación de imágenes con diferentes métodos."""
    print("🔍 Diagnóstico de generación de imágenes\n")
    
    # Verificar variables de entorno
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    print(f"OpenAI API Key: {'✅ Configurada' if openai_key else '❌ No configurada'}")
    print(f"Gemini API Key: {'✅ Configurada' if gemini_key else '❌ No configurada'}")
    
    if not openai_key and not gemini_key:
        print("\n❌ No hay claves de API configuradas. Configura las variables de entorno:")
        print("export OPENAI_API_KEY='tu-clave-openai'")
        print("export GEMINI_API_KEY='tu-clave-gemini'")
        return False
    
    # Prompt de prueba
    test_prompt = "Genera una imagen profesional de una cámara de seguridad IP en un entorno comercial, estilo fotográfico, colores azules, formato 16:9"
    test_slug = "test-imagen-diagnostico"
    
    print(f"\n📝 Prompt de prueba: {test_prompt}")
    print(f"📁 Slug: {test_slug}")
    
    # Probar Gemini primero
    if gemini_key:
        print("\n🧪 Probando Gemini...")
        try:
            images = gen_images_with_gemini(test_prompt, test_slug, how_many=1)
            if images:
                print(f"✅ Gemini generó {len(images)} imagen(es)")
                for img in images:
                    size = img.stat().st_size if img.exists() else 0
                    print(f"   - {img.name}: {size} bytes")
                    if size < 1000:
                        print(f"   ⚠️  Imagen muy pequeña ({size} bytes), posible error")
            else:
                print("❌ Gemini no generó imágenes")
        except Exception as e:
            print(f"❌ Error con Gemini: {e}")
    
    # Probar OpenAI como fallback
    if openai_key:
        print("\n🧪 Probando OpenAI...")
        try:
            images = gen_images_with_openai(test_prompt, test_slug, how_many=1)
            if images:
                print(f"✅ OpenAI generó {len(images)} imagen(es)")
                for img in images:
                    size = img.stat().st_size if img.exists() else 0
                    print(f"   - {img.name}: {size} bytes")
                    if size < 1000:
                        print(f"   ⚠️  Imagen muy pequeña ({size} bytes), posible error")
            else:
                print("❌ OpenAI no generó imágenes")
        except Exception as e:
            print(f"❌ Error con OpenAI: {e}")
    
    # Verificar directorio de imágenes
    images_dir = Path("public/images/blog") / test_slug
    if images_dir.exists():
        print(f"\n📁 Directorio creado: {images_dir}")
        files = list(images_dir.glob("*"))
        if files:
            print("Archivos encontrados:")
            for f in files:
                size = f.stat().st_size
                print(f"   - {f.name}: {size} bytes")
        else:
            print("   No hay archivos en el directorio")
    else:
        print(f"\n❌ Directorio no creado: {images_dir}")
    
    return True

def test_image_conversion():
    """Prueba la conversión de imágenes a WEBP."""
    print("\n🔄 Probando conversión a WEBP...")
    
    # Buscar imágenes de prueba
    test_images = list(Path("public/images/blog").rglob("*.png"))
    if not test_images:
        print("❌ No se encontraron imágenes PNG para probar")
        return
    
    print(f"Encontradas {len(test_images)} imágenes PNG")
    
    for img_path in test_images[:3]:  # Probar solo las primeras 3
        try:
            original_size = img_path.stat().st_size
            print(f"\n📸 Procesando: {img_path.name} ({original_size} bytes)")
            
            if original_size < 1000:
                print(f"   ⚠️  Imagen muy pequeña, posible error en generación")
                continue
            
            webp_path = convert_to_webp(img_path)
            if webp_path and webp_path.exists():
                webp_size = webp_path.stat().st_size
                print(f"   ✅ Convertida a WEBP: {webp_path.name} ({webp_size} bytes)")
            else:
                print(f"   ❌ Conversión falló")
        except Exception as e:
            print(f"   ❌ Error: {e}")

def main():
    """Ejecuta el diagnóstico completo."""
    print("🚀 Iniciando diagnóstico de imágenes\n")
    
    success = test_image_generation()
    if success:
        test_image_conversion()
    
    print("\n" + "="*50)
    print("📊 RESUMEN DEL DIAGNÓSTICO")
    print("="*50)
    print("Si las imágenes son muy pequeñas (< 1KB), el problema puede ser:")
    print("1. Error en la API de generación de imágenes")
    print("2. Problema con el formato de respuesta")
    print("3. Error en el procesamiento de datos base64")
    print("4. Configuración incorrecta de las APIs")
    print("\nRevisa los logs arriba para más detalles.")

if __name__ == "__main__":
    main()
