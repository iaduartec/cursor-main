"""
Resumen generado automáticamente.

scripts/clean_deployments.py

2025-09-13T06:20:07.384Z

——————————————————————————————
Archivo .py: clean_deployments.py
Tamaño: 3533 caracteres, 133 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
"""
#!/usr/bin/env bash
# vercel-prune.sh
# Requisitos: bash, curl, jq
set -euo pipefail

: "${VERCEL_TOKEN:?Falta VERCEL_TOKEN}"
: "${PROJECT:?Falta PROJECT}"
VERCEL_TEAM_ID="${VERCEL_TEAM_ID:-}"
TARGET="${TARGET:-}"      # "", "preview" o "production"
KEEP="${KEEP:-0}"         # N despliegues a conservar (más recientes)

API_LIST="https://api.vercel.com/v6/deployments"
API_DEL="https://api.vercel.com/v13/deployments"

auth=(-H "Authorization: Bearer ${VERCEL_TOKEN}")
team_qs=""; [[ -n "$VERCEL_TEAM_ID" ]] && team_qs="&teamId=${VERCEL_TEAM_ID}"
target_qs=""; [[ -n "$TARGET" ]] && target_qs="&target=${TARGET}"

dry_run=false
[[ "${1:-}" == "--dry-run" ]] && dry_run=true

echo "Proyecto: $PROJECT  | Target: ${TARGET:-(todos)}  | Mantener: $KEEP"
echo "Modo: $([[ $dry_run == true ]] && echo DRY-RUN || echo BORRADO REAL)"
echo

uids=()
createds=()

limit=200
until=""  # paginación: timestamp en ms del más antiguo ya recogido
page=1

while :; do
  url="${API_LIST}?app=${PROJECT}${target_qs}${team_qs}&limit=${limit}"
  [[ -n "$until" ]] && url="${url}&until=${until}"

  resp="$(curl -s "$url" "${auth[@]}")" || { echo "Error al listar"; exit 1; }

  # Extrae uid y createdAt
  page_uids=($(jq -r '.deployments[].uid' <<<"$resp"))
  page_createds=($(jq -r '.deployments[].createdAt' <<<"$resp"))

  count=${#page_uids[@]}
  [[ $count -eq 0 ]] && break

  echo "Página $page: +$count deployments"
  uids+=("${page_uids[@]}")
  createds+=("${page_createds[@]}")

  # prepara siguiente página con el más antiguo de esta tanda
  oldest="$(jq -r '[.deployments[].createdAt] | min // empty' <<<"$resp")"
  # Si no hay más viejos, paramos
  [[ -z "$oldest" || $count -lt $limit ]] && break
  until="$oldest"
  ((page++))
done

total=${#uids[@]}
if [[ $total -eq 0 ]]; then
  echo "No se encontraron deployments para los filtros indicados."
  exit 0
fi

# Ordena por createdAt DESC para poder conservar los más recientes
# Construimos pares "createdAt uid", ordenamos y separamos
pairs=()
for i in "${!uids[@]}"; do
  pairs+=("${createds[$i]} ${uids[$i]}")
done

mapfile -t sorted < <(printf "%s\n" "${pairs[@]}" | sort -nr)  # DESC por createdAt

# Separa en arrays ordenados
sorted_uids=()
sorted_created=()
for line in "${sorted[@]}"; do
  c="${line%% *}"
  u="${line##* }"
  sorted_created+=("$c")
  sorted_uids+=("$u")
done

# Aplica KEEP
if (( KEEP > 0 )); then
  echo "Conservará los $KEEP más recientes."
  del_uids=("${sorted_uids[@]:$KEEP}")
else
  del_uids=("${sorted_uids[@]}")
fi

del_count=${#del_uids[@]}
keep_count=$(( total - del_count ))

echo
echo "Total encontrados: $total"
echo "Se conservarán:   $keep_count"
echo "Se eliminarán:    $del_count"
echo

# Muestra una muestra de lo que se borrará
if (( del_count > 0 )); then
  echo "Ejemplos de IDs a borrar (primeros 10):"
  printf "  %s\n" "${del_uids[@]:0:10}"
else
  echo "Nada que borrar con los parámetros actuales."
  exit 0
fi

if [[ "$dry_run" == true ]]; then
  echo
  echo "[DRY-RUN] Fin. No se ha borrado nada."
  exit 0
fi

read -r -p "CONFIRMA escribiendo BORRAR para continuar: " ans
[[ "$ans" == "BORRAR" ]] || { echo "Cancelado."; exit 1; }

# Borrado
ok=0; fail=0
for id in "${del_uids[@]}"; do
  url="${API_DEL}/${id}"
  [[ -n "$VERCEL_TEAM_ID" ]] && url="${url}?teamId=${VERCEL_TEAM_ID}"
  state="$(curl -s -X DELETE "$url" "${auth[@]}" | jq -r '.state // empty')"
  if [[ -n "$state" ]]; then
    ((ok++)); echo "✔ $id  -> $state"
  else
    ((fail++)); echo "✖ $id  -> error"
  fi
done

echo
echo "Hecho. Eliminados OK: $ok | Fallos: $fail"
