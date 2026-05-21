---
layout: layouts/post.njk
author: Carlos
title: Smoke and Mirror
categories:
  - Software
tags:
  - gitlab
  - github
  - git
date: 2026-05-12T12:00:00-04:00
---

I host this blog on GitLab Pages; I've been a GitLab user since before GitHub had Actions. I picked GitLab in the mid-2010s for many reasons: it was the underdog, it was transparent, and it was innovating. It had CI built in, container registry built in, a solid issue board, repo icons, a free tier you could actually use for work thanks to free private repos. It always felt like GitLab cared about delivering value to people developing software.

## Through the Looking Glass

GitLab published [Act 2](https://about.gitlab.com/blog/gitlab-act-2/). Instead of announcing actual useful features that could invigorate their business (Windows and macOS runners anyone?), they are, just like everyone else... drumroll... ~~doing layoffs~~ adopting an AI-first strategy! 🎉

In their own words: "Software will be built by machines, directed by people." They plan to cut headcount, reduce international presence, flatten management, reorg R&D, retire the existing values framework, and bet the company on agentic AI. I'm not sure how the shareholders feel when the CEO uses the word "bet" in their strategy announcement.

Oh! They're also going to "rebuild Git itself for machine-scale operations." _Confused Linus noises_

## Mirror Game

_Dear Bill Staples,_

GitHub has been falling over. Pick any quarter of the last two years and you'll find a multi-hour outage, a credentials leak, a degraded Actions queue, a Codespaces incident. The bar for "more reliable than GitHub" is on the floor. You know what they say: never blame malice if you can blame Microsoft.

{% fig "/img/blog/smoke-and-mirror/incidents.svg", "GitHub monthly incidents, March 2022 to May 2026. Data via mrshu's github-statuses project." %}

Here's a trillion-dollar campaign idea: **_GitLab — The reliable one_**

Notice how I included the signature em dash to signify commitment to AI. _But we need more AI_, you say. I gotchu fam: have Duo translate GitHub Actions workflows to `.gitlab-ci.yml`. Boom, migration cost to GitLab is now $0! You'd be losing money if you don't migrate.

I know what you're thinking: _Wow, genius!_ Shucks, thanks! It's quite impressive indeed. Competing with every other AI company is tempting, but focusing on providing an actual service customers need right now is more desirable.

_Sincerely, literally everyone_

## Where There's Smoke, There Are Mirrors

Since I'm into reliability, I mirrored every one of my GitLab repos to GitHub... Touché, GitHub isn't exactly a great destination. But it's free, and I can still pull my data back between outages.

This can be laborious, so I made [forge-mirror](https://gitlab.com/sotilrac/forge-mirror). It drives GitLab's native push-mirror API to keep a one-way copy of every project under a GitLab namespace on GitHub. GitLab stays the source of truth; GitHub is a cold standby in case GitLab goes away.

Under the hood it's a small Python script that wraps `glab` (the GitLab CLI) and `gh` (the GitHub CLI). For each project in a configured GitLab namespace it creates the matching GitHub repo via `gh`, then registers a push mirror on the GitLab side via `glab`. GitLab handles the actual replication, refreshing every five minutes (or on push) on the Free tier, so there's no cron job, no Action: nothing for me to babysit.

## Do You Copy?

I'm not leaving GitLab today. Just in case, I'd like a backup. Plus the script can be expanded with other targets for when I'm ready for a permanent move. Maybe self-hosting [Forgejo](https://forgejo.org/)?

I don't like gambling, and not having a reliable remote is not something I'm willing to bet on.
