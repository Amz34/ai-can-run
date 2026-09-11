# Contributing

Thanks for helping make hardware answers accurate.

## The most useful contributions

1. **GPU corrections** — wrong memory bandwidth, missing cards, mislabelled
   unified memory. Add or edit the entry in `js/gpu-db.js`.
2. **Model coverage** — new open-weight releases with parameter count,
   quantisation options and licence in `js/models.js`.
3. **Scoring accuracy** — VRAM overhead or KV-cache assumptions that produce
   visibly wrong grades, in `js/scoring.js`.
4. **Accessibility and mobile** — the tool should work on a phone browser.

## Requirements for a database change

- Cite a source in the pull request: vendor spec sheet, official model card or
  a reproducible measurement from your own machine.
- State the hardware you verified on, if you verified locally.
- Keep values in the existing units and field names — the scoring code depends
  on them.

## Local checks

```bash
python3 tests/check_site.py     # required files, JS syntax, links, SEO surface
node --check js/app.js          # any file you touched
```

CI runs the same gate plus a sitemap XML parse on every push and pull request.

## Style

- Plain ES2020 JavaScript, no build step, no new dependencies. The site must
  keep working as static files.
- No tracking, no network calls, no external services.
- Keep the interface readable on a phone screen.

## Pull requests

Small and focused beats large and sweeping. One topic per PR, and describe the
user-visible effect rather than the diff. By contributing you agree your work
is licensed under the MIT licence of this repository.
