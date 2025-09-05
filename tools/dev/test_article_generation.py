#!/usr/bin/env python3
"""
Script de prueba para generar un artículo completo y verificar las imágenes.
"""

import os
import sys
from pathlib import Path

# Añadir el directorio tools al path
sys.path.insert(0, str(Path(__file__).parent / "tools"))

def test_article_generation():
    """Prueba la generación completa de un artículo."""
    print("🚀 Probando generación de artículo completo\n")
    
    # Verificar variables de entorno
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    if not openai_key and not gemini_key:
        print("❌ No hay claves de API configuradas.")
        print("Configura las variables de entorno:")
        print("export OPENAI_API_KEY='tu-clave-openai'")
        print("export GEMINI_API_KEY='tu-clave-gemini'")
        return False
    
    # Importar después de verificar las claves
    from generate_article import main as generate_main
    import argparse
    
    # Crear argumentos de prueba
    test_args = argparse.Namespace(
        topic="Sistemas de videovigilancia inteligente para comercios",
        style="fotográfico",
        accent="azul",
        details="cámaras IP modernas, entorno comercial profesional",
        category="Seguridad",
        images=1
    )
    
    print(f"📝 Tema: {test_args.topic}")
    print(f"🎨 Estilo: {test_args.style}")
    print(f"🎨 Color: {test_args.accent}")
    print(f"📋 Detalles: {test_args.details}")
    print(f"📂 Categoría: {test_args.category}")
    print(f"🖼️  Imágenes: {test_args.images}")
    
    # Guardar argumentos originales
    original_argv = sys.argv
    sys.argv = [
        'generate_article.py',
        '--topic', test_args.topic,
        '--style', test_args.style,
        '--accent', test_args.accent,
        '--details', test_args.details,
        '--category', test_args.category,
        '--images', str(test_args.images)
    ]
    
    try:
        # Ejecutar la generación
        generate_main()
        
        # Verificar resultados
        from slugify import slugify
        slug = slugify(test_args.topic)[:80]
        
        # Verificar archivo del artículo
        article_path = Path("content/blog") / f"{slug}.mdx"
        if article_path.exists():
            print(f"\n✅ Artículo generado: {article_path}")
            
            # Leer el frontmatter para verificar la imagen
            content = article_path.read_text(encoding='utf-8')
            if 'image:' in content:
                print("✅ Imagen referenciada en frontmatter")
                # Extraer la ruta de la imagen
                for line in content.split('\n'):
                    if line.strip().startswith('image:'):
                        image_path = line.split(':', 1)[1].strip().strip('"\'')
                        print(f"   📸 Ruta de imagen: {image_path}")
                        
                        # Verificar que la imagen existe
                        full_image_path = Path("public") / image_path.lstrip('/')
                        if full_image_path.exists():
                            size = full_image_path.stat().st_size
                            print(f"   ✅ Imagen existe: {full_image_path.name} ({size} bytes)")
                            if size < 1000:
                                print(f"   ⚠️  Imagen muy pequeña ({size} bytes)")
                        else:
                            print(f"   ❌ Imagen no encontrada: {full_image_path}")
                        break
            else:
                print("❌ No se encontró referencia a imagen en el frontmatter")
        else:
            print(f"❌ Artículo no generado: {article_path}")
        
        # Verificar directorio de imágenes
        images_dir = Path("public/images/blog") / slug
        if images_dir.exists():
            print(f"\n📁 Directorio de imágenes: {images_dir}")
            image_files = list(images_dir.glob("*"))
            if image_files:
                print(f"   Encontradas {len(image_files)} imagen(es):")
                for img in image_files:
                    size = img.stat().st_size
                    print(f"   - {img.name}: {size} bytes")
                    if size < 1000:
                        print(f"     ⚠️  Imagen muy pequeña")
            else:
                print("   No hay imágenes en el directorio")
        else:
            print(f"❌ Directorio de imágenes no creado: {images_dir}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en la generación: {e}")
        return False
    finally:
        # Restaurar argumentos originales
        sys.argv = original_argv

def main():
    """Ejecuta la prueba completa."""
    print("🧪 Iniciando prueba de generación de artículo\n")
    
    success = test_article_generation()
    
    print("\n" + "="*50)
    print("📊 RESUMEN DE LA PRUEBA")
    print("="*50)
    
    if success:
        print("✅ Prueba completada")
        print("\nSi las imágenes siguen sin verse, verifica:")
        print("1. Que las APIs de IA estén funcionando correctamente")
        print("2. Que las imágenes se generen con tamaño > 1KB")
        print("3. Que las rutas en el frontmatter sean correctas")
        print("4. Que el sitio web esté configurado para servir imágenes desde /public/images/")
    else:
        print("❌ Prueba falló")
        print("\nRevisa los errores arriba y verifica:")
        print("1. Las claves de API están configuradas")
        print("2. Las dependencias están instaladas")
        print("3. Los directorios tienen permisos de escritura")

if __name__ == "__main__":
    main()
