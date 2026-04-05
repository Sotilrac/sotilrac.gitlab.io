---
layout: layouts/post.njk
status: public
published: true
title: Tiny Firefox
author: Carlos
id: 89
date: 2009-11-19T14:58:33-05:00
categories:
  - Software
tags:
  - software
  - Open Source
---

{% include "archive-banner.njk" %}

Ever since I got [my EeePC](/blog/eee-pc-1000-ubuntu-kde-41/ "EeePC"), I got obsessed by the amount of screen real-state Firefox takes for the top menu, browsing control buttons, address and search bar, etc.

The quickest fix I always apply every time I am in front of a Firefox windows that is not mine is to move the Bookmarks toolbar content right next to the File menu and to disable the Bookmarks toolbar. This removes one full toolbar, and unless you have a really heavily populated Bookmarks toolbar, should function very well.

But I wanted to go further (especially since I saw that Chrome uses less screen real-state). So I installed a few add-ons that make a significant difference:

- AHS. {% wayback "https://web.archive.org/web/20101017130048/https://addons.mozilla.org/en-US/firefox/addon/1530/", "autoHideStatusbar" %} does precisely that. It hides the status bar unless it is required (i.e. a page is loading or you hover a link) or you go near it with the mouse pointer.
- [Smart Stop/Reload](https://addons.mozilla.org/en-US/firefox/addon/7401 "Smart Stop/Reload"). It combines the Stop and Reload buttons (since they are never used at he same time).
- {% wayback "https://web.archive.org/web/20090416065806/https://addons.mozilla.org//en-US//firefox//addon//1455", "Tiny Menu" %}. It transforms the File menu into a single item. This extension saves a lot of real-state and the menu remains nice ans usable.

By using these extensions and moving things around in the toolbars, you can achieve a very tiny navigation interface that is perfectly usable.

{% fig "/img/blog/tiny-firefox/tiny_firefox.png", "Tiny Firefox" %}

Note the [Tux](/blog/tux-laptop-sleeve/ "Tux") theme (I a'm using Personas)
