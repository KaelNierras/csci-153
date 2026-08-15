#!/usr/bin/env python3
"""
Build the CSci 153 course site.

Layout
------
    shared/deck.css, deck.js     the design system + deck engine
    module-N/index.html          the deck, linking ../shared/*  (served by Pages)
    module-N/module.json         metadata for the landing page
    module-N/module-N.js         module-specific widgets

What this produces
------------------
    index.html                   landing page listing every module
    module-N/module-N.standalone.html
                                 one portable file with the shared assets inlined,
                                 for offline projection and VSUEE upload

GitHub Pages serves the *linked* version, so students fetch shared/deck.css once and
it is cached across all modules. The standalone build exists for anywhere that has
no network or blocks external files.

Usage
-----
    python3 shared/build.py            # everything
    python3 shared/build.py module-1   # one module
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

LINK = re.compile(r'<link[^>]*href="([^"]+\.css)"[^>]*>')
SCRIPT = re.compile(r'<script[^>]*src="([^"]+\.js)"[^>]*>\s*</script>')
TITLE = re.compile(r"<title>(.*?)</title>", re.S)


# --------------------------------------------------------------------------
# standalone builds
# --------------------------------------------------------------------------
def inline(html: str, base: Path, report: list) -> str:
    def css(m):
        path = (base / m.group(1)).resolve()
        if not path.exists():
            report.append(f"  ! missing {path}")
            return m.group(0)
        report.append(f"  + {path.relative_to(ROOT)}")
        return "<style>\n" + path.read_text(encoding="utf-8") + "\n</style>"

    def js(m):
        path = (base / m.group(1)).resolve()
        if not path.exists():
            report.append(f"  ! missing {path}")
            return m.group(0)
        report.append(f"  + {path.relative_to(ROOT)}")
        code = path.read_text(encoding="utf-8")
        # A literal </script anywhere in the source — even inside a comment —
        # would close the inlined block early and kill the rest of the file.
        code = re.sub(r"</(script)", r"<\\/\1", code, flags=re.I)
        return "<script>\n" + code + "\n</script>"

    return SCRIPT.sub(js, LINK.sub(css, html))


def build_module(module_dir: Path) -> dict | None:
    src = module_dir / "index.html"
    meta_file = module_dir / "module.json"
    meta = json.loads(meta_file.read_text(encoding="utf-8")) if meta_file.exists() else {}
    meta["slug"] = module_dir.name

    if not src.exists():
        print(f"{module_dir.name}: no index.html — listed as '{meta.get('status', 'planned')}'\n")
        return meta

    report: list = []
    html = inline(src.read_text(encoding="utf-8"), src.parent, report)
    out = module_dir / f"{module_dir.name}.standalone.html"
    out.write_text(html, encoding="utf-8")

    found = TITLE.search(html)
    meta["deck_title"] = found.group(1).strip() if found else meta.get("title", module_dir.name)
    meta["standalone"] = out.name
    meta["kb"] = round(out.stat().st_size / 1024)

    print(f"{src.relative_to(ROOT)}")
    for line in report:
        print(line)
    print(f"  -> {out.relative_to(ROOT)}  ({meta['kb']} KB)\n")
    return meta


# --------------------------------------------------------------------------
# landing page
# --------------------------------------------------------------------------
def card(m: dict) -> str:
    ready = m.get("status") == "ready"
    slug = m["slug"]
    num = str(m.get("number", "?")).zfill(2)

    labs = "".join(
        f'<a class="lab" href="{slug}/{href}">{name}</a>'
        for name, href in m.get("labs", [])
    )
    meta_bits = [f'{m.get("weeks", "")}', f'{m.get("outcome", "")}']
    if ready:
        meta_bits.append(f'{m.get("slides", 0)} slides')
    meta_line = " · ".join(b for b in meta_bits if b)

    if ready:
        return f"""      <article class="mod">
        <a class="mod__main" href="{slug}/">
          <span class="mod__n">{num}</span>
          <span class="mod__body">
            <span class="mod__t">{m.get("title", slug)}</span>
            <span class="mod__s">{m.get("subtitle", "")}</span>
            <span class="mod__m">{meta_line}</span>
          </span>
          <span class="mod__go">Open deck →</span>
        </a>
        <div class="mod__foot">
          {labs}
          <span class="spacer"></span>
          <a class="lab" href="{slug}/{m.get("standalone", "")}" download>Offline copy · {m.get("kb", 0)} KB</a>
        </div>
      </article>"""

    return f"""      <article class="mod mod--soon">
        <div class="mod__main">
          <span class="mod__n">{num}</span>
          <span class="mod__body">
            <span class="mod__t">{m.get("title", slug)}</span>
            <span class="mod__s">{m.get("subtitle", "")}</span>
            <span class="mod__m">{meta_line}</span>
          </span>
          <span class="mod__go mod__go--soon">In preparation</span>
        </div>
      </article>"""


def landing(modules: list) -> str:
    cards = "\n".join(card(m) for m in modules)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CSci 153 — Web Systems and Technologies</title>
<meta name="description" content="Course decks and laboratory activities for CSci 153, Department of Computer Science and Technology, Visayas State University.">
<link rel="stylesheet" href="shared/deck.css">
<style>
  body {{ overflow: auto; }}
  .page {{
    max-width: 60rem; margin: 0 auto;
    padding: var(--s8) var(--s5) var(--s7);
    display: flex; flex-direction: column; gap: var(--s6);
  }}
  .masthead {{ display: flex; flex-direction: column; gap: var(--s3); }}
  .masthead h1 {{
    font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.02;
    letter-spacing: -0.035em;
  }}
  .mods {{ display: flex; flex-direction: column; gap: var(--s3); }}
  .mod {{ border: 1px solid var(--line); background: var(--panel); }}
  .mod__main {{
    display: grid; grid-template-columns: 3rem 1fr auto;
    gap: var(--s4); align-items: center;
    padding: var(--s5); text-decoration: none; color: inherit;
    transition: background .15s var(--ease);
  }}
  a.mod__main:hover {{ background: var(--panel-3); }}
  a.mod__main:hover .mod__go {{ color: var(--accent-lit); }}
  .mod__n {{
    font-family: var(--mono); font-size: 1.5rem; color: var(--accent);
    font-variant-numeric: tabular-nums;
  }}
  .mod__body {{ display: flex; flex-direction: column; gap: 0.3rem; }}
  .mod__t {{ font-size: 1.15rem; font-weight: 600; letter-spacing: -0.015em; }}
  .mod__s {{ font-size: 0.9rem; color: var(--text-2); }}
  .mod__m {{
    font-family: var(--mono); font-size: 0.65rem; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--text-4); margin-top: 0.2rem;
  }}
  .mod__go {{
    font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--accent); white-space: nowrap;
  }}
  .mod__go--soon {{ color: var(--text-4); }}
  .mod--soon {{ opacity: 0.55; }}
  .mod--soon .mod__n {{ color: var(--text-4); }}
  .mod__foot {{
    display: flex; align-items: center; gap: var(--s4); flex-wrap: wrap;
    border-top: 1px solid var(--line-soft); padding: var(--s3) var(--s5);
  }}
  .mod__foot .spacer {{ flex: 1; }}
  .lab {{
    font-family: var(--mono); font-size: 0.65rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--text-3); text-decoration: none;
    border-bottom: 1px solid var(--line-loud); padding-bottom: 2px;
  }}
  .lab:hover {{ color: var(--text); border-color: var(--accent); }}
  kbd {{
    font-family: var(--mono); font-size: 0.82em; color: var(--text);
    border: 1px solid var(--line-loud); border-bottom-width: 2px;
    padding: 0.1em 0.45em; margin: 0 0.1em; background: var(--panel);
  }}
  .foot {{
    display: flex; gap: var(--s4); flex-wrap: wrap;
    border-top: 1px solid var(--line); padding-top: var(--s4);
    font-size: 0.8rem; color: var(--text-3);
  }}
  @media (max-width: 40rem) {{
    .mod__main {{ grid-template-columns: 2.2rem 1fr; }}
    .mod__go {{ grid-column: 2; }}
  }}
</style>
</head>
<body>
  <div class="page">
    <header class="masthead">
      <span class="eyebrow eyebrow--plain">Visayas State University · Department of Computer Science and Technology</span>
      <h1>CSci 153<br>Web Systems and Technologies</h1>
      <p class="lede">Course decks and laboratory activities. Each deck is interactive —
        use <kbd>→</kbd> to advance, <kbd>O</kbd> for the slide map, <kbd>F</kbd> for fullscreen.</p>
    </header>

    <main class="mods">
{cards}
    </main>

    <footer class="foot">
      <span>First semester 2026–2027</span>
      <span>·</span>
      <span>Deep links work: append <code>#23</code> to any deck URL to open at that slide.</span>
    </footer>
  </div>
</body>
</html>
"""


# --------------------------------------------------------------------------
def main() -> int:
    names = sys.argv[1:]
    dirs = (
        [ROOT / n for n in names]
        if names
        else sorted(p for p in ROOT.glob("module-*") if p.is_dir())
    )
    if not dirs:
        print("No module folders found. Expected directories named 'module-N'.")
        return 1

    modules = []
    for d in dirs:
        if not d.is_dir():
            print(f"skip {d} — not a directory")
            continue
        meta = build_module(d)
        if meta:
            modules.append(meta)

    # only rewrite the landing page on a full build, so a single-module build
    # cannot silently drop the other modules from the index
    if not names:
        modules.sort(key=lambda m: m.get("number", 99))
        (ROOT / "index.html").write_text(landing(modules), encoding="utf-8")
        print(f"index.html  ({len(modules)} modules listed)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
