#!/bin/bash
# Script de limpieza general para un repositorio git

set -e

echo "==> Limpiando archivos temporales..."
find . -name '*.DS_Store' -type f -delete
find . -name '__pycache__' -type d -exec rm -rf {} +
find . -name '*.pyc' -type f -delete

echo "==> Revisando archivos ignorados..."
git clean -Xfd

echo "==> Eliminando ramas locales ya fusionadas con main..."
git fetch --all --prune
git branch --merged main | grep -v 'main' | xargs -r git branch -d

echo "==> Recolectando basura y optimizando..."
git gc --aggressive --prune=now

echo "==> Estado final:"
git status

echo "✅ Limpieza completada."
