---
layout: layouts/post.njk
author: Carlos
title: Mad Skills
categories:
  - Software
tags:
  - claude-code
  - tools
  - leadership
  - work
date: 2026-09-02T12:00:00-04:00
---

For most of the last decade, my job has been leading robotics teams, and code was something I reviewed far more often than I wrote. This past year, that flipped. I have been coding more than I have in a long time and, more to the point, finishing things: a couple of web apps, the calculators and plots on this blog, and a pile of small tools that had been waiting in a text file for years. I did not get more free time (I checked); LLMs got good enough to use, and the projects I had been meaning to build finally fit into the partitioned days I already have.

## A New Power Tool

{% fig "/img/blog/mad-skills/tony-stark-meme.gif", "OG vibecoder" %}

A table saw does not teach a carpenter joinery, but with one, a cabinet takes an afternoon instead of a week. That is what the LLM does for me: it lowers both the time a task takes and the activation energy to start it. At work, I can fit coding tasks and push features between meetings; at home, a project that used to need a free weekend, and therefore never happened, now fits in an evening. More than lending skill, LLMs turn a small chunk of time that would otherwise get me nowhere into a shippable nugget.

Claude Code runs in a terminal, where it can create and edit files, build and run programs, and read whatever those programs print back. On a Linux machine that amounts to controlling everything, which is what makes it useful and also what makes fluency with bash indispensable: you want to know at a glance what to allow, what to block, and how to get it unstuck.

## Been There, Done That

What makes the tool work for me is that I already know how to use it, because I have been doing the same thing with people for years. I instruct the model the way I would instruct a junior member of my team: I envision the architecture, describe it clearly, make the judgment calls early so it doesn't paint itself into a corner, and hand over a map of how to get the work done. It can be trusted with some technical decisions and needs explicit direction on the rest. This is delegation, and any team lead or senior engineer has been practicing it for ages.

The other half of delegating well is making sure the person can check their own work without waiting on you. LLMs performs much better in a repo with unit tests, linting, a build that fails loudly, and pre-commit and pre-push hooks that run all of it, because every step gets immediate feedback and the model iterates on its own instead of asking me. The same tooling is exactly what a new hire needs on their first week, so a codebase set up for an LLM is a codebase set up for people, and I have started treating that tooling as the first deliverable of any project rather than the last.

## Recipes

One thing that separates the model from a junior is that, contrary to popular belief, it does not learn. It can save preferences and standing permissions, but every session starts from scratch, and it never absorbs the idiosyncrasies of your code or your taste. In practice, this meant I kept reprompting the same things: how to lay out a web app, how D2 diagrams actually work, what a Jira workflow looks like in my team.

So I moved those lectures into skills, short markdown files that the agent loads only when the request matches their description, and collected them in [a repo](https://gitlab.com/sotilrac/skills). They are mostly recipes for things I was already doing by hand:

- [d2-diagrams](https://gitlab.com/sotilrac/skills/-/tree/main/d2-diagrams), a reference for the D2 diagram language with the layout gotchas I kept rediscovering. This is the one that started it all, because LLMs are great at HTML and dreadful at D2.
- [standalone-web-app](https://gitlab.com/sotilrac/skills/-/tree/main/standalone-web-app) and [nextcloud-web-app](https://gitlab.com/sotilrac/skills/-/tree/main/nextcloud-web-app), a playbook for local-first browser apps and a companion that ships the same engine to the Nextcloud App Store.
- [html-deck](https://gitlab.com/sotilrac/skills/-/tree/main/html-deck), single-file HTML slide decks I can version-control instead of fighting Keynote.
- [fdroid-publish](https://gitlab.com/sotilrac/skills/-/tree/main/fdroid-publish), how to get an Android app into F-Droid and past its reviewers.
- [ticket](https://gitlab.com/sotilrac/skills/-/tree/main/ticket), a Jira ticket worked end to end, from fetch to PR, invoked by hand because I don't want the model deciding on its own to ship branches.
- [translate](https://gitlab.com/sotilrac/skills/-/tree/main/translate), document translation that gathers native material in the target language first and builds a lexicon from it.
- [avoid-ai-tropes](https://gitlab.com/sotilrac/skills/-/tree/main/avoid-ai-tropes), a catalogue of the patterns and vocabulary (Claudisms) that reek of AI slop, and a scanner.

Each one is a page or two, terse, gotchas in front. A skill is the closest the model gets to learning on the job: I do the remembering once, in a file, and every future session inherits it.

## Apprenticeship

All of the above works because I bring twenty-odd years of judgment to the prompt. For a junior engineer, the same tool doesn't feel as empowering; it can feel like following instructions from a seemingly authoritative black box. We need to handle this gap better.

The trades solved this a long time ago. An apprentice carpenter does not get the table saw on day one; they sweep, measure, cut by hand, learn what a good joint feels like, and earn the power tools as they develop the judgment to use them without losing a finger. Software needs the same structure now: juniors who write and debug code themselves before the model does it for them, reviews that ask why rather than whether it passes, and LLM access that widens as their judgment does. An engineer who has only pressed the button on the table saw cannot tell when the cut is wrong.

This has to be a deliberate decision about how we lead teams, because we are defaulting to the opposite. Managers tend to think that since seniors are now more productive thanks to LLMs, they don't need to augment the team with juniors; the juniors who do get hired start with the model on day one and end up producing code they won't even get to review. In three to five years, either we have a workforce of engineers who came up through an apprenticeship and can wield these tools with judgment, or we have no one to promote into the senior seats, because we stopped growing them. Not great now, and considerably worse later.

## Skills You Can't Install

{% fig "/img/blog/mad-skills/kung-fu.gif", "Download skills" %}

When we work, part of the product is the artifact: a function, a library, an app, a robot behaviour. The other part, which we don't ship, is the skill we build doing it, the judgment accumulated from what worked and what burned us. A `SKILL.md` captures the first kind of knowledge; the second kind only grows in people, and only if we let them do the work.

It also helps to remember what the models are made of: all the open source, public domain, and open content published to date, contributed freely if not always willingly. That diet makes them superb at variations on things that have been done a thousand times. Creating something new still takes imagination, ingenuity, and mad skills, and someone has to be around to have them.
