// Footer contact form: the "Contact me" button expands the panel, the form
// posts to Web3Forms, and a checkmark replaces it for a moment before the
// panel folds away again.
(function () {
  const toggle = document.querySelector(".contact-toggle");
  const panel = document.getElementById("contact-panel");
  if (!toggle || !panel) return;
  const form = panel.querySelector(".contact-form");
  const error = panel.querySelector(".contact-error");
  const sent = panel.querySelector(".contact-sent");
  const submit = form.querySelector('button[type="submit"]');
  const SENT_MS = 2500;

  function setOpen(open) {
    panel.classList.toggle("is-open", open);
    panel.inert = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (!open) return;
    form.elements.name.focus({ preventScroll: true });
    // Scroll once the panel has its full height; without a transition
    // (reduced motion) there is no transitionend, so scroll now.
    if (getComputedStyle(panel).transitionDuration === "0s") reveal();
    else panel.addEventListener("transitionend", reveal, { once: true });
  }

  function reveal() {
    panel.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  toggle.addEventListener("click", () =>
    setOpen(!panel.classList.contains("is-open")),
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    error.textContent = "";
    if (!form.dataset.key) {
      error.textContent = "The contact form is not configured.";
      return;
    }
    const f = form.elements;
    const topic = f.subject.selectedOptions[0].text;
    submit.disabled = true;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: form.dataset.key,
          subject: `[asmat.ca] ${topic}: ${f.name.value.trim()}`,
          from_name: "asmat.ca",
          name: f.name.value.trim(),
          email: f.email.value.trim(),
          topic,
          message: f.message.value,
          botcheck: f.botcheck.checked,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message);
      showSent();
    } catch (err) {
      error.textContent =
        err.message || "The message did not go through. Try again later.";
    } finally {
      submit.disabled = false;
    }
  });

  function showSent() {
    form.hidden = true;
    sent.hidden = false;
    // Restart the draw-and-fade animation on every send.
    sent.classList.remove("is-shown");
    void sent.offsetWidth;
    sent.classList.add("is-shown");
    setTimeout(() => {
      setOpen(false);
      form.reset();
      // Swap back once the panel has folded.
      setTimeout(() => {
        sent.hidden = true;
        sent.classList.remove("is-shown");
        form.hidden = false;
      }, 400);
    }, SENT_MS);
  }
})();
