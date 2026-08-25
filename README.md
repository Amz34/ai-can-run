# AI Can Run

**Which open AI models can your PC run locally?**

AI Can Run detects your GPU, CPU and memory in the browser and ranks the open-weight
models (chat, coding, image, video) that actually fit your hardware — with letter
grades, VRAM estimates and speed guesses.

- 🔍 Hardware detection via WebGL / WebGPU / browser APIs
- 🖥️ 40+ GPUs, Apple Silicon M1–M5, single-board computers and phones
- 🤖 25 open models: Qwen, Llama, Gemma, DeepSeek, Phi, Mistral, FLUX, Wan and more
- 📊 Quantization-aware VRAM math (Q2 → F16)
- 🔒 100% client-side — zero tracking, zero uploads, no server

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Or just open `index.html` (no build step, no dependencies).

## Deployment

Static site — deployable anywhere (Netlify, Vercel, GitHub Pages, nginx).
Netlify config is included (`netlify.toml`).

```bash
netlify deploy --prod --dir=.
```

## How the math works

VRAM estimate = `params × bits-per-weight ÷ 8 + 0.5 GB overhead`, plus a 10% safety
margin for KV cache and spikes. Speed is estimated from memory bandwidth and active
parameters. Grades are **estimates**, not guarantees — real performance depends on
drivers, cooling and background load.

## Data sources

- GPU specs: public vendor sheets (NVIDIA, AMD, Intel, Apple)
- Model parameters & licences: official Hugging Face model cards

## Credits

Independent tool by **Sanad** (websites, AI tools & cloud hosting).
Inspired by [CanIRun.ai](https://www.canirun.ai) by midudev — methodology is public;
this implementation is written from scratch.

## Licence

MIT — see [LICENSE](LICENSE). Model licences belong to their respective labs.
