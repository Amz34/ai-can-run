/* AI Can Run — hardware database.
   Facts compiled from public vendor spec sheets (NVIDIA, AMD, Intel, Apple).
   vram = video memory in GB (Apple: unified memory), bw = memory bandwidth in GB/s. */
window.HW_DB = {
  gpus: {
    "RTX 5090":        { vram: 32, bw: 1792 },
    "RTX 5080":        { vram: 16, bw: 960  },
    "RTX 5070 Ti":     { vram: 16, bw: 896  },
    "RTX 5070":        { vram: 12, bw: 672  },
    "RTX 5060 Ti 16GB":{ vram: 16, bw: 448  },
    "RTX 5060 Ti":     { vram: 8,  bw: 448  },
    "RTX 5060":        { vram: 8,  bw: 448  },
    "RTX 5050":        { vram: 8,  bw: 320  },
    "RTX 4090":        { vram: 24, bw: 1008 },
    "RTX 4080 Super":  { vram: 16, bw: 736  },
    "RTX 4080":        { vram: 16, bw: 717  },
    "RTX 4070 Ti Super":{ vram: 16, bw: 672 },
    "RTX 4070 Ti":     { vram: 12, bw: 504  },
    "RTX 4070 Super":  { vram: 12, bw: 504  },
    "RTX 4070":        { vram: 12, bw: 504  },
    "RTX 4060 Ti 16GB":{ vram: 16, bw: 288  },
    "RTX 4060 Ti":     { vram: 8,  bw: 288  },
    "RTX 4060":        { vram: 8,  bw: 272  },
    "RTX 3090":        { vram: 24, bw: 936  },
    "RTX 3080":        { vram: 10, bw: 760  },
    "RTX 3070":        { vram: 8,  bw: 448  },
    "RTX 3060":        { vram: 12, bw: 360  },
    "A100 80GB":       { vram: 80, bw: 2039 },
    "H100 80GB":       { vram: 80, bw: 3350 },
    "RX 7900 XTX":     { vram: 24, bw: 960  },
    "RX 7900 XT":      { vram: 20, bw: 800  },
    "RX 7800 XT":      { vram: 16, bw: 624  },
    "RX 7700 XT":      { vram: 12, bw: 432  },
    "RX 7600":         { vram: 8,  bw: 288  },
    "RX 6900 XT":      { vram: 16, bw: 512  },
    "RX 6800 XT":      { vram: 16, bw: 512  },
    "RX 6700 XT":      { vram: 12, bw: 384  },
    "RX 6600":         { vram: 8,  bw: 224  },
    "Arc B580":        { vram: 12, bw: 456  },
    "Arc A770":        { vram: 16, bw: 560  },
    "Arc A750":        { vram: 8,  bw: 512  },
    "Arc A380":        { vram: 6,  bw: 186  }
  },
  apple: {
    "M1":        { vram: 8,  bw: 68   },
    "M1 Pro":    { vram: 16, bw: 200  },
    "M1 Max":    { vram: 32, bw: 400  },
    "M1 Ultra":  { vram: 64, bw: 800  },
    "M2":        { vram: 8,  bw: 100  },
    "M2 Pro":    { vram: 16, bw: 200  },
    "M2 Max":    { vram: 32, bw: 400  },
    "M2 Ultra":  { vram: 96, bw: 800  },
    "M3":        { vram: 8,  bw: 100  },
    "M3 Pro":    { vram: 18, bw: 150  },
    "M3 Max":    { vram: 36, bw: 400  },
    "M4":        { vram: 16, bw: 120  },
    "M4 Pro":    { vram: 24, bw: 273  },
    "M4 Max":    { vram: 36, bw: 546  },
    "M5":        { vram: 16, bw: 140  },
    "M5 Pro":    { vram: 24, bw: 300  },
    "M5 Max":    { vram: 36, bw: 600  }
  },
  sbc: {
    "Raspberry Pi 5 (8GB)": { vram: 8, bw: 8  },
    "Raspberry Pi 5 (16GB)":{ vram: 16, bw: 8 },
    "Raspberry Pi 4 (8GB)": { vram: 8, bw: 4  }
  },
  mobile: {
    "Modern phone (8GB+)": { vram: 8, bw: 50 },
    "Flagship phone (12GB+)": { vram: 12, bw: 70 }
  }
};

/* Normalize a WebGL renderer string and find a matching device.
   Handles: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 Direct3D11 ...)",
   "Apple M4 Pro GPU", "AMD Radeon RX 7900 XTX", "Intel(R) Arc(TM) A770". */
function matchDevice(renderer) {
  if (!renderer) return null;
  const r = renderer.toLowerCase();
  let best = null;

  // Apple Silicon
  const appleMatch = r.match(/apple (m\d+(?: pro| max| ultra)?)/);
  if (appleMatch) {
    const key = Object.keys(HW_DB.apple).find(
      (k) => appleMatch[1].toLowerCase() === k.toLowerCase()
    );
    if (key) best = { kind: "apple", label: "Apple " + key, ...HW_DB.apple[key] };
  }

  // Scan GPU list by normalized substring (longest match wins)
  const allGpus = [...Object.keys(HW_DB.gpus), ...Object.keys(HW_DB.sbc)];
  let bestLen = 0;
  for (const key of allGpus) {
    const k = key.toLowerCase();
    if (r.includes(k) && k.length > bestLen) {
      bestLen = k.length;
      const rec = HW_DB.gpus[key] || HW_DB.sbc[key];
      best = { kind: HW_DB.gpus[key] ? "gpu" : "sbc", label: key, ...rec };
    }
  }

  // Extract VRAM from names like "RTX 4090 (24GB)" or "Radeon ... 24GB"
  if (best && !best.vram) {
    const vramMatch = r.match(/(\d+)\s*gb/);
    if (vramMatch) best.vram = parseInt(vramMatch[1], 10);
  }
  return best;
}
