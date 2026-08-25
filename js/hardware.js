/* AI Can Run — client-side hardware detection.
   Uses standard browser APIs only. Nothing is sent to any server. */

window.detectHardware = async function detectHardware() {
  const info = {
    gpuRenderer: null,
    gpuVendor: null,
    cores: navigator.hardwareConcurrency || null,
    ram: navigator.deviceMemory || null,          // GB, approximate (Chrome/Edge)
    webgpu: false,
    webgpuDevice: null,
    webgpuArch: null,
    platform: navigator.platform || null,
    userAgent: navigator.userAgent || "",
    isMobile: /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent || ""),
    matched: null                                 // result of matchDevice()
  };

  // ── WebGL: GPU name ─────────────────────────────────────────
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        info.gpuRenderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || null;
        info.gpuVendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || null;
      }
    }
  } catch (e) { /* detection is best-effort */ }

  // ── WebGPU: architecture hints ──────────────────────────────
  try {
    if (navigator.gpu && navigator.gpu.requestAdapter) {
      const adapter = await navigator.gpu.requestAdapter();
      if (adapter) {
        info.webgpu = true;
        const ainfo = adapter.info || {};
        info.webgpuDevice = ainfo.device || null;
        info.webgpuArch = ainfo.architecture || null;
      }
    }
  } catch (e) { /* optional */ }

  // ── Match against hardware database ─────────────────────────
  if (info.isMobile) {
    info.matched = { kind: "mobile", label: info.ram >= 12 ? "Flagship phone (12GB+)" : "Modern phone (8GB+)",
                     vram: info.ram >= 12 ? 12 : 8, bw: info.ram >= 12 ? 70 : 50 };
  } else {
    info.matched = window.matchDevice(info.gpuRenderer);
    if (!info.matched && info.webgpuDevice) {
      info.matched = window.matchDevice(info.webgpuDevice);
    }
  }
  return info;
};

/* Build a human-readable summary of detected hardware. */
window.describeHardware = function describeHardware(info) {
  const parts = [];
  if (info.matched) parts.push(info.matched.label);
  else if (info.gpuRenderer) parts.push(cleanGpuLabel(info.gpuRenderer));
  if (info.cores) parts.push(info.cores + " cores");
  if (info.ram) parts.push("~" + info.ram + " GB RAM");
  return parts.length ? parts.join(" · ") : "Not detected";
};

function cleanGpuLabel(renderer) {
  // "ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 Direct3D11 ...)" → "NVIDIA GeForce RTX 4090"
  const m = renderer.match(/\(([^)]+)\)/);
  const inner = m ? m[1] : renderer;
  const parts = inner.split(",");
  return parts[parts.length - 1].trim().split("Direct3D")[0].trim().slice(0, 48);
}
