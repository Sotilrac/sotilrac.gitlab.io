---
author: Carlos
title: Mad Skills
categories:
  - Info
tags:
  - claude-code
  - tools
  - automation
---

I've been playing with Claude Code and ended up making a couple web apps. THis was an area that I hand't got to develop and it seems LLMs excell at it since there's somuch relevant material redilly available.

Claude Code added a feature called "skills" a while back, and I ignored it for a long time. The pitch sounded fine: drop a folder with a markdown file in `~/.claude/skills/`, Claude picks it up when relevant. I had a lifetime supply of half-formed automation ideas that hadn't survived earlier rounds, though, and I wasn't excited about trying again.

Then I got tired of pasting the same three paragraphs into Claude every time I asked it to draw a D2 diagram. "ELK is the layout engine, dagre silently ignores per-container direction, here's what affects layout and what doesn't." The same paragraphs, every conversation. I finally moved them into a `SKILL.md`, and the next time I asked Claude to diagram a system, it just did the right thing.

So I built a few more, packed them into a repo, and now I have a small collection of what I'm calling mad skills: little markdown files that pound-for-pound carry more weight than any of my actual prompt engineering.

## What a skill actually is

A skill is a folder with a `SKILL.md` inside. The frontmatter declares a `name` and a `description`, and that's almost the whole interface. Claude reads the descriptions of all installed skills at the start of each turn, decides if any are relevant, and only then loads the body. If nothing matches, nothing loads. The cost of having ten installed is roughly the cost of having zero, until one triggers.

That property is the one that converted me. I had assumed adding more context meant paying for it whether or not I needed it. Skills are routed by their description, not by their body, so you can stack them without compounding the bill.

## What's in the repo

Three skills so far, all things I was already doing manually.

**d2** is a reference for the D2 diagram language. It records what works in ELK vs. dagre, what affects layout and what does not, and the gotchas I keep rediscovering. It auto-loads on any `*.d2` file, so a D2 file in a conversation flips the skill on without me asking. This is the one that started everything.

**html-deck** is for authoring single-file HTML decks with a small custom element I wrote, `<deck-stage>`. It handles keyboard navigation, auto-scaling to the viewport, one-page-per-slide print to PDF, speaker notes, and resume-where-you-left-off via localStorage. The skill ships the runtime, a template, and a worked example. I use this instead of Keynote or Google Slides for any deck I want to version-control or share as a URL.

**standalone-web-app** is a playbook for bootstrapping a local-first browser app: pnpm, Vite, React, TypeScript, with opinions on theming, component discipline, CI, and deploy targets. It is the stack I reach for when a tool needs to read user-owned data, compute something, and never talk to a server.

Each skill is short, in the 150-to-200-line range. The repo's README has the index, and everything is MIT-licensed.

## Why it works

The thing I underestimated is how much of "prompt engineering" is just the same context I was retyping. A skill is the version of that context I edit once and Claude reads forever. It is documentation aimed at Claude, written like documentation aimed at a colleague: terse, specific, gotchas in front, trivia in back.

Two pieces of advice from doing this. First, the descriptions are the contract: Claude picks skills by matching the user's request against the description string, so the description has to lead with trigger keywords and then say what the skill does, in that order. "D2 diagram language reference" earns the load; "Carlos's notes on stuff" does not.

Second, keep the bodies short. Once a skill loads, every token competes with the actual conversation. I have cut every skill at least once after it loaded but contributed nothing useful. Long-form references and templates go in sibling files, referenced from the body so Claude reads them only when it needs to.

## Install

`./install.sh` from the repo root copies each skill into `~/.claude/skills/`. The `--list` flag shows what is available and what is already installed; `--link` symlinks instead of copying, which I use while iterating, so edits in the repo go live without reinstalling. Changes apply mid-session, no restart.

If you have been on the fence about skills, my read is this: pick the prompt you are sick of typing, paste it into a `SKILL.md`, write a one-line description that names the trigger, and you are done. The first one is the hardest; after that, they accumulate.
