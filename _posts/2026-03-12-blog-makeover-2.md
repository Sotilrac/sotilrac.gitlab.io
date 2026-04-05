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

Last time around, I migrated from a spam-infested WordPress to Jekyll and called it a day. This time, Jekyll itself started feeling like the old guard. Ruby dependencies, slow builds, and an ecosystem that hadn't quite kept up. So I did what any reasonable engineer would do: I ignored it for half a decade and then rewrote it in something else.

The site now runs on [Eleventy](https://www.11ty.dev/), a simpler and faster static site generator. No more Ruby, no more Gemfiles, no more SCSS compilation step. Just Node.js, Nunjucks templates, and plain CSS. The build takes about 0.67 seconds for all 148 files, which, coincidentally, is roughly how much time I get to invest in this blog per month.

A key design goal this time: the site should survive neglect. Minimal dependencies, plain CSS instead of preprocessors, no frameworks that will be obsolete next year. When I inevitably ignore this blog for another half decade, I want it to still build and deploy without having to debug a graveyard of abandoned packages.

All these upgrades are mainly possible thanks to the advancements of CSS and JS in the last decade or so. However, there's one feature that is back from the 2010s: RSS! The blog now contains 100% more RSS, which should make it easier for my (most likely imaginary) readers to receive the content.

While I was at it, I finally cleaned up all the old posts. The typos from my early days of writing in English have been (mostly) corrected, though I kept the original voice intact for historical authenticity. Or laziness. Either way.

The resume still renders from a YAML file, the contact info is still encrypted with AES because I thought that was clever in 2018, and I'm not about to admit otherwise. The blog still has the same grand ambitions of regular updates that it had last time.

See you in 2031!
