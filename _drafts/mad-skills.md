---
layout: layouts/post.njk
author: Carlos
title: Mad Skills
categories:
  - Software
tags:
  - claude-code
  - tools
  - automation
---

<!--
  goal: to show how it feels to code with ai as a senior. provide caveats and insight. expand into how this translaets in teams and organizations

 -->

 <!--

 I've been playing with Claude Code and ended up making a couple web apps. This was an area that I hand't got to develop and it seems LLMs excell at it since there's somuch relevant material redilly available. For those unfamiliar, Claude code is a tool to run a more coding oriented version of the LLM in the command line (and i think now also in teh browser, but I haven;t use that version). This allows it to use your local computing resources, to create and edit files, build and run programs, and red the output such programs generate. This is quite powerful, especially when running in in a linux terminal becuase you can control almost every aspect of the computer formthe command line.

 Coding with the LLM feels like wearing an exoskeleton that makes you faster and stronger. Much like iron man, the OG vibe coder, it feels like you can have something that can translate your thoughts into concrete code.

 For this to work well there are two things that are needed: the LLM needs to be competent enough, and you need to ahve clear and realizable ideas. There's a third thing: you need to have a good enough metal model of the LLM in order to communicate the ideas in a way that makes thme actionable.

 So, to recap, in order to bring an idea to fruition, you need to have a clear plan and express it in a way that can be implented by something otehr than you. You need to make sure that whatever is implementing it, has the apropriate skill level to actually acomplish it.

 This is starting to sound a lot like delegation. For team leads and senior engineers, this is nothing new. We've been doing this for ages. So working with LLMs feels a lot like working with junior engineers. They needs explicit direction, can be trusted with some technical decicions, but ultimately they need to be provided with a clear map of how to complete the work. Provideing the early judgement calls early on in a project can help claude avoid painting itself into a corner and shurning tokens.

 Another similar aspect is that CLaude code perfroms much better when provided with mechanisms for validating its performance as it dgoes, unit tests, linting, building, code standards. This quick feedback enables it to iterate quickly and mure independently. Much like a juniour would benefit from the same tools.

 I feels particularly blessed in this case becuase I have been fortunate enough to gather a lot of such experience: both with hands-on code development and leading teams.

 Otehr useful skills:
 * bash and the linux command line in general. As Claude code uses a lof of linux command line tools and it is quite helpful to know at a glance what to dis/allow or how to gte it unstuck

 One substantial difference with working with otehr enginneers is that Claude doens't learn. At least not in the way a person does. It can save prefernces and you can give it permission to run certain types of commands, but it doens't learn the preferences, and idiosincracies of the code, especially across different repos.

 This is one of the main caveats when adopting LLMs, especially if you're considering replacing juniors.

 This means i find myself reprompting a lot of teh same things.

 THis in when skills come ine hansy: https://gitlab.com/sotilrac/skills

 Very much like how Claude is very good at html and react, becuase of the abondance of material it sucks at D2 (a newer diagraming laguage) and rutinely halucinates of insists on wrong paradigms and features. This is what dot me started with writing skills.


  -->

I've been playing with Claude Code and ended up making a couple of web apps. Web development was a corner of the trade I had never got around to, and LLMs turn out to excel at it, presumably because so much relevant material sits readily available online. Along the way I formed some opinions about what makes the experience work, hit one caveat that anyone planning to replace their junior engineers should hear first, and built a workaround I liked enough to publish.

For those unfamiliar, Claude Code is a tool that runs a coding-oriented version of the LLM in the command line (there's a browser version now too, which I haven't used). The command line is the point: it lets the model use your local computing resources to create and edit files, build and run programs, and read whatever output those programs produce. On a Linux machine this amounts to near-total control, since almost every aspect of the computer is reachable from a terminal.

## The exoskeleton

Coding with the LLM feels like wearing an exoskeleton that makes you faster and stronger. Much like Iron Man, the OG vibe coder, you get a suit that translates your thoughts into concrete code.

For this to work well, two things are needed: the LLM has to be competent enough, and you have to have clear, realizable ideas. There's a third: you need a good enough mental model of the LLM to communicate those ideas in a way that makes them actionable.

So, to recap, bringing an idea to fruition means having a clear plan, expressing it so something other than you can implement it, and making sure whatever is implementing it has the skill to pull it off. This is starting to sound a lot like delegation.

## You've done this before

For team leads and senior engineers, none of this is new; we've been doing it for ages. Working with the LLM feels a lot like working with a junior engineer: it needs explicit direction, it can be trusted with some technical decisions, but it ultimately needs a clear map of how to complete the work. Making the judgment calls early in a project keeps Claude from painting itself into a corner and churning tokens trying to get back out.

The parallel extends to feedback. Claude Code performs much better when given mechanisms to validate its work as it goes: unit tests, linting, builds, code standards. Quick feedback lets it iterate rapidly and more independently, much like a junior benefits from the same tools.

I feel particularly blessed here, because I've been fortunate enough to gather both halves of the required experience: years of hands-on code development and years of leading teams. Fluency in bash and the Linux command line helps too; Claude leans on command-line tools constantly, and it pays to know at a glance what to allow, what to block, and how to get it unstuck.

## The catch

One substantial difference from working with other engineers is that Claude doesn't learn. At least not the way a person does. It can save preferences, and you can grant it standing permission to run certain kinds of commands, but it never absorbs the idiosyncrasies of your code, especially across repos. Every session starts from scratch. This is one of the main caveats when adopting LLMs in a team or an organization, and the one to sit with if you're considering replacing juniors: the junior you invest in compounds, while the LLM resets.

In practice, it meant I kept reprompting the same things over and over. Which brings us to skills.

## What a skill actually is

Claude Code added a feature called "skills" a while back, and I ignored it for a long time. The pitch sounded fine: drop a folder with a markdown file in `~/.claude/skills/`, Claude picks it up when relevant.

Then I got tired of pasting the same three paragraphs every time I asked for a D2 diagram. Claude is excellent at HTML and React thanks to the abundance of material, but it sucks at D2, a newer diagramming language, and routinely hallucinates features or insists on the wrong paradigm. Every conversation opened with the same lecture: ELK is the layout engine, dagre silently ignores per-container direction, here's what affects layout and what doesn't. I finally moved the lecture into a `SKILL.md`, and the next time I asked Claude to diagram a system, it just did the right thing.

So I built a few more, packed them into [a repo](https://gitlab.com/sotilrac/skills), and now I have a small collection of what I'm calling mad skills: little markdown files that pound-for-pound carry more weight than any of my actual prompt engineering.

A skill is a folder with a `SKILL.md` inside. The frontmatter declares a `name` and a `description`, and that's almost the whole interface. Claude reads the descriptions of all installed skills at the start of each turn, decides if any are relevant, and only then loads the body. If nothing matches, nothing loads. The cost of having ten installed is roughly the cost of having zero, until one triggers.

That property is the one that converted me. I had assumed adding more context meant paying for it whether or not I needed it. Skills route on the description alone, so you can stack them without compounding the bill.

## What's in the repo

Six skills so far, all things I was already doing manually.

**d2-diagrams** is a reference for the D2 diagram language. It records what works in ELK vs. dagre, what affects layout and what does not, and the gotchas I keep rediscovering. It auto-loads on any `*.d2` file, so a D2 file in a conversation flips the skill on without me asking. This is the one that started everything.

**html-deck** is for authoring single-file HTML decks with a small custom element I wrote, `<deck-stage>`. It handles keyboard navigation, auto-scaling to the viewport, one-page-per-slide print to PDF, speaker notes, and resume-where-you-left-off via localStorage. The skill ships the runtime, a template, and a worked example. I use this instead of Keynote or Google Slides for any deck I want to version-control or share as a URL.

**standalone-web-app** is a playbook for bootstrapping a local-first browser app: pnpm, Vite, React, TypeScript, with opinions on theming, component discipline, CI, and deploy targets. It is the stack I reach for when a tool needs to read user-owned data, compute something, and never talk to a server.

**nextcloud-web-app** is the companion to standalone-web-app. It adds a Nextcloud app target to the same shared engine and walks through the signed release pipeline for the Nextcloud App Store, gotchas included.

**ticket** works a Jira ticket end-to-end: fetch it over MCP, plan with me, branch, implement, commit incrementally, and open the PR. This one is invoked explicitly as `/ticket ABC-123`, since I don't want Claude deciding on its own to start shipping branches.

**translate** handles document translation, with a twist: before translating anything, it gathers native material in the target language for the same domain and register, builds a style guide and lexicon from it, and confirms the region and dialect strength with me. Translation against evidence rather than vibes.

Each skill is short, between 60 and 200 lines. The repo's README has the index, and everything is MPL-licensed.

## Why it works

The thing I underestimated is how much of "prompt engineering" is just the same context I was retyping. A skill is the version of that context I edit once and Claude reads forever. It is documentation aimed at Claude, written like documentation aimed at a colleague: terse, specific, gotchas in front, trivia in back. It is also the closest Claude gets to learning on the job; I do the remembering once, in a file, and every future session inherits it.

Two pieces of advice from doing this. First, the descriptions are the contract: Claude picks skills by matching the user's request against the description string, so the description has to lead with trigger keywords and then say what the skill does, in that order. "D2 diagram language reference" earns the load; "Carlos's notes on stuff" does not.

Second, keep the bodies short. Once a skill loads, every token competes with the actual conversation. I have cut every skill at least once after it loaded but contributed nothing useful. Long-form references and templates go in sibling files, referenced from the body so Claude reads them only when it needs to.

## Install

`./install.sh` from the repo root copies each skill into `~/.claude/skills/`, or pass names to pick specific ones. The `--list` flag shows what is available and what is already installed; `--project` installs into the current repo's `.claude/skills/` instead of the home directory; `--link` symlinks instead of copying, which I use while iterating, so edits in the repo go live without reinstalling. Changes apply mid-session, no restart.

If you have been on the fence about skills, my read is this: pick the prompt you are sick of typing, paste it into a `SKILL.md`, write a one-line description that names the trigger, and you are done. The first one is the hardest; after that, they accumulate.
