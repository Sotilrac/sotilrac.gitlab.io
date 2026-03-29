import yaml from "js-yaml";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function (eleventyConfig) {
  // --- Plugins ---
  eleventyConfig.addPlugin(syntaxHighlight);
  // --- YAML data file support (removed in 11ty v3) ---
  eleventyConfig.addDataExtension("yml,yaml", (contents) =>
    yaml.load(contents),
  );

  // --- Global data ---
  eleventyConfig.addGlobalData("buildDate", new Date());

  // --- Passthrough copy ---
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("font");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("media");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("llms.txt");

  // --- Ignores ---
  eleventyConfig.ignores.add("README.md");

  // --- Collections ---
  eleventyConfig.addCollection("publicPosts", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("posts")
      .filter((post) => post.data.status === "public")
      .sort((a, b) => b.date - a.date);
  });

  // --- Shortcodes (for blog posts, when ported) ---
  eleventyConfig.addShortcode("fig", (img, caption) => {
    const alt = caption || "";
    return `<figure class="post-fig"><a href="${img}" data-fancybox data-caption="${alt}"><img src="${img}" alt="${alt}" /></a><figcaption>${alt}</figcaption></figure>`;
  });

  eleventyConfig.addShortcode("gallery", (columns, ...imgs) => {
    const items = imgs
      .map(
        (img) =>
          `<a href="${img}" data-fancybox="gallery"><img src="${img}" alt="" /></a>`,
      )
      .join("");
    return `<div class="gallery" style="--gallery-cols: ${columns}">${items}</div>`;
  });

  eleventyConfig.addShortcode("wayback", (url, text) => {
    return `<a href="${url}" class="wayback-link" title="Archived page">${text}<svg class="wayback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/><path d="M3 12h1M20 12h1"/></svg></a>`;
  });

  eleventyConfig.addShortcode("youtube", (id) => {
    return `<iframe class="video" width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  });

  // --- Filters ---
  eleventyConfig.addFilter("dateFormat", (date, format) => {
    const d = new Date(date);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    if (format === "iso") return d.toISOString();
    if (format === "isodate") return d.toISOString().slice(0, 10);
    if (format === "rfc822") return d.toUTCString();
    if (format === "year") return d.getFullYear().toString();
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  });

  eleventyConfig.addFilter("xmlEscape", (str) => {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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
