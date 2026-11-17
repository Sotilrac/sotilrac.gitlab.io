/* Pointer parallax for {% gallery %} thumbnails: sets --px/--py on the hovered
 * link to the pointer's position, -1 to 1 from the centre. main.css turns
 * them into the image shift, and only applies it for hover-capable pointers
 * without reduced motion.
 */
(function () {
  document.querySelectorAll(".gallery a").forEach((a) => {
    a.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = a.getBoundingClientRect();
      a.style.setProperty("--px", ((e.clientX - r.left) / r.width) * 2 - 1);
      a.style.setProperty("--py", ((e.clientY - r.top) / r.height) * 2 - 1);
    });
    a.addEventListener("pointerleave", () => {
      a.style.removeProperty("--px");
      a.style.removeProperty("--py");
    });
  });
})();
