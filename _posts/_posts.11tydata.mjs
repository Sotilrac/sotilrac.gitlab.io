import { postSlug } from "../_tools/lib.mjs";

export default {
  layout: "layouts/post.njk",
  tags: ["posts"],
  eleventyComputed: {
    permalink: (data) => `/blog/${postSlug(data.page.fileSlug)}/`,
    // Last edit, from git (see _data/gitDates.mjs). Frontmatter `updated:`
    // overrides it and `updated: false` hides it. Edits within a day of the
    // publication date are ignored so the publish commit never counts.
    // Eleventy hands computed keys in as "" when the frontmatter has none.
    updated: (data) => {
      if (data.updated !== undefined && data.updated !== "") {
        return data.updated ? new Date(data.updated) : null;
      }
      const iso = data.gitDates[data.page.inputPath.replace(/^\.\//, "")];
      if (!iso) return null;
      const d = new Date(iso);
      return d - data.page.date > 86400e3 ? d : null;
    },
  },
};
