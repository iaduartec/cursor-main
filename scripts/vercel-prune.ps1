#!/usr/bin/env bash
# Borra deployments de Vercel manteniendo los N más recientes por target.
# Requisitos: bash, curl, jq
set -euo pipefail


: "${VERCEL_TOKEN:?Falta VERCEL_TOKEN}"
: "${PROJECT:?Falta PROJECT}"

KEEP="${KEEP:-2}"            # cuántos mantener
TARGET="${TARGET:-preview}"  # "", "preview" o "production"
VERCEL_TEAM_ID="${VERCEL_TEAM_ID:-}"

API_LIST="https://api.vercel.com/v6/deployments"
API_DEL="https://api.vercel.com/v13/deployments"
auth=(-H "Authorization: Bearer ${VERCEL_TOKEN}")

qs="app=${PROJECT}&state=READY"
[[ -n "$TARGET" ]] && qs="${qs}&target=${TARGET}"
[[ -n "$VERCEL_TEAM_ID" ]] && qs="${qs}&teamId=${VERCEL_TEAM_ID}"

# --- Listado con paginación ---
uids=(); createds=()
limit=200; until=""
while :; do
  url="${API_LIST}?${qs}&limit=${limit}"
  [[ -n "$until" ]] && url="${url}&until=${until}"
  resp="$(curl -s "$url" "${auth[@]}")" || { echo "Error al listar"; exit 1; }

  cnt=$(jq '.deployments|length' <<<"$resp")
  (( cnt==0 )) && break

  mapfile -t page_uids < <(jq -r '.deployments[].uid' <<<"$resp")
  mapfile -t page_createds < <(jq -r '.deployments[].createdAt' <<<"$resp")
  uids+=("${page_uids[@]}")
  createds+=("${page_createds[@]}")

  oldest="$(jq -r '[.deployments[].createdAt] | min // empty' <<<"$resp")"
  [[ -z "$oldest" || $cnt -lt $limit ]] && break
  until="$oldest"
done

total=${#uids[@]}
(( total==0 )) && { echo "No hay deployments READY para ${PROJECT} (${TARGET:-todos})."; exit 0; }

# --- Ordena DESC por fecha y prepara borrado ---
pairs=()
for i in "${!uids[@]}"; do pairs+=("${createds[$i]} ${uids[$i]}"); done
IFS=$'\n' read -r -d '' -a sorted < <(printf "%s\n" "${pairs[@]}" | sort -nr && printf '\0')
sorted_uids=(); for line in "${sorted[@]}"; do sorted_uids+=("${line##* }"); done

(( KEEP<0 )) && KEEP=0
del_uids=("${sorted_uids[@]:$KEEP}")
keep_count=$(( total - ${#del_uids[@]} ))

echo "Proyecto: $PROJECT | Target: ${TARGET:-todos}"
echo "Total READY: $total | Mantener: $keep_count | Borrar: ${#del_uids[@]}"
echo "Muestra de IDs a borrar:"; printf "  - %s\n" "${del_uids[@]:0:10}"

# --- Dry-run ---
if [[ "${1:-}" == "--dry-run" ]]; then
  echo "[DRY-RUN] No se ha borrado nada."
  exit 0
fi

# --- Confirmación y borrado ---
read -r -p "Escribe BORRAR para confirmar: " ans
[[ "$ans" == "BORRAR" ]] || { echo "Cancelado."; exit 1; }

ok=0; fail=0
for id in "${del_uids[@]}"; do
  url="${API_DEL}/${id}"
  [[ -n "$VERCEL_TEAM_ID" ]] && url="${url}?teamId=${VERCEL_TEAM_ID}"
  state="$(curl -s -X DELETE "$url" "${auth[@]}" | jq -r '.state // empty')"
  if [[ -n "$state" ]]; then
    ((ok++)); echo "✔ $id -> $state"
  else
    ((fail++)); echo "✖ $id -> error"
  fi
done

echo "Hecho. Eliminados OK: $ok | Fallos: $fail"
