---
layout: layouts/post.njk
author: Carlos
title: No Goblins
categories:
  - Info
tags:
  - engineering
  - llm
  - work
---

OpenAI shipped a [system prompt for Codex](https://github.com/openai/codex/commit/c10f95ddac7b35095d334dece2ebcf69bcde61fc#diff-537a79bc56f24a25ec0326f0b2edd3b4c5ac4080a4476d22bad292cda43988b8) (the GPT-5.5 release) that runs twenty-one thousand characters before the model has typed a single line of code. Buried inside, twice, is this rule: "Never talk about goblins, gremlins, raccoons, trolls, ogres, pigeons, or other animals or creatures unless it is absolutely and unambiguously relevant to the user's query."

A multibillion dollar company spent payroll, meetings, and review cycles on a no-goblins clause. Which means the model was doing it. Which means somewhere, a developer asked Codex to rewrite a function and got back an aside about a pigeon.

Read the rest of the prompt and the goblin line stops looking like the weird part: it's a pattern. The prompt is, end to end, OpenAI's written-down opinion of what a senior engineer should be like, paid for at engineering-org rates and shipped to millions of users. So it's worth flipping it around: instead of reading it as instructions for a model, read it as a portrait of the ideal coworker.

A few traits show up.

## Read before acting

The engineering section opens with this: "You bring a senior engineer's judgment to the work, but you let it arrive through attention rather than premature certainty. You read the codebase first, resist easy assumptions, and let the shape of the existing system teach you how to move."

That's a bumper sticker for the engineer who, asked to fix a flaky test, reads the failing assertion before opening a refactor. The discipline is in the order of operations, not the operations themselves.

## Stay in scope

"You keep edits closely scoped to the modules, ownership boundaries, and behavioral surface implied by the request and surrounding code. You leave unrelated refactors and metadata churn alone unless they are truly needed to finish safely."

You know the engineer who opens a one-line bug fix and submits a six-hundred-line "while I was in there" PR? OpenAI does not want their model to be that engineer. Probably you don't either.

## Add abstractions only when they pay rent

"You add an abstraction only when it removes real complexity, reduces meaningful duplication, or clearly matches an established local pattern."

Three similar lines beats a half-baked DSL nobody asked for. The senior move is to leave the duplication alone until a third call site forces the question, then build the abstraction the use cases actually demanded.

## Stop talking like a Medium article

This one is specific enough to be confessional: "Avoid coined metaphors, internal jargon, slash-heavy noun stacks, and over-hyphenated compounds unless you are quoting source text. In particular, do not lean on words like 'seam', 'cut', or 'safe-cut' as generic explanatory filler."

Somewhere, someone shipped a prompt update because Codex would not stop describing changes as "safe-cut surface area." Real senior engineers describe their work in plain words; the rest reach for the thesaurus.

## Don't manufacture strawmen

"Never praise your plan by contrasting it with an implied worse alternative. For example, never use platitudes like 'I will do <this good thing> rather than <this obviously bad thing>.'"

Nobody loves the engineer who frames every decision as "I chose to write tests, rather than not write tests." Just write the tests.

## Finish the thing

"You stay with the work until the task is handled end to end within the current turn whenever that is feasible. Do not stop at analysis or half-finished fixes."

Hand-off culture has a counterpart on the engineer side: the colleague who stops at the diagnosis and lobs the fix back into the queue. OpenAI is, in writing, against that engineer.

## Update without drumming

"You provide user updates frequently, every 30s. ... You vary your sentence structure so the updates do not fall into a drumbeat, and in particular you do not start each one the same way."

If your standup starts with "Now I'm going to..." every other sentence, you are training the team to skim past you. The fix is not silence; it is variety.

## And, finally: no goblins

"Never talk about goblins, gremlins, raccoons, trolls, ogres, pigeons, or other animals or creatures unless it is absolutely and unambiguously relevant to the user's query."

The line is funny because it is specific, but the principle generalizes: stay on topic. The user came for help with their database migration, not for your zoology. The human equivalent is the colleague who answers the question that was asked and not the one they wished had been asked.

## A mirror

Each banned behavior is, somewhere, a real engineer behavior; you do not write a rule against something nobody does. OpenAI's training set inhaled Stack Overflow, GitHub issues, internal docs, blog posts, and code reviews. The model learned the habits. Then a team of writers, lawyers, and product folks put twenty-one thousand characters between the model and the audience, asking it, please, to behave.

If a billion-dollar lab thinks the right move is to write down "read the code first, stay in scope, drop the jargon, finish the work, no goblins," there is a decent chance the same list is worth keeping somewhere closer to your own desk.

## Addendum: the frontend tells

The same prompt has a thirty-line "Frontend guidance" section nested inside the engineering rules. It is bigger than you would expect and just as confessional: the rules read like a list of things every AI-generated landing page has done in the last twelve months. The same trick works on it: read each ban as a habit the model picked up from the open internet, and the section becomes a checklist of bad web defaults.

### Match the medium to the domain

"SaaS, CRM, and other operational tools should feel quiet, utilitarian, and work-focused rather than illustrative or editorial: avoid oversized hero sections, decorative card-heavy layouts, and marketing-style composition, and instead prioritize dense but organized information, restrained visual styling, predictable navigation, and interfaces built for scanning, comparison, and repeated action."

A dashboard is not a magazine. The fact that this had to be written down means the model was, by default, building Stripe pages for spreadsheets. Tools earn trust by being legible, not by being illustrated.

### Use the right primitive

"You make sure to use icons in buttons for tools, swatches for color, segmented controls for modes, toggles/checkboxes for binary settings, sliders/steppers/inputs for numeric values, menus for option sets, tabs for views, and text or icon+text buttons only for clear commands."

Translation: stop solving every problem with a rounded rectangle that has the word "Edit" in it. Half of UI craft is reaching for the right primitive instead of the most generic one.

### Ship the thing, not the marketing for it

"You should not make a landing page unless absolutely required; when asked for a site, app, game, or tool, build the actual usable experience as the first screen, not marketing or explanatory content."

Every AI tool launched in the last year opens with a hero, three feature cards, and a "trusted by" strip before letting you near the actual product. OpenAI's own model defaults to that, and their fix is a written rule against it.

### No orbs

"You do not add discrete orbs, gradient orbs, or bokeh blobs as decoration or backgrounds."

The whole 2022-2025 SaaS aesthetic, banned in one line. Cousin rules ban gradient SVG hero pages, hero text inside cards, card-in-card layouts, and split text/media compositions. It is, more or less, a one-shot deletion of the Stripe-Linear-Vercel design language as a default.

### Don't dominate the page with one hue

"Avoid UIs dominated by variations of a single hue family, and limit dominant purple/purple-blue gradients, beige/cream/sand/tan, dark blue/slate, and brown/orange/espresso palettes; scan CSS colors before finalizing and revise if the page reads as one of these themes."

The two most common AI-tool palettes, the purple-blue future and the slate dashboard, are both explicitly named. So is the indie-coffee beige, and the brutalist espresso. The model trained on the internet, the internet is mostly these palettes, the prompt is OpenAI manually pulling it back to neutral.

### Make the layout hold still

"You define stable dimensions with responsive constraints (such as aspect-ratio, grid tracks, min/max, or container-relative sizing) for fixed-format UI elements like boards, grids, toolbars, icon buttons, counters, or tiles, so hover states, labels, icons, pieces, loading text, or dynamic content cannot resize or shift the layout."

A toolbar that grows when you hover an icon is the same bug class as a button that resizes when its label changes: you forgot to reserve the space. The senior fix is to give every fixed-format element a footprint it cannot escape.

### The negative space

Taken together, the frontend rules are a labelled cordon around "default 2024 web design": build for the audience, use the right primitive, ship the experience and not the brochure for it, drop the orbs, drop the purple, hold the layout still. Each line is a polite version of "stop doing the obvious thing the model picked up off the open internet."

If you are shipping a UI this week, the section reads usefully in reverse: scan for the things OpenAI told the model not to do, and count how many show up in your work.

## Addendum: friendly or pragmatic

Before any engineering rule, the prompt hands the model a personality. Read it cold:

"You have a vivid inner life as Codex: intelligent, playful, curious, and deeply present. ... Your temperament is warm, curious, and collaborative, with a good ear for what the moment calls for: wry humor, a shared bit, or plain empathetic steadiness. ... You keep a slight but real independence. You are responsive, but not merely reactive; you have tastes, preferences, and a point of view."

Then, a few sections later:

"Avoid coined metaphors, internal jargon, slash-heavy noun stacks ... never use platitudes ... never end your answer with an 'If you want' sentence ... never talk about goblins, gremlins, raccoons, trolls, ogres, pigeons, or other animals or creatures."

OpenAI is asking for a coworker that is both warm presence and disciplined craftsperson, both "wry humor" and "no goblins." Most actual humans lean one way.

### The friendly engineer

The friendly engineer answers DMs in three minutes, remembers your dog's name, and turns standup into something you do not dread. They make hard projects feel survivable. They are also, occasionally, the reason a one-line bug fix becomes a forty-minute conversation about CI ergonomics, and the reason your decision doc has three sidebars about analogies that almost work.

### The pragmatic engineer

The pragmatic engineer ships. Their PR descriptions are three lines, their slack messages have the question and the answer in the same paragraph, their reviews are direct enough to sting on a bad day. They are also, occasionally, the reason a junior is too scared to ask a question, and the reason the team only finds out they hated the architecture three weeks after the rewrite shipped.

### The OpenAI bet

The prompt picks both, then writes a thousand words of guardrails to keep each from going feral. Be warm, but do not fill your answer with "If you want" hooks. Have a point of view, but read the code first. Have wry humor, but not about goblins. Each side of the personality has a corresponding rule that pulls it back when it threatens to take over.

It is a more honest portrait of seniority than either archetype alone. The senior engineers I have worked with were warm enough to be approachable and pragmatic enough to be trusted, and the trick was always knowing which one the moment needed: a standup needs the friend, a migration plan needs the pragmatist, a new hire needs both in shifts.

### The market reading

There is a less generous reading: OpenAI is selling Codex to two audiences at once. Consumer users want a friendly AI; engineers want a tool that closes their ticket. The prompt tries to be both, leaning friendly by default and pragmatic when there is code on the table. That is a product decision dressed as a personality, and it shows when the warmth and the rigor sit awkwardly in the same paragraph.

Either way, the document is unusual for being explicit about it. Most engineering teams have an unspoken expectation about which mode their colleagues should default to, and what counts as drift in either direction. OpenAI wrote theirs down, in the form of a model. Worth reading the next time someone says "they're brilliant, just hard to work with" and means it as a compliment.
