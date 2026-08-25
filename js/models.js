/* AI Can Run — model catalog.
   Open-weight models with public parameter counts and licenses.
   params: total parameters in billions; active: parameters active per token (MoE).
   vramFactor: multiplier for image/video models (larger runtime working set).
   sizes: approximate GGUF file size in GB at each quant (computed from params in scoring.js). */
window.MODELS = [
  // ── Chat & coding ────────────────────────────────────────────
  { id: "qwen3.5-4b",    name: "Qwen 3.5 4B",       company: "Alibaba",  params: 4,   active: 4,   moe: false, types: ["chat", "code"],  license: "Apache 2.0", hf: "Qwen/Qwen3.5-4B",       desc: "Chat and coding on 8 GB cards and most laptops." },
  { id: "qwen3.8-8b",    name: "Qwen 3.8 8B",       company: "Alibaba",  params: 8,   active: 8,   moe: false, types: ["chat"],           license: "Apache 2.0", hf: "Qwen/Qwen3.8-8B",       desc: "Solid all-round chat model for 8–12 GB machines." },
  { id: "qwen3.8-27b",   name: "Qwen 3.8 27B",      company: "Alibaba",  params: 27,  active: 27,  moe: false, types: ["chat", "vision"], license: "Apache 2.0", hf: "Qwen/Qwen3.8-27B",      desc: "Dense multimodal all-rounder with long context." },
  { id: "gpt-oss-20b",   name: "GPT-OSS 20B",       company: "OpenAI",   params: 20,  active: 3.6, moe: true,  types: ["chat", "code", "reasoning"], license: "Apache 2.0", hf: "openai/gpt-oss-20b", desc: "Open-weight MoE for reasoning and tool use." },
  { id: "llama4-maverick", name: "Llama 4 Maverick",company: "Meta",     params: 128, active: 17,  moe: true,  types: ["chat", "vision"], license: "Llama 4 Community", hf: "meta-llama/Llama-4-Maverick-17B-128E", desc: "Big MoE — needs 80 GB+ class hardware." },
  { id: "llama4-scout",  name: "Llama 4 Scout",     company: "Meta",     params: 109, active: 17,  moe: true,  types: ["chat", "vision"], license: "Llama 4 Community", hf: "meta-llama/Llama-4-Scout-17B-16E", desc: "Lightweight sibling of Maverick, still 60 GB+ at Q4." },
  { id: "muse-glimmer-30b", name: "Muse Glimmer 30B", company: "Meta",  params: 30,  active: 30,  moe: false, types: ["chat", "vision", "tools"], license: "Llama 4 Community", hf: "meta-llama/Muse-Glimmer-30B", desc: "Agentic local model with vision and tool use." },
  { id: "gemma3-12b",    name: "Gemma 3 12B",       company: "Google",   params: 12,  active: 12,  moe: false, types: ["chat", "vision"], license: "Gemma Terms", hf: "google/gemma-3-12b-it", desc: "Multimodal and multilingual, comfortable on 16 GB." },
  { id: "gemma3n-4b",    name: "Gemma 3n 4B",       company: "Google",   params: 4,   active: 4,   moe: false, types: ["chat"],           license: "Gemma Terms", hf: "google/gemma-3n-4b-it", desc: "Tiny, fast, great for laptops and on-device apps." },
  { id: "deepseek-r1-14b", name: "DeepSeek R1 Distill 14B", company: "DeepSeek", params: 14, active: 14, moe: false, types: ["reasoning", "chat"], license: "MIT", hf: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B", desc: "Reasoning model that thinks before it answers." },
  { id: "deepseek-v3",   name: "DeepSeek V3",       company: "DeepSeek", params: 671, active: 37,  moe: true,  types: ["chat", "code", "reasoning"], license: "MIT", hf: "deepseek-ai/DeepSeek-V3", desc: "Frontier-class MoE — data-centre territory." },
  { id: "phi4-14b",      name: "Phi-4 14B",         company: "Microsoft", params: 14, active: 14,  moe: false, types: ["chat", "reasoning"], license: "MIT", hf: "microsoft/phi-4", desc: "Strong reasoning for its size, great on 16 GB." },
  { id: "mistral-small-24b", name: "Mistral Small 3.1 24B", company: "Mistral AI", params: 24, active: 24, moe: false, types: ["chat", "code"], license: "Apache 2.0", hf: "mistralai/Mistral-Small-3.1-24B", desc: "Fast dense model, fits well in 16–24 GB." },
  { id: "mixtral-8x7b",  name: "Mixtral 8x7B",      company: "Mistral AI", params: 47, active: 13,  moe: true,  types: ["chat"],           license: "Apache 2.0", hf: "mistralai/Mixtral-8x7B-Instruct", desc: "Early MoE classic — all experts load, ~26 GB at Q4." },
  { id: "glm4-9b",       name: "GLM-4 9B",          company: "Z.ai",     params: 9,   active: 9,   moe: false, types: ["chat"],           license: "MIT", hf: "zai-org/glm-4-9b-chat", desc: "Solid bilingual (EN/中文) chat model for 8–12 GB." },
  { id: "qwen3-coder-30b", name: "Qwen3 Coder 30B", company: "Alibaba",  params: 30,  active: 30,  moe: false, types: ["code", "chat"],   license: "Apache 2.0", hf: "Qwen/Qwen3-Coder-30B", desc: "Purpose-built coding model for 24 GB cards." },

  // ── Tiny / on-device ─────────────────────────────────────────
  { id: "tinyllama-1.1b", name: "TinyLlama 1.1B",   company: "TinyLlama Project", params: 1.1, active: 1.1, moe: false, types: ["tiny", "chat"], license: "Apache 2.0", hf: "TinyLlama/TinyLlama-1.1B-Chat", desc: "Runs on almost anything, even a Raspberry Pi." },
  { id: "smollm2-1.7b",  name: "SmolLM2 1.7B",      company: "Hugging Face", params: 1.7, active: 1.7, moe: false, types: ["tiny", "chat"], license: "Apache 2.0", hf: "HuggingFaceTB/SmolLM2-1.7B-Instruct", desc: "Tiny and capable — ideal for phones and edge boxes." },
  { id: "qwen3-0.6b",    name: "Qwen3 0.6B",        company: "Alibaba",  params: 0.6, active: 0.6, moe: false, types: ["tiny", "chat"], license: "Apache 2.0", hf: "Qwen/Qwen3-0.6B", desc: "Micro model for embedded and low-power devices." },

  // ── Image generation ─────────────────────────────────────────
  { id: "flux2-klein-4b", name: "FLUX.2 Klein 4B",  company: "Black Forest Labs", params: 4, active: 4, moe: false, types: ["image"], license: "FLUX.2 Dev Non-Commercial", hf: "black-forest-labs/FLUX.2-Klein", vramFactor: 2.0, desc: "Fast local text-to-image on consumer GPUs." },
  { id: "flux1-dev-12b", name: "FLUX.1 Dev 12B",    company: "Black Forest Labs", params: 12, active: 12, moe: false, types: ["image"], license: "FLUX.1 Dev Non-Commercial", hf: "black-forest-labs/FLUX.1-dev", vramFactor: 1.8, desc: "High-quality image generation, needs 16 GB+." },
  { id: "sd3.5-large-8b", name: "SD 3.5 Large 8B",  company: "Stability AI", params: 8, active: 8, moe: false, types: ["image"], license: "Stability Non-Commercial", hf: "stabilityai/stable-diffusion-3.5-large", vramFactor: 1.8, desc: "Balanced quality and speed for 12–16 GB cards." },
  { id: "z-image-3b",    name: "Z-Image 3B",        company: "Alibaba",  params: 3,   active: 3,   moe: false, types: ["image"],         license: "Apache 2.0", hf: "zai-org/Z-Image", vramFactor: 1.8, desc: "Lightweight image model — 8 GB is enough." },

  // ── Video generation ─────────────────────────────────────────
  { id: "wan2.2-ti2v-5b", name: "Wan 2.2 TI2V 5B",  company: "Alibaba",  params: 5,   active: 5,   moe: false, types: ["video"],         license: "Apache 2.0", hf: "Wan-AI/Wan2.2-TI2V-5B", vramFactor: 2.2, desc: "Open text/image-to-video that fits 12 GB+" },
  { id: "wan2.2-t2v-14b", name: "Wan 2.2 T2V 14B",  company: "Alibaba",  params: 14,  active: 14,  moe: false, types: ["video"],         license: "Apache 2.0", hf: "Wan-AI/Wan2.2-T2V-14B", vramFactor: 2.0, desc: "Higher quality video, wants 24 GB+." },
  { id: "ltx-video-13b", name: "LTX-Video 13B",     company: "Lightricks", params: 13, active: 13, moe: false, types: ["video"],         license: "Apache 2.0", hf: "Lightricks/LTX-Video", vramFactor: 1.8, desc: "Fast open video model for 16–24 GB cards." }
];

/* Quantization levels: bits per weight (approx) and display label. */
window.QUANTS = [
  { id: "q2",  label: "Q2_K", bits: 2.6 },
  { id: "q3",  label: "Q3_K_M", bits: 3.6 },
  { id: "q4",  label: "Q4_K_M", bits: 4.5, default: true },
  { id: "q5",  label: "Q5_K_M", bits: 5.4 },
  { id: "q6",  label: "Q6_K",  bits: 6.4 },
  { id: "q8",  label: "Q8_0",  bits: 8.5 },
  { id: "f16", label: "F16",   bits: 16 }
];

/* Approximate file size in GB for a model at a given quant. */
function quantFileGB(model, quant) {
  return (model.params * (quant.bits / 8) * 1.03).toFixed(1);
}
