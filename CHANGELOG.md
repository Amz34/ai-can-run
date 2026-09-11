# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] — 2026-09-11

### Added
- Social preview card (`assets/og-card.png`, 1200×630) wired into Open Graph and
  Twitter card metadata so shared links render a real preview.
- Canonical URL, `theme-color`, richer `robots` directive and JSON-LD
  `WebApplication` structured data for search engines.
- `sitemap.xml` plus a sitemap declaration in `robots.txt`.
- CI workflow gating the site: required files, JS syntax via `node --check`,
  local asset references, SEO/social surface, README badges and live-site link.
- `tests/check_site.py`, a dependency-free gate that runs locally too.
- Cross-link to the Self-Hosted Agent Stack project.

### Changed
- README rebuilt as a landing page: live-site badges, coverage tables, VRAM math
  explanation, FAQ and honest limits section.

## [1.0.0] — 2026-08-24

### Added
- Initial public release: browser hardware detection (WebGL / WebGPU / CPU / RAM),
  quantisation-aware VRAM estimation, letter grades and speed estimates across
  chat, coding, image and video models.
- GPU database covering NVIDIA, AMD, Intel, Apple Silicon and single-board
  computers; fully client-side — no uploads, no tracking.
