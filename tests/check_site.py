#!/usr/bin/env python3
"""CI gate for the static site: required files, JS syntax, internal links,
local asset references and the social/SEO surface that makes the tool
shareable. Exits non-zero on the first category that fails."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []
notes: list[str] = []

REQUIRED = [
    "index.html",
    "css/styles.css",
    "js/app.js",
    "js/gpu-db.js",
    "js/hardware.js",
    "js/models.js",
    "js/scoring.js",
    "robots.txt",
    "sitemap.xml",
    "LICENSE",
    "README.md",
    "assets/og-card.png",
]

for rel in REQUIRED:
    p = ROOT / rel
    if not p.exists():
        errors.append(f"missing required file: {rel}")
    elif p.stat().st_size == 0:
        errors.append(f"empty file: {rel}")

html = (ROOT / "index.html").read_text(encoding="utf-8") if (ROOT / "index.html").exists() else ""

# --- SEO / social surface -------------------------------------------------
for tag, needle in [
    ("canonical link", 'rel="canonical"'),
    ("og:title", 'property="og:title"'),
    ("og:description", 'property="og:description"'),
    ("og:image", 'property="og:image"'),
    ("twitter:card", 'name="twitter:card"'),
    ("viewport meta", 'name="viewport"'),
    ("meta description", 'name="description"'),
    ("JSON-LD block", 'application/ld+json'),
]:
    if needle not in html:
        errors.append(f"index.html missing {tag} ({needle})")
    else:
        notes.append(f"seo ok: {tag}")

if 'name="viewport"' in html and "width=device-width" not in html:
    errors.append("viewport meta is not responsive (missing width=device-width)")

# og:image must point at a repo-local asset, never a private JWT user-images URL
og = re.search(r'property="og:image"\s+content="([^"]+)"', html)
if og:
    url = og.group(1)
    if "private-user-images.githubusercontent.com" in url:
        errors.append("og:image uses an expiring private-user-images URL")
    elif not url.startswith("http"):
        errors.append(f"og:image must be absolute for crawlers: {url}")
    else:
        notes.append(f"og:image -> {url}")

# --- local asset references exist ----------------------------------------
for ref in sorted(set(re.findall(r'(?:src|href)="(?!#|https?:|mailto:|data:)([^"]+)"', html))):
    if ref.endswith("/"):
        continue
    if not (ROOT / ref).exists():
        errors.append(f"index.html references missing local asset: {ref}")

# --- JS syntax ------------------------------------------------------------
import subprocess

js_files = sorted((ROOT / "js").glob("*.js"))
if not js_files:
    errors.append("no JavaScript files found in js/")
for js in js_files:
    proc = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
    if proc.returncode != 0:
        errors.append(f"JS syntax error in {js.name}: {proc.stderr.strip().splitlines()[-1] if proc.stderr else 'unknown'}")
    else:
        notes.append(f"js ok: {js.name}")

# --- sitemap sanity -------------------------------------------------------
sm = (ROOT / "sitemap.xml").read_text(encoding="utf-8") if (ROOT / "sitemap.xml").exists() else ""
if sm and "amz34.github.io/ai-can-run" not in sm:
    errors.append("sitemap.xml does not reference the live site URL")
if "Sitemap:" not in (ROOT / "robots.txt").read_text(encoding="utf-8") if (ROOT / "robots.txt").exists() else True:
    errors.append("robots.txt does not declare the sitemap")

# --- README surface -------------------------------------------------------
rd = (ROOT / "README.md").read_text(encoding="utf-8") if (ROOT / "README.md").exists() else ""
if rd:
    if "img.shields.io" not in rd:
        errors.append("README has no badges")
    if "https://amz34.github.io/ai-can-run/" not in rd:
        errors.append("README does not link the live site")
    for link in sorted(set(re.findall(r"\]\((?!https?://|#)([^)]+)\)", rd))):
        if not (ROOT / link).exists():
            errors.append(f"README relative link is broken: {link}")

print(f"checked {len(REQUIRED)} required files, {len(js_files)} JS files, {len(notes)} assertions")
for n in notes:
    print(f"  ok  {n}")
if errors:
    print("\nFAILED:")
    for e in errors:
        print(f"  - {e}")
    sys.exit(1)
print("site gate: PASS")
