import yaml from "js-yaml";

export default function (eleventyConfig) {
  // --- YAML data file support (removed in 11ty v3) ---
  eleventyConfig.addDataExtension("yml,yaml", (contents) =>
    yaml.load(contents)
  );

  // --- Global data ---
  eleventyConfig.addGlobalData("buildDate", new Date());

  // --- Passthrough copy ---
  eleventyConfig.addPassthroughCopy("font");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy({ "css/main.css": "css/main.css" });

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

  eleventyConfig.addShortcode("youtube", (id) => {
    return `<iframe class="video" width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  });

  // --- Filters ---
  eleventyConfig.addFilter("dateFormat", (date, format) => {
    const d = new Date(date);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    if (format === "iso") return d.toISOString();
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
