export default {
  layout: "layouts/post.njk",
  tags: ["drafts"],
  eleventyComputed: {
    permalink: (data) => `/drafts/${data.page.fileSlug}/`,
  },
};
