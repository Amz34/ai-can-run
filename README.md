# AI Can Run

**Find out which open AI models your PC can actually run — before downloading 40 GB.**

[![Live site](https://img.shields.io/badge/live-amz34.github.io%2Fai--can--run-22d3ee)](https://amz34.github.io/ai-can-run/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![No tracking](https://img.shields.io/badge/privacy-no%20uploads%2C%20no%20tracking-4ade80)](#privacy)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-blue)](#run-locally)
[![CI](https://github.com/Amz34/ai-can-run/actions/workflows/ci.yml/badge.svg)](https://github.com/Amz34/ai-can-run/actions/workflows/ci.yml)

**[Open the live tool →](https://amz34.github.io/ai-can-run/)**

AI Can Run detects your GPU, CPU and memory **in the browser**, then ranks the
open-weight models that actually fit your hardware — chat, coding, image and
video — with letter grades, quantisation-aware VRAM estimates and speed
predictions.

## Why it exists

The most common way people waste an evening on local AI is downloading a model
their machine cannot hold comfortably. Model cards list parameter counts, not
the number that decides the outcome: **VRAM after quantisation, plus cache
overhead**. AI Can Run answers that question in about two seconds, with no
install, no account and no upload.

## What it covers

| Layer | Coverage |
| --- | --- |
| GPUs | 40+ discrete cards across NVIDIA, AMD and Intel |
| Apple Silicon | M1 through M5, unified-memory aware |
| CPU paths | x86-64 and ARM, including single-board computers |
| Memory | VRAM, system RAM and shared-memory trade-offs |
| Models | 25 open-weight chat, coding, image and video models |
| Quantisations | Q2 → F16, with per-quantisation VRAM cost |
| Output | Letter grade, VRAM headroom, estimated tokens/sec |

## How the math works

```
VRAM estimate = params × bits-per-weight ÷ 8 + overhead + KV cache
```

Overhead and cache allowance are added per architecture rather than assumed, so
grades reflect the *whole* working set, not just the weight file. Speed is
estimated from memory bandwidth and active parameters. Every number is an
**estimate, not a guarantee** — drivers, cooling and background load all move
real throughput.

## Run locally

```bash
git clone https://github.com/Amz34/ai-can-run.git
cd ai-can-run
python3 -m http.server 8080
# open http://localhost:8080
```

No build step, no package manager, no dependencies. Opening `index.html`
directly also works.

## Verification

```bash
python3 tests/check_site.py
```

The gate checks required files, JavaScript syntax (`node --check`), local asset
references, the SEO/social surface and README links. The same script runs in CI
on every push and pull request.

## Privacy

Detection happens entirely in your browser through standard WebGL / WebGPU and
hardware APIs. There is no backend, no analytics, no cookie and no upload — the
page works offline after the first load. You can confirm this in the network tab.

## Honest limits

- Detection is approximate: browsers expose a limited hardware view.
- Grades assume a clean machine with no other model resident in memory.
- Speed figures are bandwidth-derived estimates, not benchmarks.
- Model coverage is curated manually and will lag new releases.

## Contributing

Corrections to the GPU or model database are the most valuable contribution —
see [CONTRIBUTING.md](CONTRIBUTING.md). Please include a source for any spec
change so the table stays verifiable.

## Credits

Inspired by [CanIRun.ai](https://www.canirun.ai). Model names and licences
belong to their respective labs; GPU specifications come from public vendor
documentation.

## License

[MIT](LICENSE)

---

Related project: **[Self-Hosted Agent Stack](https://github.com/Amz34/selfhosted-agent-stack)** —
the operations side of running agents around the clock on free cloud hardware.
