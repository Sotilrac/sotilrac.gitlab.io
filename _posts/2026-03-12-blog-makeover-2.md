---
layout: layouts/post.njk
status: public
title: Blog Makeover, Take 2
author: Carlos
date: 2026-03-12T12:00:00-05:00
categories:
  - News
tags:
  - web
---

After yet another five-year hiatus, the blog is back... again.

Last time, I migrated from a spam-infested WordPress to Jekyll and called it a day. This time, Jekyll itself started feeling like the old guard: Ruby dependencies, slow builds, and an ecosystem that feels dated. So I did what any reasonable engineer would do: I ignored it for half a decade and then rewrote it in something else.

The site now runs on [Eleventy](https://www.11ty.dev/), a simpler and faster static site generator. Every push to master builds and deploys to GitLab Pages via a GitLab CI/CD pipeline. If you're curious about how it all fits together, the [source is on GitLab](https://gitlab.com/sotilrac/sotilrac.gitlab.io). Gone are Ruby, Gemfiles, and the SCSS compilation step; in their place, Node.js, Nunjucks templates, and plain CSS. The build takes about 0.67 seconds for all 148 files, which, coincidentally, is roughly how much time I get to invest in this blog per month.

A key design goal this time: the site should survive neglect. Minimal dependencies, plain CSS instead of preprocessors, no frameworks that will be obsolete next year. When I inevitably ignore this blog for another half decade, I want it to still build and deploy without having to debug a graveyard of abandoned packages.

Most of these upgrades come thanks to the advances in CSS and JS over the last decade. But one feature is back from the 2010s: RSS! The blog now contains 100% more RSS, which should make it easier for my (most likely imaginary) readers to receive the content. Comments are back too, via [Giscus](https://giscus.app/), which sits on top of GitHub Discussions: I never have to run a database, and anyone with a GitHub account can chime in.

While I was at it, I finally cleaned up all the old posts. The typos from my early days of writing in English have been (mostly) corrected, though I kept the original voice intact for historical authenticity... or laziness. Either way.

Also, no cookie banners, no subscribe popups, no autoplay videos. I am so tired of the _mOdErN_ web making every site visit feel like an obstacle course. This site loads the content and gets out of your way. Visit counts run through [Umami](https://umami.is/), which is privacy-conscious by design: no cookies, no personal identifiers, no cross-site tracking, only a tally of which pages get read.

Another conscious choice: every post shows its publication date. Hiding dates has become a common move in the last decade to keep content looking fresh indefinitely. In my mind, knowing when something was written is good context for judging it, and more information is always _more better_. Same goes for articles that you have to click to read after the fold. Those techniques are meant to trap people into spending more time on your site.

The resume still renders from a YAML file, and the contact info is still encrypted because I thought that was clever in 2018, and I'm not about to admit otherwise. The implementation has aged better than the joke: the in-browser decryption now runs on the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) (AES-GCM with a PBKDF2-derived key), so the page no longer ships a third-party crypto library to do the same job. Same trick, less to download. The blog still has the same grand ambitions of regular updates that it had last time.

See you in 2031!
