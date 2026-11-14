/* Character reveal only: no pretend model streaming. Text is already available.
 * Grapheme segmentation preserves Vietnamese combining marks, emoji and CJK. */
((root) => {
  "use strict";
  const pending = new Set();
  function reveal(
    element,
    text,
    { animate = true, onProgress = () => {}, onFinish = () => {} } = {},
  ) {
    const complete = String(text);
    const reduced = root.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const units =
      typeof Intl.Segmenter === "function"
        ? [
            ...new Intl.Segmenter(undefined, {
              granularity: "grapheme",
            }).segment(complete),
          ].map((x) => x.segment)
        : Array.from(complete);
    let resolve,
      done = false,
      frame = 0,
      index = 0,
      started = null;
    const finished = new Promise((r) => (resolve = r));
    const control = { finished, finish: () => finish() };
    function finish() {
      if (done) return;
      done = true;
      root.cancelAnimationFrame?.(frame);
      element.textContent = complete;
      element.classList.remove("is-revealing");
      pending.delete(control);
      onProgress();
      onFinish();
      resolve();
    }
    if (!animate || reduced || !units.length || root.document?.hidden) {
      finish();
      return control;
    }
    element.textContent = "";
    element.classList.add("is-revealing");
    const chunk = Math.max(1, Math.ceil(units.length / 360));
    function tick(now) {
      if (done) return;
      if (!element.isConnected) {
        finish();
        return;
      }
      if (started === null) started = now;
      const next = Math.min(
        units.length,
        (1 + Math.floor((now - started) / 18)) * chunk,
      );
      if (next > index) {
        index = next;
        element.textContent = units.slice(0, index).join("");
        onProgress();
      }
      if (index >= units.length) finish();
      else frame = root.requestAnimationFrame(tick);
    }
    pending.add(control);
    frame = root.requestAnimationFrame(tick);
    return control;
  }
  const finishAll = () => [...pending].forEach((x) => x.finish());
  root.document?.addEventListener("visibilitychange", () => {
    if (root.document.hidden) finishAll();
  });
  root.document?.addEventListener("museum:navigate", (e) => {
    if (e.detail.page !== "guide") finishAll();
  });
  root.document?.addEventListener("museum:language", finishAll);
  root.MuseumChatText = Object.freeze({ reveal, finishAll });
})(globalThis);
