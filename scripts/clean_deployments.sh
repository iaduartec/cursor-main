#!/usr/bin/env bash
# clean_deployments.sh - Vercel deployments cleanup script
# Requirements: bash, curl, jq
set -euo pipefail

: "${VERCEL_TOKEN:?Missing VERCEL_TOKEN}"
: "${PROJECT:?Missing PROJECT}"
VERCEL_TEAM_ID="${VERCEL_TEAM_ID:-}"
TARGET="${TARGET:-}"      # "", "preview" or "production"
KEEP="${KEEP:-0}"         # N deployments to keep (most recent)

API_LIST="https://api.vercel.com/v6/deployments"
API_DEL="https://api.vercel.com/v13/deployments"

auth=(-H "Authorization: Bearer ${VERCEL_TOKEN}")
team_qs=""; [[ -n "$VERCEL_TEAM_ID" ]] && team_qs="&teamId=${VERCEL_TEAM_ID}"
target_qs=""; [[ -n "$TARGET" ]] && target_qs="&target=${TARGET}"

dry_run=false
[[ "${1:-}" == "--dry-run" ]] && dry_run=true

echo "Project: $PROJECT  | Target: ${TARGET:-(all)}  | Keep: $KEEP"
echo "Mode: $([[ $dry_run == true ]] && echo DRY-RUN || echo REAL DELETE)"
echo

uids=()
createds=()

limit=200
until=""  # pagination: timestamp in ms of oldest already collected
page=1

while :; do
  url="${API_LIST}?app=${PROJECT}${target_qs}${team_qs}&limit=${limit}"
  [[ -n "$until" ]] && url="${url}&until=${until}"

  resp="$(curl -s "$url" "${auth[@]}")" || { echo "Error listing deployments"; exit 1; }

  # Extract uid and createdAt
  page_uids=($(jq -r '.deployments[].uid' <<<"$resp"))
  page_createds=($(jq -r '.deployments[].createdAt' <<<"$resp"))

  count=${#page_uids[@]}
  [[ $count -eq 0 ]] && break

  echo "Page $page: +$count deployments"
  uids+=("${page_uids[@]}")
  createds+=("${page_createds[@]}")

  # prepare next page with oldest from this batch
  oldest="$(jq -r '[.deployments[].createdAt] | min // empty' <<<"$resp")"
  # If no more old ones, stop
  [[ -z "$oldest" || $count -lt $limit ]] && break
  until="$oldest"
  ((page++))
done

total=${#uids[@]}
if [[ $total -eq 0 ]]; then
  echo "No deployments found for the specified filters."
  exit 0
fi

# Sort by createdAt DESC to be able to keep the most recent ones
# Build pairs "createdAt uid", sort and separate
pairs=()
for i in "${!uids[@]}"; do
  pairs+=("${createds[$i]} ${uids[$i]}")
done

mapfile -t sorted < <(printf "%s\n" "${pairs[@]}" | sort -nr)  # DESC by createdAt

# Separate into sorted arrays
sorted_uids=()
sorted_created=()
for line in "${sorted[@]}"; do
  c="${line%% *}"
  u="${line##* }"
  sorted_created+=("$c")
  sorted_uids+=("$u")
done

# Apply KEEP
if (( KEEP > 0 )); then
  echo "Will keep the $KEEP most recent deployments."
  del_uids=("${sorted_uids[@]:$KEEP}")
else
  del_uids=("${sorted_uids[@]}")
fi

del_count=${#del_uids[@]}
keep_count=$(( total - del_count ))

echo
echo "Total found:      $total"
echo "Will keep:        $keep_count"
echo "Will delete:      $del_count"
echo

# Show a sample of what will be deleted
if (( del_count > 0 )); then
  echo "Example IDs to delete (first 10):"
  printf "  %s\n" "${del_uids[@]:0:10}"
else
  echo "Nothing to delete with current parameters."
  exit 0
fi

if [[ "$dry_run" == true ]]; then
  echo
  echo "[DRY-RUN] Done. Nothing was deleted."
  exit 0
fi

read -r -p "CONFIRM by typing DELETE to continue: " ans
[[ "$ans" == "DELETE" ]] || { echo "Cancelled."; exit 1; }

# Deletion
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
echo "Done. Successfully deleted: $ok | Failed: $fail"
