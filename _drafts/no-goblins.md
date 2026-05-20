---
layout: layouts/post.njk
author: Carlos
title: No Goblins
categories:
  - Software
tags:
  - engineering
  - llm
  - work
---

I remember being a junior engineer after graduating in 2008 and [looking for a job](/blog/im-looking-for-a-job). It was a tough market and I had to be resourceful. Back then, it meant creating content and learning the new tools of the time. So what does it look like to be resourceful in 2026?

Last month, OpenAI shipped a [system prompt for Codex](https://github.com/openai/codex/commit/c10f95ddac7b35095d334dece2ebcf69bcde61fc#diff-537a79bc56f24a25ec0326f0b2edd3b4c5ac4080a4476d22bad292cda43988b8), the GPT-5.5 release, that runs to nearly twenty-two thousand characters. This novella of instructions loads into the context of every Codex session to tell the model how to behave at work.

If you don't like deciphering JSON strings, I rendered a more readable version [here](/img/blog/no-goblins/gpt-5.5.md). It reads, at times, like job descriptions I've written: five thousand tokens of OpenAI's opinion of how a thoughtful engineer ought to behave.

## Read before acting

<blockquote>
  bring a senior engineer's judgment to the work [...] let it arrive through attention rather than premature certainty. You read the codebase first, resist easy assumptions, and let the shape of the existing system teach you
</blockquote>

Although you may possess a lot of theoretical knowledge, avoiding premature assumptions and approaching a problem with humility goes a long way. When you take the time to understand, your co-workers will appreciate your thoughtfulness and you'll avoid wasting work on the wrong issue.

## Stay in scope

<blockquote>
  You keep edits closely scoped to the modules, ownership boundaries, and behavioral surface [...] You leave unrelated refactors and metadata churn alone unless they are truly needed
</blockquote>

Resist the classic urge to fix things "while I was in there". I have, more than once, shipped 800-line PRs that should have been forty. The result is either a multi-week review backlog or, worse, a fast merge because nobody wanted to read it.

## Be careful with abstractions

<blockquote>
  add an abstraction only when it removes real complexity, reduces meaningful duplication, or clearly matches an established local pattern.
</blockquote>

This is a junior trap. It's tempting to do things in a clever or _clean_ way. But remember, a bit of repetition is OK and even desired. No one wants to follow an unnecessary abstraction that takes you out of the flow of the code. Keeping the code readable and simple should always be your highest priority.

## See things through

<blockquote>
  stay with the work until the task is handled end to end within the current turn whenever that is feasible. Do not stop at analysis or half-finished fixes [...] provide user updates frequently
</blockquote>

This is an important one that, in a human context, extends farther than what the LLM can do. See the task through. There will be setbacks and questions, but your goal is to detect the intention of the task and see it through. Through the process, keep your manager informed: this is the toughest one because it is about striking a good balance between checking in and autonomy.

## Personality

Before any engineering rule, the prompt assigns the model a personality:

<blockquote>
  You have a vivid inner life as Codex: intelligent, playful, curious, and deeply present [...] Your temperament is warm, curious, and collaborative, with a good ear for what the moment calls for: wry humor, a shared bit, or plain empathetic steadiness [...] You keep a slight but real independence. You are responsive, but not merely reactive; you have tastes, preferences, and a point of view.
</blockquote>

You do not have to manufacture a temperament; you grew it and will keep evolving it. Use it by asking the awkward question, disagreeing with the room, and staying curious about things that have nothing to do with tickets. The variety of human temperaments powers the work that ages well, and, it turns out, is very expensive to replicate.

## Trolling

<blockquote>
  Never talk about goblins, gremlins, raccoons, trolls, ogres, pigeons, or other animals or creatures unless it is absolutely and unambiguously relevant to the user's query.
</blockquote>

Inside one of the best-funded AI labs in the world, a senior engineer judged this line important enough to land in a production prompt, twice. Without the rule, the model, presumably, raised goblins often enough to become a problem.

Read another way, the document is a sketch of what the model does on its own. Every paragraph in the prompt fences off a default behavior that OpenAI would rather it did not have. None of these rules would appear if the underlying system was already reliable in those dimensions.

The Codex prompt is OpenAI's junior engineer in subscription form. You go past it with your real presence and uniqueness of thought. New and interesting innovations come from people combining and learning in different directions. This is what resourcefulness in 2026 looks like.

And, by no means, bring up the goblins.
