import yaml from "js-yaml";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import katex from "katex";
import texmath from "markdown-it-texmath";
import { postSlug } from "./_tools/lib.mjs";

// Escape a string for use inside a double-quoted HTML attribute.
const attr = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Attribute-safe plain text: caption markup stripped, then escaped.
const attrText = (s) => attr(String(s ?? "").replace(/<[^>]+>/g, ""));

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

// Plain-text excerpt of a Markdown source (page.rawInput): shortcodes,
// comments, code and markup removed, cut at a word boundary.
function excerpt(md, maxChars = 160) {
  if (!md) return "";
  let text = md
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\{#[\s\S]*?#\}/g, " ")
    .replace(/\{%-?\s*(plot|math)\b[\s\S]*?\{%-?\s*end\1\s*-?%\}/g, " ")
    .replace(/\{%[\s\S]*?%\}/g, " ")
    .replace(/\{\{[\s\S]*?\}\}/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s.*$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

export default function (eleventyConfig) {
  // --- Plugins ---
  eleventyConfig.addPlugin(syntaxHighlight);

  // --- Math (KaTeX, server-side) ---
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(texmath, {
      engine: katex,
      delimiters: "dollars",
      katexOptions: { output: "html", throwOnError: false },
    });
  });
  // --- YAML data file support (removed in 11ty v3) ---
  eleventyConfig.addDataExtension("yml,yaml", (contents) =>
    yaml.load(contents),
  );

  // --- Global data ---
  const buildDate = new Date();
  eleventyConfig.addGlobalData("buildDate", buildDate);
  // Cache key for the /calc/ service worker, YYYYMMDDHHMMSS UTC. A new value
  // per build makes installed PWAs fetch the new bundle and evict the old cache.
  eleventyConfig.addGlobalData(
    "buildId",
    buildDate.toISOString().slice(0, 19).replace(/[-:T]/g, ""),
  );

  // --- Passthrough copy ---
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("font");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("llms.txt");
  eleventyConfig.addPassthroughCopy({
    "node_modules/katex/dist/katex.min.css": "css/vendor/katex.min.css",
    "node_modules/katex/dist/fonts": "css/vendor/fonts",
  });
  // Serve img/ (about 500 MB) from disk in --serve instead of copying it on
  // every rebuild.
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  // --- Ignores ---
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("STYLE.md");
  eleventyConfig.ignores.add("img/**/*.md");
  eleventyConfig.ignores.add("_tools/**");
  eleventyConfig.ignores.add("src/**");

  // --- Collections ---
  // Everything in _posts/, newest first.
  eleventyConfig.addCollection("publicPosts", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("posts")
      .sort((a, b) => b.date - a.date);
  });

  // Drafts: anything in _drafts/.
  eleventyConfig.addCollection("drafts", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("drafts")
      .sort((a, b) => b.date - a.date);
  });

  // --- Shortcodes ---
  const altFromPath = (img) => {
    if (!img) return "";
    const cleanPath = img.split(/[?#]/)[0];
    const filename = (cleanPath.split("/").pop() || "").replace(/\.[^.]+$/, "");
    const slugMatch = cleanPath.match(/\/img\/blog\/([^/]+)\//);
    const slug = slugMatch ? slugMatch[1] : "";
    return (slug + " " + filename).replace(/[-_]+/g, " ").trim();
  };

  // Per-page counters: the first image on a page loads eagerly (it is the
  // likely LCP element), the rest lazily; each gallery gets its own lightbox
  // group. Reset per build so --serve rebuilds stay deterministic.
  const pageCounts = new Map();
  eleventyConfig.on("eleventy.before", () => pageCounts.clear());
  const count = (page, key) => {
    const k = `${page?.inputPath}\0${key}`;
    const n = (pageCounts.get(k) || 0) + 1;
    pageCounts.set(k, n);
    return n;
  };
  const imgTag = (page, src, alt) => {
    const lazy =
      count(page, "img") > 1 ? ' loading="lazy" decoding="async"' : "";
    return `<img src="${attr(src)}" alt="${attrText(alt)}"${lazy} />`;
  };

  // Optional third argument caps this one figure's width (any CSS length),
  // overriding the post-level `figWidth` frontmatter for that figure only.
  eleventyConfig.addShortcode("fig", function (img, caption, width) {
    const alt = caption || altFromPath(img);
    const fc = caption ? `<figcaption>${caption}</figcaption>` : "";
    const dc = caption ? ` data-caption="${attrText(caption)}"` : "";
    const st = width ? ` style="--fig-width: ${attr(width)}"` : "";
    return `<figure class="post-fig"${st}><a href="${attr(img)}" data-fancybox${dc}>${imgTag(this.page, img, alt)}</a>${fc}</figure>`;
  });

  eleventyConfig.addShortcode("gallery", function (columns, ...imgs) {
    const group = `gallery-${count(this.page, "gallery")}`;
    const items = imgs
      .map(
        (img) =>
          `<a href="${attr(img)}" data-fancybox="${group}">${imgTag(this.page, img, altFromPath(img))}</a>`,
      )
      .join("");
    return `<div class="gallery" style="--gallery-cols: ${attr(columns)}">${items}</div>`;
  });

  // Asset tags for compare, model and plot are emitted once per page by
  // head.njk, which checks the rendered content for their elements.
  eleventyConfig.addShortcode("compare", (beforeImg, afterImg, caption) => {
    const cap = caption || "";
    const altBefore = cap ? `Before: ${cap}` : "Before";
    const altAfter = cap ? `After: ${cap}` : "After";
    const expandIcon = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M3 3h7v2H5v5H3V3zm11 0h7v7h-2V5h-5V3zm7 11v7h-7v-2h5v-5h2zm-11 7H3v-7h2v5h5v2z"/></svg>`;
    return `<figure class="post-fig compare-fig" style="--pos:50%"><div class="compare-stage" role="slider" aria-label="Drag to compare before and after" tabindex="0"><img class="compare-img compare-after" src="${attr(afterImg)}" alt="${attrText(altAfter)}" loading="lazy" draggable="false" /><img class="compare-img compare-before" src="${attr(beforeImg)}" alt="${attrText(altBefore)}" loading="lazy" draggable="false" /><div class="compare-divider" aria-hidden="true"></div><a class="compare-zoom compare-zoom-before" href="${attr(beforeImg)}" data-fancybox data-caption="${attrText(altBefore)}" aria-label="Expand before image">${expandIcon}</a><a class="compare-zoom compare-zoom-after" href="${attr(afterImg)}" data-fancybox data-caption="${attrText(altAfter)}" aria-label="Expand after image">${expandIcon}</a></div><figcaption>${cap}</figcaption></figure>`;
  });

  eleventyConfig.addShortcode("wayback", (url, text) => {
    return `<a href="${attr(url)}" class="wayback-link" title="Archived page">${text}<svg class="wayback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/><path d="M3 12h1M20 12h1"/></svg></a>`;
  });

  eleventyConfig.addShortcode("model", (src, caption, orbit) => {
    const a = caption || "";
    const o = orbit || "0deg 75deg auto";
    return `<figure class="post-fig model-fig"><model-viewer src="${attr(src)}" alt="${attrText(a)}" camera-controls touch-action="pan-y" camera-orbit="${attr(o)}"></model-viewer><figcaption>${a}</figcaption></figure>`;
  });

  // Interactive function plot (uPlot). Config is JSON in the paired body; see js/plot.js.
  eleventyConfig.addPairedShortcode("plot", (config, caption) => {
    const fc = caption ? `<figcaption>${caption}</figcaption>` : "";
    return `<figure class="post-fig plot-fig"><function-plot><script type="application/json">${config}</script></function-plot>${fc}</figure>`;
  });

  eleventyConfig.addShortcode("youtube", (id) => {
    return `<iframe class="video" width="560" height="315" src="https://www.youtube.com/embed/${attr(id)}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>`;
  });

  eleventyConfig.addShortcode("spotify", (id) => {
    return `<iframe style="border-radius:12px;margin:2em 0" width="100%" height="152" src="https://open.spotify.com/embed/track/${attr(id)}" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
  });

  // Embed one of the in-house web-component calculators by short name.
  // Usage: {% calc "ee" %} or {% calc "deadbeef" %}
  // w/h are the popup's initial size in px; the standalone page only grows the
  // height if the rendered calculator overflows (see standalone.njk).
  const CALCS = {
    ee: {
      tag: "ee-calculator",
      script: "/js/ee-calculator.js",
      title: "EE Calculator",
      description:
        "Hobbyist electrical-engineering calculator: resistor color code, E-series finder, voltage divider, LED resistor, Ohm's law, AC math, RC filter, 555 timer, AWG, PCB trace width, controlled impedance, LC resonance.",
      categories: ["utilities", "education", "productivity"],
      w: 832,
      h: 900,
      bg: "#f5efe3",
      theme: "#cc5500",
    },
    deadbeef: {
      tag: "programmer-calculator",
      script: "/js/programmer-calculator.js",
      title: "Programmer's Calculator",
      description:
        "Programmer's calculator: bitwise operations, base conversion (hex, decimal, binary, octal), and click-to-flip bit-field editing.",
      categories: ["utilities", "developer", "productivity"],
      w: 776,
      h: 620,
      bg: "#0f1923",
      theme: "#0f1923",
    },
  };
  // Expose the same map as a list, with each key added as a `name` field, so
  // calc.njk can paginate one bare-chrome page per calculator at /calc/<name>/.
  eleventyConfig.addGlobalData(
    "calcList",
    Object.entries(CALCS).map(([name, c]) => ({ name, ...c })),
  );
  eleventyConfig.addShortcode("calc", (name) => {
    const c = CALCS[name];
    if (!c) return `<!-- unknown calc: ${attr(name)} -->`;
    const url = `/calc/${name}/`;
    // The anchor degrades to a normal new-tab link; the onclick upgrades it to
    // a sized popup window when allowed. window.open returns null if blocked,
    // so `return !window.open(...)` lets the anchor navigate normally instead.
    const detachIcon = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" fill="currentColor"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg>`;
    const features = `popup,resizable=no,scrollbars=yes,width=${c.w},height=${c.h}`;
    return `<div class="calc-embed" data-calc="${name}">
  <div class="calc-toolbar"><a class="calc-detach" href="${url}" target="${c.tag}-window" rel="noopener" onclick="return !window.open(this.href, this.target, '${features}')">${detachIcon}<span>Open in window</span></a></div>
  <${c.tag}></${c.tag}>
  <script src="${c.script}" defer></script>
</div>`;
  });

  eleventyConfig.addPairedShortcode("math", (content, mode = "block") => {
    return katex.renderToString(content.trim(), {
      displayMode: mode !== "inline",
      throwOnError: false,
      output: "html",
    });
  });

  // --- Filters ---
  eleventyConfig.addFilter("postSlug", postSlug);

  eleventyConfig.addFilter("nl2br", (str) => {
    if (!str) return "";
    return str.replace(/\n/g, "<br>");
  });

  // Formats: iso, isodate (default), rfc822, year, long ("Sep 2, 2026").
  eleventyConfig.addFilter("dateFormat", (date, format = "isodate") => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    if (format === "iso") return d.toISOString();
    if (format === "rfc822") return d.toUTCString();
    if (format === "year") return d.getFullYear().toString();
    if (format === "long")
      return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    return d.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("excerpt", excerpt);

  eleventyConfig.addFilter("postNavigation", (posts, url) => {
    const i = posts.findIndex((p) => p.url === url);
    if (i === -1) return {};
    return {
      next: i > 0 ? posts[i - 1] : null,
      prev: i < posts.length - 1 ? posts[i + 1] : null,
    };
  });

  // Maps a raw category name to the slug used by .cat-dot[data-cat].
  // The "info" category renders under the "news" dot.
  eleventyConfig.addFilter("categoryIcon", (raw) => {
    if (!raw) return "";
    const c = String(raw).toLowerCase();
    return c === "info" ? "news" : c;
  });

  // --- Config ---
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
