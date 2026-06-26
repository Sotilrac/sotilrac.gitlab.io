# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
make dev           # local dev server at localhost:8080 (live reload)
make build         # production build to _site/
make lint          # check formatting (Prettier)
make lint-fix      # auto-fix formatting
make check         # mirror CI locally: lint + build + link check
make               # list all targets
```

Equivalent `npm run` scripts still exist (`dev`, `build`, `lint`, `lint:fix`, `check:links`) and resolve to the same underlying commands.

Create a new post: `./_tools/new-post.sh "Post Title" [YYYY-MM-DD]`

## Architecture

Eleventy v3 static site (asmat.ca). Deploys to GitLab Pages on push to `master` via `.gitlab-ci.yml` (Node 20).

- **Config**: `eleventy.config.mjs` defines shortcodes, filters, collections, passthrough copies
- **Templates**: Nunjucks (`.njk`) and Markdown (`.md`), engine is Nunjucks for both
- **Layouts**: `_includes/layouts/` (base, home, post, page), all extend `base.njk`
- **Data**: `_data/site.json` (site metadata), `_data/resume.yml` (resume content, includes AES-encrypted contact info)
- **Posts**: `_posts/*.md` with YAML frontmatter. Directory data file `_posts/_posts.11tydata.mjs` auto-tags all posts and generates permalinks as `/blog/<slug>/`
- **Collections**: `publicPosts` filters to `status: public` posts sorted by date desc. Only public posts appear on the blog page and RSS feed.
- **Static assets**: `css/`, `font/`, `img/`, `js/`, `media/` are passthrough-copied
- **Output**: `_site/` (local dev), `public/` (CI deploy)

## Blog Posts

Frontmatter template:

```yaml
layout: layouts/post.njk
status: draft | public
author: Carlos
title: Post Title
date: 2024-01-08T12:00:00-05:00
categories:
  - General
tags:
  - robotics
```

Post images go in `img/blog/<post-slug>/`.

Available shortcodes in posts: `{% fig %}`, `{% gallery %}`, `{% youtube %}`, `{% wayback %}`, `{% model %}`.

For prose style when drafting or editing posts, see `STYLE.md` at the repo root.

## Formatting

Prettier with 2-space indent, LF line endings, `proseWrap: preserve`. Lefthook pre-commit hook runs Prettier on staged files. CI also checks trailing whitespace and final newlines in `.njk`, `.txt`, `.sh` files.

## License

All content is Copyright Carlos Asmat, All Rights Reserved (see `LICENSE`). `robots.txt` blocks AI training crawlers; `llms.txt` declares the copyright for LLMs.
