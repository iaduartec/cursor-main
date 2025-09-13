#!/usr/bin/env bash
# Limpieza local + remota (GitHub) de ramas y tags
# Requisitos: git, gh (autenticado), permisos para borrar ramas/tags remotos

set -euo pipefail

# ========= Configuración =========
REMOTE="${REMOTE:-origin}"
DEFAULT_BRANCH="${DEFAULT_BRANCH:-main}"     # cámbialo si tu rama principal es otra
DRY_RUN="${DRY_RUN:-true}"                   # true = no borra de verdad; false = ejecuta borrados
PROTECTED_BRANCHES_REGEX="${PROTECTED_BRANCHES_REGEX:-^(main|master|develop|release\\/.*)$}"
# Elimina tags remotos que no existan localmente
DELETE_REMOTE_TAGS_NOT_LOCAL="${DELETE_REMOTE_TAGS_NOT_LOCAL:-false}"
# Borra releases cuyo tag ya no existe (requiere gh)
DELETE_GITHUB_RELEASES_WITHOUT_TAG="${DELETE_GITHUB_RELEASES_WITHOUT_TAG:-false}"
# Activar configuración del repo: auto-borrar rama de PR tras merge (requiere admin)
ENABLE_AUTO_DELETE_BRANCH_ON_MERGE="${ENABLE_AUTO_DELETE_BRANCH_ON_MERGE:-false}"

# ========= Utilidades =========
log() { printf "%s\n" "$*" >&2; }
run() {
  if [[ "$DRY_RUN" == "true" ]]; then
    log "[dry-run] $*"
  else
    eval "$@"
  fi
  
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { log "Falta el comando '$1'"; exit 1; }
}

# ========= Comprobaciones =========
require_cmd git
if command -v gh >/dev/null 2>&1; then
  GH_OK=true
else
  GH_OK=false
fi

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { log "No estás dentro de un repo git."; exit 1; }
git fetch "$REMOTE" --prune

# Verificar que la rama por defecto existe en remoto
if ! git ls-remote --heads "$REMOTE" "refs/heads/$DEFAULT_BRANCH" | grep -q .; then
  log "[Advertencia] La rama por defecto '$DEFAULT_BRANCH' no existe en '$REMOTE'. Ajusta DEFAULT_BRANCH."
fi

# ========= Limpieza local mínima =========
log "==> Limpieza local rápida (ignorados y basura ligera)"
git clean -Xfd || true
git gc --prune=now --aggressive || true

# ========= Prune de referencias remotas obsoletas =========
log "==> Prune de referencias remotas obsoletas"
git remote prune "$REMOTE"

# ========= Borrar ramas remotas ya fusionadas con la rama por defecto =========
log "==> Detectando ramas remotas fusionadas en $REMOTE/$DEFAULT_BRANCH"
# Listado de ramas remotas fusionadas (excluye HEAD y la rama por defecto)
merged_branches=$(git branch -r --merged "$REMOTE/$DEFAULT_BRANCH" \
  | sed -E "s#^[[:space:]]*${REMOTE}/##" \
  | grep -Ev "^(HEAD|$DEFAULT_BRANCH)$" || true)

if [[ -z "${merged_branches:-}" ]]; then
  log "No hay ramas remotas claramente fusionadas con $DEFAULT_BRANCH."
else
  # Filtrar protegidas por regex
  to_delete=$(echo "$merged_branches" | grep -Ev "$PROTECTED_BRANCHES_REGEX" || true)
  if [[ -z "${to_delete:-}" ]]; then
    log "Todas las ramas fusionadas coinciden con protección. No se borrará nada."
  else
    log "Ramas remotas a eliminar (excluidas las protegidas):"
    echo "$to_delete" | sed 's/^/  - /'
    while IFS= read -r br; do
      [[ -z "$br" ]] && continue
      run "git push $REMOTE --delete \"$br\""
    done <<< "$to_delete"
  fi
fi

# ========= Borrar ramas remotas tras PR mergeadas (extra, vía gh) =========
if [[ "$GH_OK" == true ]]; then
  log "==> (Extra) Ramas head de PR ya mergeadas (fuente gh)"
  # Nota: gh ya excluye forks cuando headRepositoryOwner != repo
  pr_merged_branches=$(gh pr list --state merged --base "$DEFAULT_BRANCH" --json headRefName,headRepositoryOwner,headRepository --jq '.[] | select(.headRepositoryOwner.login != null) | .headRefName' || true)
  if [[ -n "${pr_merged_branches:-}" ]]; then
    # dedup
    mapfile -t unique_pr_heads < <(echo "$pr_merged_branches" | sort -u)
    log "Ramas de PR mergeadas detectadas:"
    printf '  - %s\n' "${unique_pr_heads[@]}"
    for br in "${unique_pr_heads[@]}"; do
      # Saltar protegidas
      if [[ "$br" =~ $PROTECTED_BRANCHES_REGEX ]]; then
        log "Protegida (saltando): $br"
        continue
      fi
      # Verificar que existe en el remoto antes de borrar
      if git ls-remote --heads "$REMOTE" "refs/heads/$br" | grep -q .; then
        run "git push $REMOTE --delete \"$br\""
      fi
    done
  else
    log "No se detectaron ramas de PR mergeadas (gh)."
  fi
else
  log "[Nota] 'gh' no disponible; se omite la limpieza adicional por PR."
fi

# ========= Tags remotos no presentes localmente =========
if [[ "$DELETE_REMOTE_TAGS_NOT_LOCAL" == "true" ]]; then
  log "==> Eliminando tags remotos que no existen localmente"
  git fetch --tags "$REMOTE" --prune
  remote_tags=$(git ls-remote --tags "$REMOTE" | awk '{print $2}' | sed 's#refs/tags/##' | sed 's/\^\{\}//' | sort -u)
  local_tags=$(git tag | sort -u)
  to_delete_tags=$(comm -23 <(echo "$remote_tags") <(echo "$local_tags") || true)
  if [[ -z "${to_delete_tags:-}" ]]; then
    log "No hay tags remotos huérfanos respecto a local."
  else
    log "Tags remotos a eliminar por no existir localmente:"
    echo "$to_delete_tags" | sed 's/^/  - /'
    while IFS= read -r tg; do
      [[ -z "$tg" ]] && continue
      run "git push $REMOTE :refs/tags/$tg"
    done <<< "$to_delete_tags"
  fi
else
  log "[saltado] DELETE_REMOTE_TAGS_NOT_LOCAL=false"
fi

# ========= Borrar releases sin tag (gh) =========
if [[ "$DELETE_GITHUB_RELEASES_WITHOUT_TAG" == "true" ]]; then
  if [[ "$GH_OK" == true ]]; then
    log "==> Eliminando releases cuyo tag no existe"
    # obtener repo actual "owner/name"
    REPO_SLUG=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
    # listar releases
    mapfile -t releases < <(gh release list --repo "$REPO_SLUG" --limit 300 --json tagName,isDraft,isPrerelease,name --jq '.[] | @base64')
    for r64 in "${releases[@]}"; do
      r=$(echo "$r64" | base64 --decode)
      tag=$(echo "$r" | jq -r '.tagName')
      # si el tag no existe en remoto ni local, borrar release
      if ! git rev-parse -q --verify "refs/tags/$tag" >/dev/null 2>&1 && \
         ! git ls-remote --tags "$REMOTE" "refs/tags/$tag" | grep -q . ; then
        log "Release sin tag encontrado: $tag"
        run "gh release delete \"$tag\" --repo \"$REPO_SLUG\" --yes"
      fi
    done
  else
    log "[saltado] gh no disponible para limpiar releases."
  fi
else
  log "[saltado] DELETE_GITHUB_RELEASES_WITHOUT_TAG=false"
fi

# ========= Activar auto-borrado de ramas tras merge (ajuste del repo) =========
if [[ "$ENABLE_AUTO_DELETE_BRANCH_ON_MERGE" == "true" ]]; then
  if [[ "$GH_OK" == true ]]; then
    log "==> Activando 'delete_branch_on_merge' en el repo (requiere permisos de admin)"
    REPO_SLUG=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
    if [[ "$DRY_RUN" == "true" ]]; then
      log "[dry-run] gh api repos/$REPO_SLUG -X PATCH -f delete_branch_on_merge=true"
    else
      gh api "repos/$REPO_SLUG" -X PATCH -f delete_branch_on_merge=true >/dev/null
    fi
  else
    log "[saltado] gh no disponible para configurar el repo."
  fi
else
  log "[saltado] ENABLE_AUTO_DELETE_BRANCH_ON_MERGE=false"
fi

log "==> Estado final"
git fetch "$REMOTE" --prune
git branch -r
git tag -l | wc -l | xargs -I{} echo "Tags locales: {}"

log "✅ Limpieza remota/local terminada. (DRY_RUN=$DRY_RUN)"
