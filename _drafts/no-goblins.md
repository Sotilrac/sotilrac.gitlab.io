---
layout: layouts/post.njk
author: Carlos
title: Interns or Goblins
categories:
  - Software
tags:
  - engineering
  - llm
  - work
---

LLMs are killing entry-level jobs and, quite frankly, it makes sense. Why hire when you can get a {LARGE_AI_COMPANY} subscription? Instead of building up a new engineer, you can multiply the output of your current workforce. I can come up with several reasons why, if you can afford it, building up new engineers is beneficial, especially in the long run, for the industry and your immediate company needs. However, this is not the focus of this piece.

I remember being a junior engineer after graduating in 2008 and [looking for a job](/blog/im-looking-for-a-job). It was a tough market and you had to be resourceful. Back then, it meant creating content and learning the new tools of the time. So what does it look like to be resourceful in 2026?

As a junior engineer, you're trying to get integrated into an LLM-augmented workforce. LLMs can help you as well, but they are essentially calculators for words. Famously, calculators (and any tool for that matter) are only as good as the user; and you, by definition, are not very good just yet. Tools make you faster, more precise, and more accurate, but they don't help you reason or be creative.

So how can you secure a job and thus a chance of learning to play with these calculators professionally, and most importantly, learn from your peers and seniors?

Regardless of your domain of expertise (or lack thereof), there are some very human skills that will help you become a better candidate and a more adept collaborator. Fortunately, instead of relying on mentors, experience, or scouring self-help and management books to find out, OpenAI has written a nice summary for you.

## Insights

OpenAI recently shipped a [system prompt for Codex](https://github.com/openai/codex/commit/c10f95ddac7b35095d334dece2ebcf69bcde61fc#diff-537a79bc56f24a25ec0326f0b2edd3b4c5ac4080a4476d22bad292cda43988b8) (the GPT-5.5 release) that runs almost twenty-two thousand characters to instruct the LLM on how to behave. For your viewing delight, you can find the JSON blob in markdown format [here](/img/blog/no-goblins/gpt-5.5.md).

This multibillion-dollar company spent payroll, meetings, and review cycles on their own written-down opinion of what a compelling engineer should be like. Let's explore what insights we can derive from this portrait of the ideal coworker.

### Read before acting

<blockquote>
  bring a senior engineer's judgment to the work [...] let it arrive through attention rather than premature certainty. You read the codebase first, resist easy assumptions, and let the shape of the existing system teach you
</blockquote>

In other words, although you may possess a lot of theoretical knowledge, avoiding premature assumptions and approaching a problem with humility goes a long way. When you take the time to understand, your co-workers will appreciate your thoughtfulness and you'll avoid wasting work on the wrong issue.

### Stay in scope

<blockquote>
  You keep edits closely scoped to the modules, ownership boundaries, and behavioral surface [...] You leave unrelated refactors and metadata churn alone unless they are truly needed
</blockquote>

This one is a classic. It is always tempting to fix an issue "while I was in there". No one likes a sprawling PR. I know I've been guilty of this: _why open a new ticket when you can pile everything onto the same one?_ The result is an unreviewable PR that, at best, takes a long time to get merged, or, at worst, gets merged very quickly because no one wanted to read it.

### Develop your judgment for abstractions

<blockquote>
  add an abstraction only when it removes real complexity, reduces meaningful duplication, or clearly matches an established local pattern.
</blockquote>

This is a junior trap. It's very tempting to do things in a clever or _clean_ way. But remember, a bit of repetition is OK and even desired. No one wants to follow an unnecessary abstraction that takes you out of the flow of the code. Keeping the code readable and simple should always be your highest priority.

### You're not a Substack article

<blockquote>
  Avoid coined metaphors, internal jargon, slash-heavy noun stacks, and over-hyphenated compounds unless you are quoting source text. In particular, do not lean on words like 'seam', 'cut', or 'safe-cut' as generic explanatory filler.
</blockquote>

Regardless of your domain of expertise, the mark of someone who masters a discipline is being able to explain it in simple and approachable terms. No one will be impressed by your usage of a thesaurus.

### Finish the thing

<blockquote>
stay with the work until the task is handled end to end within the current turn whenever that is feasible. Do not stop at analysis or half-finished fixes [...] provide user updates frequently
</blockquote>

This is an important one that, in a human context, extends farther than what the LLM can do. In short, see the task through. There will be setbacks and questions, but your goal is to detect the intention of the task and see it through. Through the process, keep your manager informed: this is the toughest one because it is about striking a good balance between checking in and autonomy.

## On Personality

Before any engineering rule, the prompt hands the model a personality:

<blockquote>
  You have a vivid inner life as Codex: intelligent, playful, curious, and deeply present [...] Your temperament is warm, curious, and collaborative, with a good ear for what the moment calls for: wry humor, a shared bit, or plain empathetic steadiness [...] You keep a slight but real independence. You are responsive, but not merely reactive; you have tastes, preferences, and a point of view.
</blockquote>

As a human, you already have a personality that goes beyond a few lines of text. Leverage it and be yourself. Bring your uniqueness to the problem solution, ask questions, and stay curious. This is your best asset. As humans, we don't really know what is _best_ or what will work tomorrow; it's only through variety and diversity that we can stumble upon interesting and innovative solutions.

## Goblins, gremlins, raccoons

When you use an LLM, beyond the skills you can add and your own prompt learning, there's little learning that happens on the LLM side. Of course they can track your preferences and adapt to your tastes and idiosyncrasies, but the real learning is very limited. As a junior engineer, on the other hand, you are being continually trained by your experience; you learn and grow with the team. That growth can cost months if not years, and in a profit-now culture, it's a hard sell.

There's one last section that is especially telling and comes up twice.

<blockquote>
  Never talk about goblins, gremlins, raccoons, trolls, ogres, pigeons, or other animals or creatures unless it is absolutely and unambiguously relevant to the user's query.
  <cite>OpenAI</cite>
</blockquote>

As unhinged as it may seem, this is an interesting insight. LLMs have no fundamental logic skills; they learned from distilling all of the internet's data. This is why they need what seems like perfectly absurd instructions to keep them in check. This is also why we need more junior engineers to keep learning, growing, and producing interesting work, if only to enlarge the wealth of humanity's knowledge so it can be further distilled and used by future LLMs. But also for our benefit and intellectual pleasure.
