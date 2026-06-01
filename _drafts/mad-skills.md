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

 I've been playing with Claude Code and ended up making a couple web apps. THis was an area that I hand't got to develop and it seems LLMs excell at it since there's somuch relevant material redilly available. For those unfamiliar, Claude code is a tool to run a more coding oriented version of the LLM in the command line (and i think now also in teh browser, but I haven;t use that version). This allows it to use your local computing resources, to create and edit files, build and run programs, and red the output such programs generate. This is quite powerful, especially when running in in a linux terminal becuase you can control almost every aspect of the computer formthe command line.

 Coding with the LLM feels like wearing an exoskeleton that makes you faster and stronger. Much like iron man, the OG vibe coder, it feels like you can have something that can translate your thoughts into concrete code.

 For this to work well there are two things that are needed: the LLM needs to be competent enough, and you need to ahve clear and realizable ideas. There's a third thing: you need to have a good enough metal model of the LLM in order to communicate the ideas in a way that makes thme actionable.

 So, to recap, in order to bring an idea to fruition, you need to have a clear plan and express it in a way that can be implented by something otehr than you. You need to make sure that whatever is implementing it, has the apropriate skill level to actually acomplish it.

 This is starting to sound a lot like delegation. For team leads and senior engineers, this is nothing new. We've been doing this for ages. So working with LLMs feels a lot like working with junior engineers. They needs explicit direction, can be trusted with some technical decicions, but ultimately they need to be provided with a clear map of how to complete the work. Provideing the early judgement calls early on in a project can help claude avoid painting itself into a corner and shurning tokens.

 Another similar aspect is that CLaude code perfroms much better when provided with mechanisms for validating its performance as it dgoes, unit tests, linting, building, code standards. This quick feedback enables it to iterate quickly and mure independently. Much like a juniour would benefit from the same tools.

 I feels particularly blessed in this case becuase I have been fortunate enough to gather a lot of such experience: both with hands-on code development and leading teams.

 Otehr useful skills:
 * bash and the linux command line in general. As Claude code uses a lof of linux command line tools and it is quite helpful to know at a glance what to dis/allow or how to gte it unstuck

 One substantial difference with working with otehr enginneers is that Claude doens't learn. At least not in the way a person does. It can save prefernces and you can give it permission to run certain types of commands, but it doens't learn the preferences, and idiosincracies of teh code, especially across different repos.

 This is one of the mian caveats when adopting LLMs, especially if you're considering replacing jun


  -->

I've been playing with Claude Code and ended up making a couple web apps. This was an area that I hand't got to develop and it seems LLMs excell at it since there's somuch relevant material redilly available.

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
