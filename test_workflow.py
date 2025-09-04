#!/usr/bin/env python3
"""
Script de prueba para verificar el workflow de generación de artículos.
"""

import os
import sys
import subprocess
from pathlib import Path

def test_dependencies():
    """Verifica que todas las dependencias estén instaladas."""
    print("🔍 Verificando dependencias...")
    
    required_packages = [
        ('google-genai', 'google.genai'),
        ('openai', 'openai'), 
        ('pyyaml', 'yaml'),
        ('python-slugify', 'slugify'),
        ('Pillow', 'PIL')
    ]
    
    missing = []
    for package_name, import_name in required_packages:
        try:
            __import__(import_name)
            print(f"✅ {package_name}")
        except ImportError:
            print(f"❌ {package_name}")
            missing.append(package_name)
    
    if missing:
        print(f"\n❌ Faltan dependencias: {', '.join(missing)}")
        print("Ejecuta: pip install -r requirements.txt")
        return False
    
    print("✅ Todas las dependencias están instaladas")
    return True

def test_directories():
    """Verifica que existan los directorios necesarios."""
    print("\n📁 Verificando directorios...")
    
    required_dirs = [
        Path("content/blog"),
        Path("public/images/blog"),
        Path("tools")
    ]
    
    missing = []
    for dir_path in required_dirs:
        if dir_path.exists():
            print(f"✅ {dir_path}")
        else:
            print(f"❌ {dir_path}")
            missing.append(dir_path)
    
    if missing:
        print(f"\n❌ Faltan directorios: {', '.join(str(d) for d in missing)}")
        return False
    
    print("✅ Todos los directorios existen")
    return True

def test_environment():
    """Verifica las variables de entorno."""
    print("\n🔑 Verificando variables de entorno...")
    
    required_vars = ['OPENAI_API_KEY', 'GEMINI_API_KEY']
    missing = []
    
    for var in required_vars:
        if os.getenv(var):
            print(f"✅ {var} (configurada)")
        else:
            print(f"❌ {var} (no configurada)")
            missing.append(var)
    
    if missing:
        print(f"\n⚠️  Variables faltantes: {', '.join(missing)}")
        print("Estas son necesarias para generar contenido con IA")
        return False
    
    print("✅ Todas las variables están configuradas")
    return True

def test_generate_script():
    """Prueba el script de generación con parámetros mínimos."""
    print("\n🧪 Probando script de generación...")
    
    try:
        # Ejecutar con --help para verificar que funciona
        result = subprocess.run([
            sys.executable, "tools/generate_article.py", "--help"
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print("✅ Script de generación funciona correctamente")
            return True
        else:
            print(f"❌ Error en script: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Timeout al ejecutar script")
        return False
    except Exception as e:
        print(f"❌ Error al ejecutar script: {e}")
        return False

def main():
    """Ejecuta todas las pruebas."""
    print("🚀 Iniciando pruebas del workflow de generación de artículos\n")
    
    tests = [
        ("Dependencias", test_dependencies),
        ("Directorios", test_directories),
        ("Variables de entorno", test_environment),
        ("Script de generación", test_generate_script)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Error en {test_name}: {e}")
            results.append((test_name, False))
    
    # Resumen
    print("\n" + "="*50)
    print("📊 RESUMEN DE PRUEBAS")
    print("="*50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASÓ" if result else "❌ FALLÓ"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nTotal: {passed}/{len(results)} pruebas pasaron")
    
    if passed == len(results):
        print("\n🎉 ¡Todas las pruebas pasaron! El workflow debería funcionar correctamente.")
        return 0
    else:
        print("\n⚠️  Algunas pruebas fallaron. Revisa los errores arriba.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
