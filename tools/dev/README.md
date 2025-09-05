Estos scripts son utilidades locales para pruebas y diagnóstico. No se usan en los workflows de GitHub ni en el despliegue.

- `test_workflow.py`: Verifica dependencias y estructura local
- `test_article_generation.py`: Prueba de generación completa de artículo e imágenes
- `test_final_workflow.py`: Prueba end‑to‑end sin APIs
- `debug_images.py`: Diagnóstico de generación y conversión de imágenes
- `cleanup_images.py`: Limpieza de imágenes inválidas o de prueba

Nota: pueden requerir variables de entorno (`OPENAI_API_KEY`, `GEMINI_API_KEY`) y dependencias instaladas (`pip install -r tools/requirements.txt`).
