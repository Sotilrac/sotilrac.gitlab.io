# [asmat.ca](https://asmat.ca)

Personal site, resume, and blog. Built with [Eleventy](https://www.11ty.dev/) v3.

## Quick Start

```bash
make install     # install dependencies
make dev         # local dev server at http://localhost:8080
make build       # production build to _site/
make check       # mirror CI locally: lint + build + link check
make spell       # spellchecking
make             # list all targets
```

The `Makefile` is the single definition of each task; the npm scripts (`npm run dev`, `npm run build`, `npm run lint`) call the same targets.

## Project Structure

```
├── eleventy.config.mjs   # Eleventy configuration
├── _data/
│   ├── site.json         # Site metadata (title, URLs, socials)
│   ├── resume.yml        # Resume data (experience, skills, education, projects)
│   └── comments/         # Archived blog comments (YAML, per post slug)
├── _includes/
│   ├── layouts/          # Page layouts (base, post, page, standalone)
│   ├── head.njk          # HTML <head> (includes Umami analytics)
│   ├── header.njk        # Navigation bar
│   ├── footer.njk        # Footer + contact decryption JS
│   ├── resume.njk        # Resume template
│   ├── post-list.njk     # Year-grouped post list macro (blog and tags pages)
│   └── archive-banner.njk # Banner the post layout adds to pre-2014 posts
├── _posts/               # Blog posts (Markdown + Nunjucks)
├── _drafts/              # Unpublished posts, served at /drafts/<slug>/
├── css/main.css          # Custom stylesheet (no frameworks)
├── js/                   # Client-side JS (plots, calculators, lightbox)
├── src/ee-calculator/    # Source for the bundled js/ee-calculator.js
├── font/                 # Custom fonts (Hack, Inter variable, Telegrama)
├── img/                  # Favicons + blog post images (img/blog/<slug>/)
├── _tools/               # Helper scripts (new-post.sh, publish.sh, lib.mjs, archive/)
├── index.njk             # Home page (hero with typing animation)
├── blog.njk              # Blog archive (recent posts + Carlitos' Contraptions archive)
├── drafts.njk            # Draft posts listing (not linked from nav, blocked by robots.txt)
├── feed.njk              # RSS feed
├── robots.txt            # Crawler rules (blocks AI training, allows citation bots)
├── llms.txt              # LLM-readable site summary and license
├── STYLE.md              # Prose conventions for posts (not published)
└── Makefile              # Task runner (run `make` for the list)
```

## Architecture

Eleventy v3 with no site framework. `eleventy.config.mjs` registers the shortcodes, filters, collections, and passthrough copies, restores YAML support for `_data/` (dropped in 11ty v3), and wires KaTeX into markdown-it.

- **Templating**: Nunjucks for both `.njk` and `.md`. Layouts live in `_includes/layouts/`: `post` and `page` extend `base`; `standalone` is the bare chrome for `/calc/<name>/`. The home page is `base` with `hero: true`.
- **Permalinks**: `_posts/_posts.11tydata.mjs` tags everything in `_posts/` as `posts` and strips the date prefix to build `/blog/<slug>/`, using `postSlug` from `_tools/lib.mjs` (also the `postSlug` filter that looks up archived comments). `_drafts/_drafts.11tydata.mjs` does the same for `/drafts/<slug>/`.
- **Collections**: `publicPosts` (everything in `_posts/`, newest first) feeds the blog page, feed and sitemap; `drafts` backs the drafts listing.
- **Passthrough copy**: `css/`, `font/`, `img/`, `js/`, `robots.txt`, `llms.txt`, plus KaTeX's stylesheet and fonts out of `node_modules/`. In `--serve`, `img/` is served from disk instead of copied.
- **Page weight**: `head.njk` loads the Prism, KaTeX, uPlot, compare and model-viewer assets only when the rendered page contains their markup. `fig` and `gallery` lazy-load every image after the first on a page. Fonts are WOFF2 with `font-display: swap`.
- **Generated assets**: `js/ee-calculator.js` is bundled from `src/ee-calculator/` by `_tools/build-ee-calculator.mjs` and is gitignored. Every `make` target runs the bundler before Eleventy, and CI drives the build through the same `make` targets.
- **Output**: `_site/` locally, `public/` for the Pages deploy on `master`, `test/` for branch pipelines.

## Linting & Formatting

[Prettier](https://prettier.io/) handles autoformatting for Markdown, JSON, YAML, CSS, and JS, with two-space indent, LF line endings, and `proseWrap: preserve` (see `.prettierrc`). CI runs `npx prettier --check .` on every push. [Lefthook](https://lefthook.dev/) wires it into git hooks.

```bash
make lint          # check formatting (CI runs this)
make lint-fix      # auto-fix formatting
```

Git hooks are installed automatically via `make install` / `npm install` (the `prepare` script runs `lefthook install`). On each commit, Lefthook runs Prettier on staged files and prints spelling suspects on the lines the commit adds (advisory, never blocks). On each push, it runs `make check` (lint + build + internal link check), mirroring the CI pipeline.

## Resume

The resume is rendered from `_data/resume.yml`. Edit that file to update experience, skills, education, or projects.

CSS custom properties are defined in `css/main.css` under `:root` for colors and fonts.

## Blog Posts

Posts live in `_posts/` as Markdown files with YAML front matter:

```yaml
title: Post Title
date: 2019-01-08T01:01:01-05:00
categories:
  - General
tags:
  - robotics
```

The layout and the `posts` tag come from `_posts/_posts.11tydata.mjs`. Every post in `_posts/` is published; unfinished posts live in `_drafts/`, served at `/drafts/` with `noindex` and blocked in `robots.txt`.

Posts show an "updated" date taken from the last git commit that edited the file's body (`_data/gitDates.mjs`), and the sitemap uses it as `lastmod`. Frontmatter-only edits, renames, and commits touching five or more posts (formatting passes, tag overhauls) do not count, nor do edits within a day of publication. Set `updated:` in the frontmatter to override it, or `updated: false` to hide it. CI needs full history and `git` in the image for this, see `.gitlab-ci.yml`.

To create a new post: `./_tools/new-post.sh "Post Title"`, then `./_tools/publish.sh <slug> [YYYY-MM-DD]` when it is ready.

Prose conventions for posts (touchstone authors, sentence-level rules, patterns to avoid) live in `STYLE.md`.

### Shortcodes

Available in post content:

```md
{% fig "/img/blog/slug/photo.jpg", "Caption text" %}
{% fig "/img/blog/slug/tall.png", "Caption text", "18em" %} <!-- optional max width for this figure -->
{% gallery 3, "/img/blog/slug/a.jpg", "/img/blog/slug/b.jpg", "/img/blog/slug/c.jpg" %}
{% compare "/img/blog/slug/before.jpg", "/img/blog/slug/after.jpg", "Caption text" %}
{% calc "deadbeef" %}
{% youtube "video-id" %}
{% spotify "track-id" %}
{% wayback "https://web.archive.org/web/...", "link text" %}
{% model "/img/blog/slug/model.glb", "Caption", "0deg 75deg auto" %}
```

The `{% plot %}` paired shortcode renders an interactive uPlot graph from a JSON config in its body (see `js/plot.js` for the accepted keys). Prettier reformats that JSON and breaks the shortcode, so precede every block with `<!-- prettier-ignore -->`:

```md
<!-- prettier-ignore -->
{% plot "Caption text" %}
{
  "fn": "sin(k*x)",
  "x": { "min": -6, "max": 6, "label": "input x" },
  "sliders": [{ "var": "k", "min": 0.5, "max": 5, "step": 0.1, "value": 1 }]
}
{% endplot %}
```

Post images go in `img/blog/<post-slug>/`. The post layout adds the archive banner to every post dated before 2014; `archiveBanner: false` in the frontmatter removes it.

### Math

[KaTeX](https://katex.org/) is rendered server-side at build time. Use dollar delimiters directly in Markdown:

```
Inline: $E = mc^2$
Block:  $$\int_0^\infty e^{-x^2}\,dx = \tfrac{\sqrt{\pi}}{2}$$
```

A `{% math %}...{% endmath %}` paired shortcode is also available for cases where you need to bypass Markdown (e.g. literal dollar signs nearby). Add `"inline"` as an argument to render inline instead of block:

```
{% math %}P_A = T_A(R){% endmath %}
{% math "inline" %}x + y{% endmath %}
```

Supported functions, symbols, and environments: [KaTeX Supported Functions](https://katex.org/docs/supported.html).

## Encrypted Contact Info

Phone and email are stored as AES-GCM ciphertext (base64) in `_data/resume.yml`. They are decrypted client-side using the Web Crypto API in `_includes/footer.njk` when a visitor provides the correct key via URL parameter. The key is derived from the password using PBKDF2-SHA256 with 200,000 iterations; the payload layout is `salt[16] || iv[12] || ciphertext+tag`.

### Viewing encrypted contact info

Visit the site with the decryption key:

```
https://asmat.ca?key=YOUR_SECRET_KEY
```

### Encrypting new contact info

Run the helper and paste the output into `_data/resume.yml`:

```bash
node _tools/encrypt-contact.mjs --key 'YOUR_SECRET_KEY' --text 'your-secet'
```

Each invocation prints a base64 string; assign it to `phone:` or `email:` in `_data/resume.yml` as a plain quoted scalar.

To verify a payload matches a given key without firing up the browser:

```bash
node _tools/decrypt-contact.mjs --key 'YOUR_SECRET_KEY' --text '<base64-payload>'
```

## Blog Archive

The blog has two sections:

- **Recent posts** (2019+): current writing
- **Carlitos' Contraptions Archive** (2006-2013): restored from the old carlitoscontraptions.com WordPress blog, covering maker projects, robotics, electronics, and Arduino

Posts are grouped by year in a two-column grid with color-coded category dots.

## Analytics

Page views are tracked with [Umami](https://umami.is/) (privacy-friendly, no cookies). The tracking script is loaded in `_includes/head.njk`.

## AI Crawlers

`robots.txt` blocks AI training crawlers (GPTBot, ClaudeBot, CCBot, etc.) while allowing citation/search crawlers (ChatGPT-User, PerplexityBot, etc.). `llms.txt` provides a machine-readable site summary and declares the All Rights Reserved copyright (see `LICENSE`).

## SEO & Structured Data

All meta tags and JSON-LD blocks are emitted from `_includes/head.njk` (site-wide) and `_includes/layouts/post.njk` (post-specific).

- **Meta description**: homepage and `/blog/` use the first paragraph of `resume.summary`; posts use an auto-generated excerpt from the article body (stripping the title, post-meta, comments, and post-nav, via the `excerpt` filter in `eleventy.config.mjs`); other pages fall back to `site.description`. Any page can override with a `description:` frontmatter field.
- **Open Graph + Twitter Card** meta tags on every page (`og:title`, `og:description`, `og:url`, `og:image`, `og:type`, plus `twitter:card=summary_large_image`). Posts also emit `article:author`, `article:published_time`, `article:section`, and `article:tag`. Default `og:image` is `/img/carlos-asmat.jpg`; posts can override via `image:` frontmatter.
- **JSON-LD**:
  - `Person` schema on every page, populated from `_data/resume.yml` (name, jobTitle, worksFor, image, sameAs)
  - `WebSite` schema on the homepage
  - `BlogPosting` and `BreadcrumbList` schemas on post pages
- **Image alts**: the `fig` and `gallery` shortcodes auto-derive alt text from `<post-slug> <filename>` when no caption is provided. Decorative icon SVGs use `aria-hidden="true"`.

## Responsive Design

The smallest target viewport is **360px** wide (standard Android phones). The mobile breakpoint is `30em` (480px). Test at 360px to catch any element that overflows.

## Deployment

The site is deployed to GitLab Pages via `.gitlab-ci.yml`. Pushes to `master` trigger a production build (Node 22, Eleventy v3).

## GitHub Mirror & Comments

The GitLab repo is mirrored to [GitHub](https://github.com/Sotilrac/sotilrac.gitlab.io) via GitLab's push mirroring (Settings > Repository > Mirroring repositories), authenticated with a GitHub personal access token. The mirror exists to support [Giscus](https://giscus.app/), a comment system backed by GitHub Discussions. The Giscus script is loaded in `_includes/layouts/post.njk` and maps discussions to pages by pathname.

Archived comments from the original WordPress blog are stored as YAML files in `_data/comments/` and rendered automatically by the post layout.

## Useful Tools

Helper scripts in `_tools/`. External tools used during migrations are listed at the bottom.

**Authoring**

- `new-post.sh "Title"`, create a dateless draft in `_drafts/` with frontmatter and image folder
- `publish.sh slug [YYYY-MM-DD]`, promote a draft from `_drafts/` to `_posts/`, adding a `date:` field and the date prefix to the filename
- `redate-post.sh file YYYY-MM-DD`, change a post's date in the frontmatter and filename
- `spell.mjs [--staged] FILE`, aspell spelling (Canadian English) plus a grammar pass for doubled words, common typos, and double spaces, filtered through `_tools/spell-dictionary.txt` (`make spell FILE=...`). `--staged` limits the report to lines added in the index, which is how the pre-commit hook calls it
- `lowercase-files.sh`, lowercase all filenames in a directory

**Build verification**

- `check-internal-links.mjs [output-dir]`, verifies every internal `href`/`src` in the built HTML resolves to a real file. Defaults to `_site/`. Exits 1 on any broken reference.

**Specialty**

- `extract-codex-prompts.mjs [path/to/models.json]`, extracts each model's `base_instructions` from a models.json dump into sibling `<slug>.md` files (used by the no-goblins post)

**Shared code**

- `lib.mjs`, helpers imported by the scripts above and by the Eleventy config: `postSlug`, `listPosts`, `parseArgs`
- `contact-crypto.mjs`, PBKDF2/AES-GCM parameters shared by `encrypt-contact.mjs`, `decrypt-contact.mjs` and the browser decryptor in `footer.njk` (via `_data/contactCrypto.mjs`)

**Historical migration scripts (Blogspot/WordPress port, in `_tools/archive/`)**

- `check-links.mjs`, checks external links in old posts for liveness and looks up Wayback Machine snapshots; writes `link-report.json`
- `apply-wayback-links.mjs`, replaces dead external links with `{% wayback %}` shortcodes using `link-report.json`
- `fix-internal-links.mjs`, rewrites old carlitoscontraptions.com and Blogspot internal links to the new `/blog/<slug>/` format
- `fetch-blogspot-images.mjs`, downloads images from the old Blogspot blog and writes a JSON report
- `retry-failed-images.mjs`, retries failed image downloads with alternative URL patterns
- `generate-post-updates.mjs`, generates a JSON plan describing image references that need updating per post
- `update-post-images.mjs`, applies the plan: converts bare filenames to full paths and maps old filenames to sanitized downloaded names
- `comment-lost-images.mjs`, comments out `{% fig %}` references where the image file no longer exists
- Migration data: `blogspot-html-cache.json`, `blogspot-image-report.json`, `link-report.json`, `post-update-plan.json`

**External**

- [Turndown](https://domchristie.github.io/turndown/), HTML to Markdown converter (used during the WordPress migration)
