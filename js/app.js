/* AI Can Run — UI logic. */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const state = {
    device: null,          // resolved device record {label, vram, bw, kind}
    deviceLabel: "Auto",
    detected: null,        // raw detection info
    type: "all",
    search: "",
    quant: window.QUANTS.find((q) => q.default) || window.QUANTS[3]
  };

  /* ── Device resolution ─────────────────────────────────── */
  function deviceFromLabel(label) {
    const groups = [HW_DB.gpus, HW_DB.apple, HW_DB.sbc, HW_DB.mobile];
    for (const g of groups) {
      if (Object.prototype.hasOwnProperty.call(g, label)) {
        return { label: label, kind: "custom", ...g[label] };
      }
    }
    return null;
  }

  function resolveDevice() {
    const sel = $("#device-select").value;
    if (sel === "auto") {
      if (state.detected && state.detected.matched) return state.detected.matched;
      return null;
    }
    if (sel === "custom") {
      const vram = parseFloat($("#custom-vram").value) || 0;
      return { label: "Custom (" + vram + " GB)", kind: "custom", vram: vram, bw: 0 };
    }
    return deviceFromLabel(sel);
  }

  /* ── Rendering ─────────────────────────────────────────── */
  function gradeColor(grade) {
    const meta = GRADE_META[grade] || GRADE_META["?"];
    return meta.color;
  }

  function renderDevicePanel() {
    const name = $("#device-name");
    const detail = $("#device-detail");
    if (!state.device) {
      name.textContent = "No device selected";
      detail.textContent = "Pick a device above to see results";
      return;
    }
    name.textContent = state.device.label;
    const bits = [];
    if (state.device.vram) bits.push(state.device.vram + " GB memory");
    if (state.device.bw) bits.push(state.device.bw + " GB/s bandwidth");
    if (state.detected && state.detected.cores) bits.push(state.detected.cores + " CPU cores");
    if (state.detected && state.detected.ram) bits.push("~" + state.detected.ram + " GB RAM");
    detail.textContent = bits.join(" · ") || "Manual selection";
  }

  function cardFor(model) {
    const vram = modelVram(model, state.quant);
    const available = state.device ? state.device.vram : 0;
    const status = runStatus(vram, available);
    const tps = estimateTps(state.device, model);
    const grade = scoreGrade(status, tps);
    const meta = GRADE_META[grade];
    const fileGB = quantFileGB(model, state.quant);
    const gradeLine = state.device
      ? '<span class="card-stat">Grade <b style="color:' + gradeColor(grade) + '">' + grade + "</b></span>"
      : "";
    const fitLine = state.device
      ? '<span class="card-stat">Needs <b>' + vram.toFixed(1) + " GB</b></span>"
      : '<span class="card-stat">File ~<b>' + fileGB + " GB</b></span>";
    const tpsLine = state.device && tps
      ? '<span class="card-stat">~<b>' + tps + "</b> tok/s</span>"
      : "";
    const tags = model.types
      .filter((t) => t !== "tiny")
      .map((t) => '<span class="tag">' + t + "</span>")
      .join("");
    return (
      '<article class="card" data-id="' + model.id + '" tabindex="0" role="button" aria-label="Details for ' + model.name + '">' +
        '<div class="card-top">' +
          '<div><div class="card-name">' + model.name + "</div>" +
          '<div class="card-company">' + model.company + " · " + model.params + "B" + (model.moe ? " MoE" : "") + "</div></div>" +
          '<div class="card-badge" style="background:' + meta.color + '" title="' + meta.label + '">' + grade + "</div>" +
        "</div>" +
        '<div class="card-stats">' + gradeLine + fitLine + tpsLine + "</div>" +
        '<p class="card-desc">' + model.desc + "</p>" +
        '<div class="card-tags">' + tags + '<span class="tag license">' + model.license + "</span></div>" +
      "</article>"
    );
  }

  function renderGrid() {
    const grid = $("#model-grid");
    const q = state.search.toLowerCase().trim();
    const list = MODELS.filter((m) => {
      if (state.type !== "all" && !m.types.includes(state.type)) return false;
      if (q && !(m.name + " " + m.company + " " + m.types.join(" ")).toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => {
      // Models that fit come first, then by grade, then params.
      const fa = state.device ? runStatus(modelVram(a, state.quant), state.device.vram) : "can-run";
      const fb = state.device ? runStatus(modelVram(b, state.quant), state.device.vram) : "can-run";
      const rank = { "can-run": 0, tight: 1, "cannot-run": 2, unknown: 3 };
      if (rank[fa] !== rank[fb]) return rank[fa] - rank[fb];
      const ga = scoreGrade(fa, estimateTps(state.device, a));
      const gb = scoreGrade(fb, estimateTps(state.device, b));
      const go = { S: 0, A: 1, B: 2, C: 3, D: 4, F: 5, "?": 6 };
      if (go[ga] !== go[gb]) return go[ga] - go[gb];
      return a.params - b.params;
    });
    grid.innerHTML = list.map(cardFor).join("");
    $("#grid-empty").classList.toggle("hidden", list.length > 0);
  }

  /* ── Modal ─────────────────────────────────────────────── */
  function openModal(model) {
    const body = $("#modal-body");
    const available = state.device ? state.device.vram : 0;
    const rows = QUANTS.map((q) => {
      const v = modelVram(model, q);
      const fits = available > 0 && v <= available;
      const file = quantFileGB(model, q);
      const statusTxt = available > 0
        ? fits ? '<span class="yes">Fits</span>' : '<span class="no">Needs ' + v.toFixed(1) + " GB</span>"
        : '<span class="yes">~' + file + " GB file</span>";
      return (
        "<tr class=\"" + (fits ? "fits" : "") + '">' +
        "<td>" + q.label + "</td>" +
        "<td>" + file + " GB</td>" +
        "<td>" + v.toFixed(1) + " GB VRAM</td>" +
        "<td>" + statusTxt + "</td></tr>"
      );
    }).join("");
    const tps = estimateTps(state.device, model);
    const speedLine = tps
      ? '<p class="meta-line">Estimated speed on your device: <b style="color:var(--text)">~' + tps + " tokens/s</b></p>"
      : '<p class="meta-line">Generation model — speed depends on resolution and steps.</p>';
    const hfLink = model.hf
      ? '<a class="btn btn-ghost" href="https://huggingface.co/' + model.hf + '" target="_blank" rel="noopener">View on Hugging Face</a>'
      : "";
    body.innerHTML =
      '<h2>' + model.name + "</h2>" +
      '<p class="m-company">' + model.company + " · " + model.params + "B parameters" +
        (model.moe ? " (mixture-of-experts, " + model.active + "B active)" : "") + "</p>" +
      '<p class="m-desc">' + model.desc + "</p>" +
      speedLine +
      '<h3 style="font-size:15px;margin-bottom:8px">VRAM needed per quantization</h3>' +
      '<table class="quant-table"><thead><tr><th>Quant</th><th>File size</th><th>VRAM</th><th>On your device</th></tr></thead><tbody>' +
      rows + "</tbody></table>" +
      '<div class="m-actions">' +
        hfLink +
        '<a class="btn btn-ghost" href="https://ollama.com" target="_blank" rel="noopener">Run with Ollama</a>' +
        '<a class="btn btn-ghost" href="https://lmstudio.ai" target="_blank" rel="noopener">Run with LM Studio</a>' +
      "</div>" +
      '<p class="meta-line">Licence: ' + model.license + " · GGUF sizes are approximate.</p>";
    $("#modal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    $("#modal").classList.add("hidden");
    document.body.style.overflow = "";
  }

  /* ── Events ────────────────────────────────────────────── */
  async function onDetect() {
    const btn = $("#detect-btn");
    btn.disabled = true;
    btn.textContent = "Detecting…";
    try {
      state.detected = await detectHardware();
      state.device = resolveDevice();
      renderDevicePanel();
      renderGrid();
      btn.textContent = state.detected.matched ? "Detected ✓ — re-run detection" : "Detection incomplete — pick your device";
      $("#device-select").value = "auto";
    } catch (e) {
      btn.textContent = "Detection failed — pick your device";
    } finally {
      btn.disabled = false;
    }
    if (state.detected && state.detected.gpuRenderer) {
      $("#device-detail").title = state.detected.gpuRenderer;
    }
  }

  function bind() {
    $("#detect-btn").addEventListener("click", onDetect);

    $("#device-select").addEventListener("change", () => {
      const isCustom = $("#device-select").value === "custom";
      $("#custom-row").classList.toggle("hidden", !isCustom);
      state.device = resolveDevice();
      renderDevicePanel();
      renderGrid();
    });

    $("#custom-apply").addEventListener("click", () => {
      state.device = resolveDevice();
      renderDevicePanel();
      renderGrid();
    });
    $("#custom-vram").addEventListener("keydown", (e) => {
      if (e.key === "Enter") $("#custom-apply").click();
    });

    document.querySelectorAll("#type-chips .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#type-chips .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        state.type = chip.dataset.type;
        renderGrid();
      });
    });

    $("#search").addEventListener("input", (e) => {
      state.search = e.target.value;
      renderGrid();
    });

    $("#quant-select").addEventListener("change", (e) => {
      state.quant = QUANTS.find((q) => q.id === e.target.value) || state.quant;
      renderGrid();
    });

    $("#model-grid").addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      if (card) openModal(MODELS.find((m) => m.id === card.dataset.id));
    });

    $("#modal").addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ── Init ──────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    bind();
    renderGrid();
  });
})();
