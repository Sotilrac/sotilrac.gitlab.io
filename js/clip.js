/* Looping silent clips: the parts of gif-parity that HTML alone cannot do.
 *
 * Three jobs, in order of how often they matter:
 *  - a play/pause button, because WCAG 2.2.2 asks for a way to stop motion
 *    that runs past five seconds, and because autoplay is refused outright in
 *    iOS Low Power Mode and by Firefox set to block all media, where the clip
 *    would otherwise sit frozen with no affordance;
 *  - prefers-reduced-motion, which no CSS property can apply to a video;
 *  - pausing offscreen clips, which browsers do sometimes but not dependably.
 */
(function () {
  const clips = document.querySelectorAll("video.clip");
  if (!clips.length) return;

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    pause:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>',
  };

  clips.forEach((video) => {
    // `paused` is not the question: a clip scrolled out of view is paused but
    // still wants to resume, while one the visitor stopped does not.
    let wanted = !motion.matches;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "clip-toggle";
    video.parentNode.appendChild(btn);

    function sync() {
      const playing = !video.paused;
      btn.innerHTML = playing ? ICON.pause : ICON.play;
      btn.setAttribute("aria-label", playing ? "Pause clip" : "Play clip");
      btn.classList.toggle("is-paused", !playing);
    }

    function start() {
      const p = video.play();
      // A rejected play() is the Low Power Mode case: leave the poster up and
      // the button showing, rather than pretending the clip is running.
      if (p && p.catch) p.catch(sync);
    }

    btn.addEventListener("click", () => {
      wanted = video.paused;
      if (wanted) start();
      else video.pause();
    });
    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);

    if (motion.matches) video.pause();
    motion.addEventListener("change", (e) => {
      wanted = !e.matches;
      if (e.matches) video.pause();
      else start();
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!wanted) return;
            if (e.isIntersecting) start();
            else video.pause();
          });
        },
        { rootMargin: "100px" },
      ).observe(video);
    }

    sync();
  });
})();
