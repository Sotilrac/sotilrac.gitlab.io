---
layout: layouts/post.njk
status: public
author: Carlos
title: Pexels Wallpaper Plugin for KDE Plasma
date: 2026-04-05T16:37:51-04:00
categories:
  - Software
tags:
  - linux
  - kde
  - qml
---

KDE Plasma used to ship a wallpaper plugin that pulled random photos from [Unsplash](https://unsplash.com/) as your desktop background. It's a quality of life feature that was easy to take for granted. Then it broke, and it's not coming back 😭

## What Happened to the Unsplash Plugin?

Unsplash [deprecated](https://changelog.unsplash.com/deprecations/2021/11/25/source-deprecation.html) `source.unsplash.com` back in November 2021, but left the service running for a long transition period. It started returning 404s intermittently around June 2023, and wasn't fully shut down until June 2024. So if you noticed your wallpaper quietly stopped changing sometime in late 2023 or 2024, that's why. That's when I noticed too.

When KDE developers looked into migrating to the proper Unsplash API, they discovered that Unsplash's [API guidelines](https://help.unsplash.com/en/articles/2511257-guideline-replicating-unsplash) explicitly prohibit wallpaper applications. The Unsplash provider was [removed](https://bugs.kde.org/show_bug.cgi?id=471526) from Plasma 5.27.7 and was not carried forward to Plasma 6.

## Pexels Wallpaper Plugin

I wrote a replacement. [Pexels](https://www.pexels.com/) has a free API with no such restrictions and a large library of high-resolution photos. The old Unsplash plugin had a fixed set of categories that felt limiting, and it was hard to avoid getting photos including people. This plugin gives you direct control of the search query, so you can just ask for `landscapes` or `nebula` and get what you actually want on your desktop.

{% fig "/img/blog/plasma-wallpaper-pexels/screenshot.png", "Pexels Wallpaper plugin configuration" %}

The plugin fetches a random photo matching a search query, displays it as your wallpaper, and rotates it on a configurable interval. It shows a small overlay with an info button (links to the photo on Pexels for proper attribution) and a refresh button.

### Features:

- Configurable search query (nature, mountains, architecture, puppies)
- Auto-refresh interval (1 to 1440 minutes)
- All Plasma fill modes (crop, stretch, fit, center, tile)
- Photograph details and attribution via overlay
- Requires a free [Pexels API key](https://www.pexels.com/api/)

### Pexels Terms

Pexels' [terms](https://help.pexels.com/hc/en-us/articles/900005880463-What-are-the-Terms-and-Conditions) do say that wallpaper apps are not permitted when they "distribute Pexels content as wallpapers in a Standalone way." This plugin doesn't distribute anything. It's a client that fetches photos on demand for the user's personal desktop, using the user's own API key, with photographer attribution displayed on every image. No content is bundled, redistributed, or compiled. It's closer to a browser than a wallpaper pack.

## Install

Available through KDE's built-in plugin browser: right-click your desktop, go to **Desktop Settings**, click **Get New Plugins**, and look for "Pexels".

Or install manually:

```bash
kpackagetool5 -t Plasma/Wallpaper -i com.sotilrac.plasma.wallpaper.pexels.tar.gz
```

## Links

- Source: [gitlab.com/sotilrac/plasma-wallpaper-pexels](https://gitlab.com/sotilrac/plasma-wallpaper-pexels)
- OpenDesktop/Pling: [pling.com/p/2338714](https://www.pling.com/p/2338714/)
