<!--
Resumen generado automáticamente.

tools/dev/README.md

2025-09-13T06:20:07.388Z

——————————————————————————————
Archivo .md: README.md
Tamaño: 616 caracteres, 10 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
-->
# Scripts de desarrollo y utilidades locales

Estos scripts son utilidades locales para pruebas y diagnóstico. No se usan en
los workflows de GitHub ni en el despliegue.

- `test_workflow.py`: Verifica dependencias y estructura local
- `test_article_generation.py`: Prueba de generación completa de artículo e
  imágenes
- `test_final_workflow.py`: Prueba end‑to‑end sin APIs
- `debug_images.py`: Diagnóstico de generación y conversión de imágenes
- `cleanup_images.py`: Limpieza de imágenes inválidas o de prueba

Nota: pueden requerir variables de entorno (`OPENAI_API_KEY`, `GEMINI_API_KEY`) y dependencias instaladas (`pip install -r tools/requirements.txt`).
