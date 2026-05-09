/*
 * Tracks the bottom of the topmost opaque element (hero or sticky header) and
 * the top of the footer, writing both to CSS custom properties so the page-edge
 * gradient on body::after can keep its fade zones aligned with the visible
 * content area as the user scrolls. Only active on wide viewports where the
 * line is rendered.
 */
(function () {
  if (typeof window === "undefined" || !window.matchMedia) return;

  const wide = window.matchMedia("(min-width: 86em)");
  const root = document.documentElement;
  let hero, header, footer;
  let ticking = false;

  function findRefs() {
    if (!hero) hero = document.querySelector(".name-header");
    if (!header) header = document.querySelector(".site-nav");
    if (!footer) footer = document.querySelector("footer");
  }

  function update() {
    if (!wide.matches) {
      root.style.removeProperty("--edge-top-offset");
      root.style.removeProperty("--edge-bottom-offset");
      return;
    }
    findRefs();

    let top = 0;
    if (header) top = Math.max(top, header.getBoundingClientRect().bottom);
    if (hero) top = Math.max(top, hero.getBoundingClientRect().bottom);

    let bottom = 0;
    if (footer) {
      bottom = Math.max(
        0,
        window.innerHeight - footer.getBoundingClientRect().top,
      );
    }

    root.style.setProperty("--edge-top-offset", Math.max(0, top) + "px");
    root.style.setProperty("--edge-bottom-offset", bottom + "px");
  }

  function onScroll() {
    if (ticking) return;
    requestAnimationFrame(function () {
      update();
      ticking = false;
    });
    ticking = true;
  }

  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  if (wide.addEventListener) wide.addEventListener("change", update);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update);
  } else {
    update();
  }
})();
