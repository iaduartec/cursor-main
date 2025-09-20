const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');

function listMdx(dir) {
    const out = [];
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) {
            out.push(...listMdx(p));
        } else if (ent.isFile() && ent.name.endsWith('.mdx')) {
            out.push(p);
        }
    }
    return out;
}

function backup(file) {
    const bak = `${file}.bak-frontmatter`;
    if (!fs.existsSync(bak)) {
        fs.copyFileSync(file, bak);
    }
}

function tryParse(file) {
    const raw = fs.readFileSync(file, 'utf8');
    try {
        matter(raw);
        return { ok: true };
    } catch (err) {
        return { ok: false, error: err };
    }
}

function applyFixes(file) {
    let raw = fs.readFileSync(file, 'utf8');
    const orig = raw;

    // Fix common issue: '----' instead of '---' for frontmatter separators
    raw = raw.replace(/^----\s*\n/m, '---\n');

    // Remove duplicated frontmatter blocks: if file contains two initial '---' blocks,
    // keep the last block (the more complete one) and the rest of content.
    if (raw.startsWith('---')) {
        const parts = raw.split('\n---\n');
        if (parts.length > 2) {
            // rebuild using the last frontmatter and the remaining body
            const lastFm = parts[parts.length - 2];
            const body = parts[parts.length - 1];
            raw = `---\n${lastFm}\n---\n${body}`;
        }
    }

    // Trim stray leading garbage before frontmatter
    if (!raw.startsWith('---')) {
        const idx = raw.indexOf('\n---');
        if (idx !== -1) {
            raw = raw.slice(idx + 1);
        }
    }

    if (raw !== orig) {
        backup(file);
        fs.writeFileSync(file, raw, 'utf8');
        return true;
    }
    return false;
}

function main() {
    console.log('Validating MDX frontmatter...');
    const files = listMdx(CONTENT_DIR);
    const failures = [];
    const fixed = [];
    for (const f of files) {
        const res = tryParse(f);
        if (res.ok) {continue;}
        failures.push({ file: f, error: String(res.error) });
    }

    if (failures.length === 0) {
        console.log('All MDX files parsed successfully.');
        return;
    }

    console.log(`Found ${failures.length} files with YAML parse errors. Attempting automated fixes...`);
    for (const item of failures) {
        try {
            const changed = applyFixes(item.file);
            if (changed) {
                // re-parse to confirm
                const {ok} = tryParse(item.file);
                if (ok) {fixed.push(item.file);}
                else {console.warn(`Could not fix: ${item.file}`);}
            } else {
                console.warn(`No automatic fix applied for: ${item.file}`);
            }
        } catch (e) {
            console.error(`Error while fixing ${item.file}: ${e && e.message}`);
        }
    }

    console.log(`Automated fixes applied to ${fixed.length} files.`);
    if (fixed.length) {
        console.log('Files fixed:');
        for (const f of fixed) {console.log(' -', path.relative(ROOT, f));}
    }

    const stillFailing = [];
    for (const f of files) {
        if (!tryParse(f).ok) {stillFailing.push(f);}
    }
    console.log(`Remaining failures: ${stillFailing.length}`);
    for (const f of stillFailing.slice(0, 30)) {console.log(' x', path.relative(ROOT, f));}
    if (stillFailing.length > 30) {console.log('...');}
}

main();
