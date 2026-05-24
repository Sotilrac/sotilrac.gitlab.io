(function () {
  const SEL = "[data-fancybox]";
  let modal, imgEl, capEl, prevBtn, nextBtn, items, idx;

  function build() {
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "lb";
    modal.innerHTML =
      '<button type="button" class="lb-close" aria-label="Close">×</button>' +
      '<button type="button" class="lb-nav lb-prev" aria-label="Previous">‹</button>' +
      '<button type="button" class="lb-nav lb-next" aria-label="Next">›</button>' +
      '<figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-caption"></figcaption></figure>';
    imgEl = modal.querySelector(".lb-img");
    capEl = modal.querySelector(".lb-caption");
    prevBtn = modal.querySelector(".lb-prev");
    nextBtn = modal.querySelector(".lb-next");
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    modal.querySelector(".lb-close").addEventListener("click", close);
    prevBtn.addEventListener("click", () => step(-1));
    nextBtn.addEventListener("click", () => step(1));
    document.body.appendChild(modal);
  }

  function open(trigger) {
    build();
    const grp = trigger.getAttribute("data-fancybox") || "";
    items = grp
      ? Array.from(
          document.querySelectorAll(
            '[data-fancybox="' + CSS.escape(grp) + '"]',
          ),
        )
      : [trigger];
    if (!items.length) items = [trigger];
    idx = items.indexOf(trigger);
    if (idx < 0) idx = 0;
    render();
    modal.classList.add("is-open");
    document.body.classList.add("lb-locked");
    document.addEventListener("keydown", onKey);
  }

  function render() {
    const t = items[idx];
    imgEl.src = t.getAttribute("href");
    imgEl.alt = t.getAttribute("data-caption") || "";
    const cap = t.getAttribute("data-caption") || "";
    capEl.textContent = cap;
    capEl.hidden = !cap;
    const multi = items.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
  }

  function step(dir) {
    if (items.length < 2) return;
    idx = (idx + dir + items.length) % items.length;
    render();
  }

  function close() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("lb-locked");
    document.removeEventListener("keydown", onKey);
    imgEl.src = "";
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest(SEL);
    if (!t) return;
    e.preventDefault();
    open(t);
  });
})();
