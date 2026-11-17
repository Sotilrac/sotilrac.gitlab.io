/* Motion for the editorial shortcodes (stat, stats, versus, steps).
 *
 * The markup already holds final values; this only animates them once they
 * scroll into view. [data-count] counts the first number in its text up from
 * zero, keeping any prefix, suffix, decimals and thousands separators.
 * [data-reveal] gets .is-armed (hidden) up front and .is-in when seen.
 * Reduced motion or no IntersectionObserver: nothing changes.
 */
(function () {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  )
    return;

  const NUM = /^([\s\S]*?)(\d[\d,]*(?:\.\d+)?)([\s\S]*)$/;
  const DURATION = 1400;
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  function counter(el) {
    const m = el.textContent.match(NUM);
    if (!m) return null;
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(/,/g, ""));
    const dec = (num.split(".")[1] || "").length;
    const fmt = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
      useGrouping: num.includes(","),
    });
    const set = (v) => (el.textContent = pre + fmt.format(v) + post);
    set(0);
    return () => {
      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / DURATION);
        set(dec ? target * ease(t) : Math.round(target * ease(t)));
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = pre + num + post;
      };
      requestAnimationFrame(tick);
    };
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        if (e.target._run) e.target._run();
        else e.target.classList.add("is-in");
      });
    },
    { threshold: 0.35 },
  );

  document.querySelectorAll("[data-count]").forEach((el) => {
    const run = counter(el);
    if (!run) return;
    el._run = run;
    io.observe(el);
  });

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.classList.add("is-armed");
    io.observe(el);
  });
})();
