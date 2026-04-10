# [asmat.ca](https://asmat.ca)

Personal site, resume, and blog. Built with [Eleventy](https://www.11ty.dev/) v3.

## Quick Start

```bash
npm install
npm run dev      # local dev server at http://localhost:8080
npm run build    # production build to _site/
```

## Project Structure

```
├── eleventy.config.mjs   # Eleventy configuration
├── _data/
│   ├── site.json         # Site metadata (title, URLs, socials)
│   ├── resume.yml        # Resume data (experience, skills, education, projects)
│   └── comments/         # Archived blog comments (YAML, per post slug)
├── _includes/
│   ├── layouts/          # Page layouts (base, home, post, page, plain)
│   ├── head.njk          # HTML <head> (includes Umami analytics)
│   ├── header.njk        # Navigation bar
│   ├── footer.njk        # Footer + contact decryption JS
│   ├── resume.njk        # Resume template
│   └── archive-banner.njk # "Dusting off the archives" banner for old posts
├── _posts/               # Blog posts (Markdown + Nunjucks)
├── css/main.css          # Custom stylesheet (no frameworks)
├── font/                 # Custom fonts (Hack, Inter variable, Telegrama)
├── img/                  # Favicons + blog post images (img/blog/<slug>/)
├── _tools/               # Helper scripts (new-post.sh, redate-post.sh, etc.)
├── index.njk             # Home page (hero with typing animation)
├── blog.njk              # Blog archive (recent posts + Carlitos' Contraptions archive)
├── drafts.njk            # Draft posts listing (not linked from nav, blocked by robots.txt)
├── feed.njk              # RSS feed
├── robots.txt            # Crawler rules (blocks AI training, allows citation bots)
└── llms.txt              # LLM-readable site summary and license
```

## Linting & Formatting

[Prettier](https://prettier.io/) handles autoformatting for Markdown, JSON, YAML, CSS, and JS. [Lefthook](https://lefthook.dev/) runs checks automatically as a pre-commit hook.

```bash
npm run lint       # check formatting (CI runs this)
npm run lint:fix   # auto-fix formatting
```

Pre-commit hooks are installed automatically via `npm install` (the `prepare` script runs `lefthook install`). On each commit, Lefthook runs Prettier on staged files.

## Resume

The resume is rendered from `_data/resume.yml`. Edit that file to update experience, skills, education, or projects.

CSS custom properties are defined in `css/main.css` under `:root` for colors and fonts.

## Blog Posts

Posts live in `_posts/` as Markdown files with YAML front matter:

```yaml
layout: layouts/post.njk
status: draft | public
title: Post Title
author: Carlos
date: 2019-01-08T01:01:01-05:00
categories:
  - General
tags:
  - robotics
```

Only posts with `status: public` appear on the blog page and RSS feed. Draft posts are accessible at `/drafts/` (not linked from navigation, blocked by `robots.txt`).

To create a new post: `./_tools/new-post.sh "Post Title" [YYYY-MM-DD]`

### Shortcodes

Available in post content:

```
{% fig "/img/blog/slug/photo.jpg", "Caption text" %}
{% gallery 3, "/img/blog/slug/a.jpg", "/img/blog/slug/b.jpg", "/img/blog/slug/c.jpg" %}
{% youtube "video-id" %}
{% spotify "track-id" %}
{% wayback "https://web.archive.org/web/...", "link text" %}
{% model "/img/blog/slug/model.glb", "Caption", "0deg 75deg auto" %}
```

Post images go in `img/blog/<post-slug>/`. For archived posts (pre-2014), include the archive banner manually:

```
{% include "archive-banner.njk" %}
```

## Encrypted Contact Info

Phone and email are stored as AES-encrypted JSON in `_data/resume.yml`. They are decrypted client-side using [SJCL](https://bitwiseshiftleft.github.io/sjcl/) when a visitor provides the correct key via URL parameter.

### Viewing encrypted contact info

Visit the site with the decryption key:

```
https://asmat.ca?key=YOUR_SECRET_KEY
```

### Encrypting new contact info

1. Visit the site with both your key and the message to encrypt:

   ```
   https://asmat.ca?key=YOUR_SECRET_KEY&msg=your-phone-number
   ```

2. Open the browser console, the encrypted JSON object will be logged.

3. Copy the JSON object and paste it into `_data/resume.yml` as the `phone` or `email` value.

## Blog Archive

The blog has two sections:

- **Recent posts** (2019+): current writing
- **Carlitos' Contraptions Archive** (2006-2013): restored from the old carlitoscontraptions.com WordPress blog, covering maker projects, robotics, electronics, and Arduino

Posts are grouped by year in a two-column grid with color-coded category dots.

## Analytics

Page views are tracked with [Umami](https://umami.is/) (privacy-friendly, no cookies). The tracking script is loaded in `_includes/head.njk`.

## AI Crawlers

`robots.txt` blocks AI training crawlers (GPTBot, ClaudeBot, CCBot, etc.) while allowing citation/search crawlers (ChatGPT-User, PerplexityBot, etc.). `llms.txt` provides a machine-readable site summary and declares the CC BY-NC-SA 4.0 license.

## Responsive Design

The smallest target viewport is **360px** wide (standard Android phones). The mobile breakpoint is `30em` (480px). Test at 360px to ensure nothing overflows.

## Deployment

The site is deployed to GitLab Pages via `.gitlab-ci.yml`. Pushes to `master` trigger a production build (Node 22, Eleventy v3).

## GitHub Mirror & Comments

The GitLab repo is mirrored to [GitHub](https://github.com/Sotilrac/sotilrac.gitlab.io) via GitLab's push mirroring (Settings > Repository > Mirroring repositories), authenticated with a GitHub personal access token. The mirror exists to support [Giscus](https://giscus.app/), a comment system backed by GitHub Discussions. The Giscus script is loaded in `_includes/layouts/post.njk` and maps discussions to pages by pathname.

Archived comments from the original WordPress blog are stored as YAML files in `_data/comments/` and rendered automatically by the post layout.

## Useful Tools

- [Turndown](https://domchristie.github.io/turndown/), HTML to Markdown converter (used during the WordPress migration)
- `_tools/new-post.sh`, create a new blog post with frontmatter and media folder
- `_tools/redate-post.sh`, rename a post file with a new date
- `_tools/lowercase-files.sh`, lowercase all filenames in a directory
