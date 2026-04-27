(function () {
  if (window.__compareInit) return;
  window.__compareInit = true;

  function attach(stage) {
    if (stage.__compareReady) return;
    stage.__compareReady = true;
    var fig = stage.closest(".compare-fig");
    if (!fig) return;

    function update(clientX) {
      var rect = stage.getBoundingClientRect();
      var x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      var pct = rect.width > 0 ? (x / rect.width) * 100 : 50;
      fig.style.setProperty("--pos", pct + "%");
    }

    var dragging = false;

    stage.addEventListener("pointerdown", function (e) {
      if (e.target.closest && e.target.closest(".compare-zoom")) return;
      dragging = true;
      try {
        stage.setPointerCapture(e.pointerId);
      } catch (_) {}
      update(e.clientX);
      e.preventDefault();
    });

    stage.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      update(e.clientX);
    });

    function end(e) {
      if (!dragging) return;
      dragging = false;
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }

    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", end);
    stage.addEventListener("lostpointercapture", end);
  }

  function init() {
    document.querySelectorAll(".compare-fig .compare-stage").forEach(attach);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
