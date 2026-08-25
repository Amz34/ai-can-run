/* AI Can Run — VRAM math, speed estimates and grading.
   All results are estimates: real performance depends on drivers,
   thermals, background load and OS memory pressure. */

const GB_PER_B_PARAM = 0.56;   // ≈ 4.5 bits per weight (Q4_K_M) ÷ 8
const OVERHEAD_GB = 0.5;       // inference engine + CUDA/Metal context
const MARGIN = 1.10;           // 10% safety for KV cache and spikes

/* Total VRAM a model needs at a given quant (GB). */
window.modelVram = function modelVram(model, quant) {
  const eff = model.params * (model.vramFactor || 1);
  const weights = eff * (quant.bits / 8);
  return (weights + OVERHEAD_GB) * MARGIN;
};

/* How much VRAM is available for a detected device. */
window.deviceVram = function deviceVram(device) {
  return device ? device.vram : 0;
};

/* Run status for a model on a device. */
window.runStatus = function runStatus(vramNeeded, available) {
  if (!available) return "unknown";
  const pct = (vramNeeded / available) * 100;
  if (pct > 105) return "cannot-run";
  if (pct > 92) return "tight";
  return "can-run";
};

/* Rough tokens/second from memory bandwidth and active parameters. */
window.estimateTps = function estimateTps(device, model) {
  if (!device || !device.bw) return null;
  const active = Math.max(model.active || model.params, 0.5);
  let tps = (device.bw * 0.25) / active;
  if (model.types.includes("image") || model.types.includes("video")) {
    tps = null; // generation models are measured in seconds/image, not tokens
  }
  return tps ? Math.min(Math.max(Math.round(tps), 1), 200) : null;
};

/* Letter grade from status + speed. */
window.scoreGrade = function scoreGrade(status, tps) {
  switch (status) {
    case "cannot-run": return "F";
    case "tight":
      return tps !== null && tps >= 15 ? "C" : "D";
    case "can-run":
      if (tps === null) return "B";
      if (tps >= 40) return "S";
      if (tps >= 20) return "A";
      if (tps >= 10) return "B";
      return "C";
    default: return "?";
  }
};

window.GRADE_META = {
  S: { label: "Excellent", color: "#22c55e" },
  A: { label: "Very good", color: "#4ade80" },
  B: { label: "Good",      color: "#38bdf8" },
  C: { label: "Usable",    color: "#facc15" },
  D: { label: "Tight",     color: "#fb923c" },
  F: { label: "Doesn't fit", color: "#f87171" },
  "?": { label: "Unknown", color: "#94a3b8" }
};

/* Pick the smallest quant that fits; fall back to Q2 or null. */
window.bestQuant = function bestQuant(model, available) {
  let chosen = null;
  for (const q of window.QUANTS) {
    if (modelVram(model, q) <= available) { chosen = q; break; }
  }
  return chosen;
};
