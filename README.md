# asmat.ca

Personal site, resume, and blog — built with [Eleventy](https://www.11ty.dev/) v3.

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
│   └── resume.yml        # Resume data (experience, skills, education, projects)
├── _includes/
│   ├── layouts/          # Page layouts (base, home, post, page, plain)
│   ├── head.njk          # HTML <head>
│   ├── header.njk        # Navigation bar
│   ├── footer.njk        # Footer + contact decryption JS
│   └── resume.njk        # Resume template
├── _posts/               # Blog posts (Markdown + Nunjucks)
├── css/main.css          # Compiled stylesheet (Bootstrap 4 + custom)
├── font/                 # Custom fonts (Hack, Open Sans, Telegrama, FontAwesome)
├── img/                  # Favicons
├── index.njk             # Home page (resume)
├── blog.njk              # Blog archive
└── feed.njk              # RSS feed
```

## Resume

The resume is rendered from `_data/resume.yml`. Edit that file to update experience, skills, education, or projects — the site rebuilds automatically.

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

Only posts with `status: public` appear on the blog page and RSS feed.

### Shortcodes

Use these in post content:

```
{% fig "image-url.jpg", "Caption text" %}
{% youtube "video-id" %}
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

2. Open the browser console — the encrypted JSON object will be logged.

3. Copy the JSON object and paste it into `_data/resume.yml` as the `phone` or `email` value.

## Deployment

The site is deployed to GitLab Pages via `.gitlab-ci.yml`. Pushes to `master` trigger a production build.

## Useful Tools

- [Turndown](https://domchristie.github.io/turndown/) — HTML to Markdown converter (used during the WordPress migration)
