#!/usr/bin/env node
/**
 * Cleanup Vercel deployments for a given Git branch.
 *
 * Env vars required:
 * - VERCEL_TOKEN       (token bearer)
 * - VERCEL_PROJECT_ID  (project id)
 * - TARGET_BRANCH      (branch to prune)
 * - DRY_RUN            (optional: '1' to only log)
 */

const token = process.env.VERCEL_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;
const teamId = process.env.VERCEL_TEAM_ID || '';
const branch = process.env.TARGET_BRANCH;
const dryRun = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';
const forceDeleteProtected = process.env.FORCE_DELETE_PROTECTED === '1' || process.env.FORCE_DELETE_PROTECTED === 'true';
const protectedConfirm = process.env.PROTECTED_CONFIRM || process.env.CONFIRM_BRANCH || '';

if (!token || !projectId || !branch) {
    console.error('Missing required env vars. Needed: VERCEL_TOKEN, VERCEL_PROJECT_ID, TARGET_BRANCH');
    process.exit(2);
}

const headers = {
    Authorization: `Bearer ${token}`,
};

async function listDeploymentsByBranch(branchName) {
    const encodedBranch = encodeURIComponent(branchName);
    const base = 'https://api.vercel.com';
    const limit = 100;
    const teamParam = teamId ? `&teamId=${encodeURIComponent(teamId)}` : '';
    let url = `${base}/v6/deployments?projectId=${projectId}&limit=${limit}&meta-githubCommitRef=${encodedBranch}${teamParam}`;
    const all = [];
    while (url) {
        const res = await fetch(url, { headers });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to list deployments (${res.status}): ${text}`);
        }
        const data = await res.json();
        /**
         * Nota: Los objetos pueden venir con forma de v6 (data.deployments) o v13 (items).
         * Campo importante: `target` suele ser 'production' o 'preview'.
         */
        const items = data.deployments || data.items || [];
        all.push(...items);
        // pagination via next/continue token
        if (data.pagination && data.pagination.next) {
            url = `${base}${data.pagination.next}`;
        } else if (data.continuationToken) {
            url = `${base}/v6/deployments?projectId=${projectId}&limit=${limit}&meta-githubCommitRef=${encodedBranch}&until=${data.continuationToken}${teamParam}`;
        } else {
            url = null;
        }
    }
    // Fallback: además de la query por meta, filtramos por posibles claves de meta
    const filtered = all.filter(d => {
        const m = d.meta || {};
        return (
            m.githubCommitRef === branchName ||
            m.githubCommitRefName === branchName ||
            m.branch === branchName ||
            m.GITHUB_COMMIT_REF === branchName
        );
    });
    return filtered.length ? filtered : all;
}

async function deleteDeployment(id) {
    const teamParam = teamId ? `&teamId=${encodeURIComponent(teamId)}` : '';
    const res = await fetch(`https://api.vercel.com/v13/deployments/${id}?hard=1${teamParam}`, {
        method: 'DELETE',
        headers,
    });
    if (res.status === 404) {
        return { id, ok: true, skipped: true };
    }
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete ${id}: ${res.status} ${text}`);
    }
    return { id, ok: true };
}

(async () => {
    console.log(`Pruning Vercel deployments for branch: ${branch}${dryRun ? ' (dry-run)' : ''}`);

    // Protección básica contra ramas principales
    const protectedBranches = new Set(['main', 'master', 'production', 'prod']);
    let deletingProtected = false;
    if (protectedBranches.has(branch)) {
        if (!forceDeleteProtected) {
            console.log(`Branch '${branch}' is protected. Aborting.`);
            process.exit(0);
        }
        // Requiere confirmación explícita del nombre de la rama para minimizar riesgos
        if (protectedConfirm !== branch) {
            console.error(`Override requested but missing/incorrect PROTECTED_CONFIRM. Set PROTECTED_CONFIRM='${branch}' to proceed.`);
            process.exit(2);
        }
        deletingProtected = true;
        console.log(`Override enabled for protected branch '${branch}'. Will only delete preview deployments (no production).`);
    }

    const deployments = await listDeploymentsByBranch(branch);
    if (!deployments.length) {
        console.log('No deployments found for this branch.');
        return;
    }
    // Si estamos en override de rama protegida, limitamos a target === 'preview'.
    const candidates = deletingProtected ? deployments.filter(d => d.target === 'preview') : deployments;
    if (!candidates.length) {
        console.log('No matching preview deployments to delete (nothing to do).');
        return;
    }
    console.log(`Found ${candidates.length} deployment(s):`);
    candidates.forEach(d => {
        const url = d.url || d.alias?.[0] || '(no-url)';
        console.log(` - ${d.uid || d.id}  ${url}  state=${d.state} target=${d.target ?? '(n/a)'}`);
    });

    if (dryRun) {
        console.log('Dry-run enabled; not deleting.');
        return;
    }

    let ok = 0, fail = 0;
    for (const d of candidates) {
        try {
            const id = d.uid || d.id;
            const result = await deleteDeployment(id);
            if (result.ok) {
                ok++;
            } else {
                fail++;
            }
            console.log(`Deleted: ${id}`);
        } catch (e) {
            fail++;
            console.error(e.message || e);
        }
    }
    console.log(`Done. Deleted=${ok}, Failed=${fail}`);
    if (fail > 0) {
        process.exit(1);
    }
})();
