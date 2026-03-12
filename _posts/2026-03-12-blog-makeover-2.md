---
layout: layouts/post.njk
status: public
title: Blog Makeover 2
author: Carlos
date: 2026-03-12T12:00:00-05:00
categories:
- News
tags:
- web
---
After yet another five year hiatus, the blog is back. Again.

Last time around, I migrated from a spam-infested WordPress to Jekyll and called it a day. This time, Jekyll itself started feeling like the old guard. Ruby dependencies, slow builds, and an ecosystem that hadn't quite kept up. So I did what any reasonable engineer would do: I ignored it for half a decade and then rewrote it in something else.

The site now runs on [Eleventy](https://www.11ty.dev/), a simpler and faster static site generator. No more Ruby, no more Gemfiles, no more SCSS compilation step. Just Node.js, Nunjucks templates, and plain CSS. The build takes about 0.3 seconds for all 142 posts, which is roughly how long it takes me to forget I have a blog.

While I was at it, I finally cleaned up all the old posts. The typos from my early days of writing in English have been (mostly) corrected, though I kept the original voice intact for historical authenticity. Or laziness. Either way.

The resume still renders from a YAML file, the contact info is still encrypted with AES because I thought that was clever in 2018 and I'm not about to admit otherwise, and the blog still has the same grand ambitions of regular updates that it had last time.

See you in 2031.
