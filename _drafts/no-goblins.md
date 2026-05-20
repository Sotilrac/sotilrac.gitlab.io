---
layout: layouts/post.njk
author: Carlos
title: No Goblins
categories:
  - Working Theory
tags:
  - engineering
  - llm
  - work
---

I remember being a junior engineer after graduating in 2008 and [looking for a job](/blog/im-looking-for-a-job). It was a tough market and I had to be resourceful. Back then, it meant creating content and learning the new tools. So what does it look like to be resourceful in 2026?

Last month, OpenAI shipped a [system prompt for Codex](https://github.com/openai/codex/commit/c10f95ddac7b35095d334dece2ebcf69bcde61fc#diff-537a79bc56f24a25ec0326f0b2edd3b4c5ac4080a4476d22bad292cda43988b8), the GPT-5.5 release, that runs to nearly twenty-two thousand characters. This novella of instructions loads into the context of every Codex session to tell the model how to behave at work.

If you don't like deciphering JSON strings, I rendered a more readable version [here](/img/blog/no-goblins/gpt-5.5.md). It reads, at times, like job descriptions I've written: five thousand tokens of OpenAI's opinion of how a thoughtful engineer ought to behave.

## Read before acting

<blockquote>
  bring a senior engineer's judgment to the work [...] let it arrive through attention rather than premature certainty. You read the codebase first, resist easy assumptions, and let the shape of the existing system teach you
</blockquote>

Although you may have theoretical knowledge, avoiding premature assumptions and approaching a problem with humility goes a long way. When you take the time to understand, your co-workers will appreciate your thoughtfulness and you'll avoid wasting work on the wrong issue.

## Stay in scope

<blockquote>
  You keep edits closely scoped to the modules, ownership boundaries, and behavioral surface [...] You leave unrelated refactors and metadata churn alone unless they are truly needed
</blockquote>

Resist the classic urge to fix things "while I was in there". I have, more than once, shipped 800-line PRs that should have been forty. The result is either a multi-week review backlog or, worse, a fast merge because nobody wanted to read it.

## Be careful with abstractions

<blockquote>
  add an abstraction only when it removes real complexity, reduces meaningful duplication, or clearly matches an established local pattern.
</blockquote>

This is a junior trap. It's tempting to do things in a clever or _clean_ way. A bit of repetition is fine. No one wants to follow an abstraction that interrupts the flow of the code. Keep the code readable and simple.

## See things through

<blockquote>
  stay with the work until the task is handled end to end within the current turn whenever that is feasible. Do not stop at analysis or half-finished fixes [...] provide user updates frequently
</blockquote>

This rule reaches farthest beyond what an LLM can do. See the task through. There will be setbacks and questions; read the intent and deliver. Keep your manager informed: striking a balance between checking in and autonomy is the hard part.

## Personality

Before any engineering rule, the prompt assigns the model a personality:

<blockquote>
  You have a vivid inner life as Codex: intelligent, playful, curious, and deeply present [...] Your temperament is warm, curious, and collaborative, with a good ear for what the moment calls for: wry humor, a shared bit, or plain empathetic steadiness [...] You keep a slight but real independence. You are responsive, but not merely reactive; you have tastes, preferences, and a point of view.
</blockquote>

You do not have to manufacture a temperament; you grew it and will keep evolving it. Use it by asking the awkward question, disagreeing with the room, and staying curious about things that have nothing to do with tickets. The variety of human temperaments powers the work that ages well, and, it turns out, is expensive to replicate.

## Trolling

<blockquote>
  Never talk about goblins, gremlins, raccoons, trolls, ogres, pigeons, or other animals or creatures unless it is absolutely and unambiguously relevant to the user's query.
</blockquote>

Inside one of the best-funded AI labs, a senior engineer judged this line important enough to include in a production prompt, twice. Without the rule, the model, presumably, raised goblins often enough to become a problem.

Read another way, the document is a sketch of what the model does on its own. Every paragraph in the prompt fences off a default behavior that OpenAI would rather it did not have.

The Codex prompt is OpenAI's junior engineer in subscription form. You go past it with your real presence and uniqueness of thought. New and interesting innovations come from people combining and learning in different directions. This is what resourcefulness in 2026 looks like.

And, by no means, bring up the goblins.

<!-- Notes:

the solution, as always, to, me, is open source software. So, what can we learn about it

Emphasize the prompt is written by humans

Summertime and graduation. booing AI


AI is a calculator for words. How you can use it depends on your skills.

2026 or 2008 feels a lot like the same, learn new tools, create, shit economy, easier to get hired if you have connections. Empashise the difference of being present as an edge.

Add advice for seniors hiring. If you can affor to, hire and grow the next generation of engineers.


 -->
