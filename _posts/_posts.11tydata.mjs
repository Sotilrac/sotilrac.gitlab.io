export default {
  tags: ["posts"],
  eleventyComputed: {
    permalink: (data) => {
      const slug = data.page.fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
      return `/blog/${slug}/`;
    },
  },
};
