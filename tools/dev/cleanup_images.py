#!/usr/bin/env python3
"""
Script para limpiar imágenes inválidas y de prueba.
"""

from pathlib import Path
import shutil

def cleanup_invalid_images():
    """Elimina imágenes inválidas (muy pequeñas) y directorios de prueba."""
    print("🧹 Limpiando imágenes inválidas y de prueba\n")
    
    images_dir = Path("public/images/blog")
    if not images_dir.exists():
        print("❌ Directorio de imágenes no existe")
        return
    
    # Eliminar directorios de prueba
    test_dirs = [
        "test-imagen-diagnostico",
        "test-placeholder"
    ]
    
    for test_dir in test_dirs:
        test_path = images_dir / test_dir
        if test_path.exists():
            shutil.rmtree(test_path)
            print(f"🗑️  Eliminado directorio de prueba: {test_dir}")
    
    # Buscar y eliminar imágenes inválidas
    invalid_count = 0
    for img_path in images_dir.rglob("*"):
        if img_path.is_file():
            try:
                size = img_path.stat().st_size
                if size < 1000:  # Menos de 1KB
                    img_path.unlink()
                    print(f"🗑️  Eliminada imagen inválida: {img_path.name} ({size} bytes)")
                    invalid_count += 1
            except Exception as e:
                print(f"⚠️  Error procesando {img_path}: {e}")
    
    # Eliminar directorios vacíos
    empty_dirs = 0
    for dir_path in images_dir.rglob("*"):
        if dir_path.is_dir():
            try:
                if not any(dir_path.iterdir()):
                    dir_path.rmdir()
                    print(f"🗑️  Eliminado directorio vacío: {dir_path.name}")
                    empty_dirs += 1
            except Exception as e:
                print(f"⚠️  Error procesando directorio {dir_path}: {e}")
    
    print(f"\n✅ Limpieza completada:")
    print(f"   - Imágenes inválidas eliminadas: {invalid_count}")
    print(f"   - Directorios vacíos eliminados: {empty_dirs}")
    print(f"   - Directorios de prueba eliminados: {len(test_dirs)}")

def list_valid_images():
    """Lista las imágenes válidas restantes."""
    print("\n📸 Imágenes válidas restantes:")
    
    images_dir = Path("public/images/blog")
    if not images_dir.exists():
        print("❌ No hay directorio de imágenes")
        return
    
    valid_count = 0
    for img_path in images_dir.rglob("*"):
        if img_path.is_file():
            try:
                size = img_path.stat().st_size
                if size >= 1000:
                    print(f"   ✅ {img_path.name}: {size} bytes")
                    valid_count += 1
            except Exception as e:
                print(f"   ⚠️  Error leyendo {img_path}: {e}")
    
    if valid_count == 0:
        print("   No hay imágenes válidas")
    else:
        print(f"\nTotal: {valid_count} imágenes válidas")

def main():
    """Ejecuta la limpieza completa."""
    print("🚀 Iniciando limpieza de imágenes\n")
    
    cleanup_invalid_images()
    list_valid_images()
    
    print("\n" + "="*50)
    print("📊 RESUMEN DE LIMPIEZA")
    print("="*50)
    print("✅ Limpieza completada")
    print("\nLas imágenes válidas (>1KB) se mantienen.")
    print("Las imágenes inválidas y directorios de prueba fueron eliminados.")

if __name__ == "__main__":
    main()
