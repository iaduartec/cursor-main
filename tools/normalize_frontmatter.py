#!/usr/bin/env python3
"""Normaliza frontmatter YAML en archivos .mdx dentro de content/ y servicios/.
- Intenta parsear el frontmatter; si OK, vuelve a escribirlo usando yaml.safe_dump para estandarizar.
- Si falla y detecta un bloque JSON bajo "schema:", lo convierte a un bloque literal (|) para evitar parse errors.
"""
from pathlib import Path
import re
import sys
import yaml

ROOT = Path(__file__).resolve().parents[1]
MDX_PATHS = list((ROOT / "content").rglob("*.mdx")) + list((ROOT / "content").rglob("*.mdx"))
# also include servicios
MDX_PATHS += list((ROOT / "content").rglob("*.mdx"))
# Better: scan both content and servicios
MDX_PATHS = list((ROOT / "content").rglob("*.mdx")) + list((ROOT / "servicios").rglob("*.mdx")) if (ROOT / "servicios").exists() else list((ROOT / "content").rglob("*.mdx"))

print(f"Found {len(MDX_PATHS)} mdx files to check")

for p in MDX_PATHS:
    text = p.read_text(encoding="utf-8")
    if not text.startswith("---"):
        continue
    try:
        fm_raw, body = text.split("---", 2)[1:3]
    except Exception:
        # fallback split
        parts = text.split("---")
        if len(parts) >= 3:
            fm_raw = parts[1]
            body = "---".join(parts[2:])
        else:
            print(f"[SKIP] Couldn't split frontmatter for {p}")
            continue
    fm_raw_str = fm_raw
    # Try parse
    try:
        data = yaml.safe_load(fm_raw_str)
        if not isinstance(data, dict):
            print(f"[WARN] frontmatter not mapping for {p}")
            continue
        # Re-dump frontmatter
        new_fm = yaml.safe_dump(data, allow_unicode=True, sort_keys=False)
        new_text = "---\n" + new_fm + "---\n\n" + body.lstrip('\n')
        p.write_text(new_text, encoding="utf-8")
        print(f"[OK] Normalized frontmatter for {p}")
    except Exception as e:
        # Attempt to fix schema inline JSON
        if "schema:" in fm_raw_str and "{" in fm_raw_str:
            # Replace pattern: schema:\n  { ... }  -> schema: |\n  { ... }
            fm_lines = fm_raw_str.splitlines()
            out_lines = []
            i = 0
            changed = False
            while i < len(fm_lines):
                line = fm_lines[i]
                if line.strip().startswith("schema:"):
                    # capture following indented block starting with '{'
                    j = i+1
                    if j < len(fm_lines) and fm_lines[j].lstrip().startswith("{"):
                        # collect until line that starts with '}' at same indent
                        block = [fm_lines[j]]
                        j += 1
                        while j < len(fm_lines):
                            block.append(fm_lines[j])
                            if fm_lines[j].lstrip().startswith("}"):
                                break
                            j += 1
                        # create literal block
                        out_lines.append("schema: |")
                        for bl in block:
                            out_lines.append("  " + bl.rstrip())
                        i = j+1
                        changed = True
                        continue
                out_lines.append(line)
                i += 1
            if changed:
                new_fm_str = "\n".join(out_lines)
                # try parse now
                try:
                    data = yaml.safe_load(new_fm_str)
                    new_fm = yaml.safe_dump(data, allow_unicode=True, sort_keys=False)
                    new_text = "---\n" + new_fm + "---\n\n" + body.lstrip('\n')
                    p.write_text(new_text, encoding="utf-8")
                    print(f"[FIXED] Rewrote schema as literal for {p}")
                    continue
                except Exception as e2:
                    # As last resort, write schema as literal raw text
                    final_fm = new_fm_str
                    new_text = "---\n" + final_fm + "\n---\n\n" + body.lstrip('\n')
                    p.write_text(new_text, encoding="utf-8")
                    print(f"[FORCED] Wrote schema as literal text for {p} (parse still fails)")
                    continue
        print(f"[ERR] Could not normalize {p}: {e}")

print("Done")
