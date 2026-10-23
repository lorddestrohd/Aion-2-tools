"use strict";

(() => {
  const $ = (selector) => document.querySelector(selector);
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  let language = "es";
  try { language = localStorage.getItem("aion2calc-language") === "en" ? "en" : "es"; } catch (_) {}

  const copy = {
    en: {
      eyebrow: "GENUS INSIGHT",
      title: "Genus screen capture",
      intro: "Open the Genus Insight panel in AION 2. Capture reads one frame locally; it does not record combat or save an image.",
      language: "OCR language",
      capture: "Capture and read",
      ready: "Ready when the game's Genus Insight panel is open.",
      send: "Send to Genus editor",
      sendToCharacter: "Save to selected character",
      slot: "Slot",
      genus: "Genus",
      level: "Level",
      review: "Review and correct every field before sending.",
      sending: "Sending reviewed Genus data to the editor…",
      sent: "Capture sent. Return to Gear & Advice to review the draft and save Genus lines.",
      saving: "Saving reviewed Genus data to the selected character…",
      saved: "Genus data saved to the selected character. Returning to the app…",
      saveError: "Genus data was not saved: ",
      noNative: "Screen capture requires the native Windows capture window.",
      error: "Could not read Genus: ",
      sendError: "Capture was not sent: ",
      invalid: "Fill in the genus, level, and every unlocked slot before sending.",
      ocrText: "Recognized text",
      stat: "Check stat",
      value: "Value",
      auto: "Auto",
      english: "English",
      spanish: "Spanish",
      captureError: "Capture failed.",
      privacy: "Local capture · review before sending"
    },
    es: {
      eyebrow: "INTROSPECCIÓN DE GENUS",
      title: "Captura de Genus desde la pantalla",
      intro: "Abre el panel Genus Insight en AION 2. Se lee un fotograma localmente; no se graba el combate ni se guarda una imagen.",
      language: "Idioma del OCR",
      capture: "Capturar y leer",
      ready: "Listo cuando esté abierto el panel Genus Insight del juego.",
      send: "Enviar al editor de Genus",
      sendToCharacter: "Guardar en el personaje seleccionado",
      slot: "Ranura",
      genus: "Genus",
      level: "Nivel",
      review: "Revisa y corrige todos los campos antes de enviarlos.",
      sending: "Enviando los datos revisados al editor…",
      sent: "Captura enviada. Vuelve a Equipo y recomendaciones para revisar el borrador y guardar las líneas de Genus.",
      saving: "Guardando los datos revisados en el personaje seleccionado…",
      saved: "Datos de Genus guardados en el personaje. Volviendo a la aplicación…",
      saveError: "No se guardaron los datos de Genus: ",
      noNative: "La captura de pantalla requiere la ventana nativa de captura en Windows.",
      error: "No se pudo leer Genus: ",
      sendError: "No se envió la captura: ",
      invalid: "Completa el genus, el nivel y todas las ranuras desbloqueadas antes de enviar.",
      ocrText: "Texto reconocido",
      stat: "Revisa la estadística",
      value: "Valor",
      auto: "Automático",
      english: "Inglés",
      spanish: "Español",
      captureError: "Error al capturar.",
      privacy: "Captura local · revisa antes de enviar"
    }
  };
  const t = (key) => copy[language][key];
  const targetCharacter = new URLSearchParams(window.location.search).get("character");
  let recognized = null;
  function fitWindow() {
    const nativeApi = window.pywebview?.api;
    if (typeof nativeApi?.resize_genus_capture !== "function") return;
    const height = Math.ceil(document.documentElement.scrollHeight + 8);
    nativeApi.resize_genus_capture(height).catch((error) => console.error("Could not resize Genus capture window:", error));
  }
  document.querySelectorAll("button, input, select, textarea, label, summary").forEach((control) => {
    ["pointerdown", "mousedown", "touchstart"].forEach((type) => {
      control.addEventListener(type, (event) => event.stopPropagation());
    });
  });
  const errorText = (error) => {
    let message = String(error?.message || t("captureError"));
    if (language === "es") {
      message = message
        .replace("Windows OCR language pack for English or Spanish is not installed.", "Instala el paquete OCR de inglés o español en las opciones de idioma de Windows.")
        .replace('Install the Genus OCR support with: python -m pip install -e ".[genus-ocr]"', 'Instala el lector con: python -m pip install -e ".[genus-ocr]"')
        .replace("Open AION 2 before capturing Genus Insight.", "Abre AION 2 antes de capturar Genus Insight.")
        .replace("Make the game window at least 900 × 500 pixels for OCR.", "Aumenta la ventana del juego a 900 × 500 píxeles para leerla.")
        .replace("Genus screen capture requires the native Windows overlay.", "La captura de Genus requiere la ventana nativa de Windows.");
    }
    return message;
  };

  function applyLanguage() {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-copy]").forEach((node) => {
      const key = node.dataset.copy;
      if (copy[language][key]) node.textContent = t(key);
    });
    const options = $("#genus-language").options;
    options[0].textContent = t("auto");
    options[1].textContent = t("english");
    options[2].textContent = t("spanish");
    $("#genus-send").textContent = targetCharacter ? t("sendToCharacter") : t("send");
  }

  function showCapture(result) {
    recognized = result;
    const names = ["Cogni", "Fera", "Natura", "Varian", "Special"];
    const options = names.map((name) => `<option value="${name}" ${result.genus === name ? "selected" : ""}>${name}</option>`).join("");
    const count = Number.isInteger(result.level) && result.level > 0 ? Math.min(result.level, 9) : 9;
    const lines = new Map((result.lines || []).map((line) => [line.slot, line]));
    const rows = Array.from({ length: count }, (_, i) => lines.get(i + 1) || { slot: i + 1, stat: "", value: "" })
      .map((line) => `<div class="genus-capture-row"><strong>${t("slot")} ${line.slot}</strong>
        <input data-genus-stat="${line.slot}" aria-label="${esc(t("slot"))} ${line.slot} ${esc(t("stat"))}" value="${esc(line.stat)}" placeholder="${esc(t("stat"))}">
        <input data-genus-value="${line.slot}" aria-label="${esc(t("slot"))} ${line.slot} ${esc(t("value"))}" value="${esc(line.value)}" placeholder="${esc(t("value"))}"></div>`).join("");
    $("#genus-results").innerHTML = `<div class="genus-capture-meta">
      <label>${t("genus")} <select id="genus-name">${options}</select></label>
      <label>${t("level")} <input id="genus-level" type="number" min="1" max="10" value="${esc(result.level ?? "")}"></label>
      </div>${rows}<p class="genus-capture-review">${t("review")}</p>
      <details><summary>${t("ocrText")}</summary><pre id="genus-ocr-text">${esc(result.text || "")}</pre></details>`;
    $("#genus-status").textContent = `${result.lines?.length || 0}/9 · ${t("review")}`;
    $("#genus-send").disabled = false;
    requestAnimationFrame(fitWindow);
  }

  applyLanguage();
  window.addEventListener("pywebviewready", fitWindow);
  $("#genus-close").onclick = () => {
    const nativeApi = window.pywebview?.api;
    if (typeof nativeApi?.close_genus_capture === "function") nativeApi.close_genus_capture();
    else window.close();
  };
  $("#genus-read").onclick = async () => {
    const button = $("#genus-read");
    const nativeApi = window.pywebview?.api;
    if (!nativeApi || typeof nativeApi.capture_genus !== "function") {
      $("#genus-status").textContent = t("noNative");
      return;
    }
    button.disabled = true;
    $("#genus-send").disabled = true;
    recognized = null;
    $("#genus-results").replaceChildren();
    $("#genus-status").textContent = language === "es" ? "Capturando un fotograma y leyéndolo localmente…" : "Capturing one frame and reading it locally…";
    try {
      showCapture(await nativeApi.capture_genus($("#genus-language").value));
    } catch (error) {
      $("#genus-status").textContent = t("error") + errorText(error);
    } finally {
      button.disabled = false;
    }
  };

  $("#genus-send").onclick = async () => {
    if (!recognized) return;
    const level = Number($("#genus-level").value);
    const lines = [...$("#genus-results").querySelectorAll("[data-genus-stat]")].map((input) => ({
      slot: Number(input.dataset.genusStat),
      stat: input.value.trim(),
      value: $("#genus-results").querySelector(`[data-genus-value="${input.dataset.genusStat}"]`)?.value.trim() || ""
    }));
    if (!Number.isInteger(level) || level < 1 || level > 10 || lines.length !== Math.min(level, 9) ||
        lines.some((line, index) => !line.stat || !line.value || line.slot !== index + 1)) {
      $("#genus-status").textContent = t("invalid");
      return;
    }
    const button = $("#genus-send");
    button.disabled = true;
    $("#genus-status").textContent = targetCharacter ? t("saving") : t("sending");
    try {
      const response = await fetch(targetCharacter ? "/api/genus/capture-save" : "/api/genus/ocr-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(targetCharacter ? { character: targetCharacter } : {}),
          capture: { genus: $("#genus-name").value, level, lines }
        })
      });
      const body = await response.json();
      if (!response.ok) throw Error(body.error || t("captureError"));
      if (targetCharacter && body.saved !== true) throw Error(t("captureError"));
      $("#genus-status").textContent = targetCharacter ? t("saved") : t("sent");
      if (targetCharacter) {
        window.setTimeout(() => {
          const nativeApi = window.pywebview?.api;
          if (typeof nativeApi?.close_genus_capture === "function") nativeApi.close_genus_capture();
        }, 900);
      }
    } catch (error) {
      $("#genus-status").textContent = (targetCharacter ? t("saveError") : t("sendError")) + errorText(error);
    } finally {
      if (!targetCharacter || !$("#genus-status").textContent.includes(t("saved"))) button.disabled = false;
    }
  };
})();
