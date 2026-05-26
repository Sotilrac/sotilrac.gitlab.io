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

Across commencement stages this May, graduates have been [booing AI off the podium](https://www.axios.com/2026/05/19/college-graduates-ai-commencement-speech). Eric Schmidt got it loudest at the University of Arizona. The same scene played out wherever a speaker reached for the "next industrial revolution" speech. This makes a lot of sense given the current job climate.

I remember being a junior engineer after graduating in 2008 and [looking for a job](/blog/im-looking-for-a-job). It was a tough market and I had to be resourceful. Back then, it meant creating content and learning the new tools. So what does it look like to be resourceful in 2026?

Some of it feels the same. Hiring has [slowed to levels last seen in 2010](https://insights.som.yale.edu/insights/the-real-job-destruction-from-ai-is-hitting-before-careers-can-start), [unemployment for recent grads is running roughly twice the general rate](https://www.clevelandfed.org/publications/economic-commentary/2025/ec-202514-are-young-college-graduates-losing-their-edge-in-the-job-market), and connections still matter more than they should. The instinct to make yourself visible is the same one I had then, and it works again.

In 2008 the whole economy collapsed and the cure was waiting for it to come back. In 2026 the economy is _fine_?. General unemployment sits near historic lows. The pain is concentrated on the new cohorts. Companies have figured out that AI tools can cover the grunt work that used to onboard juniors, so they sawed the bottom rung off the training ladder. [Junior-developer postings are down about forty percent](https://stackoverflow.blog/2025/12/26/ai-vs-gen-z/) from their pre-2022 baseline, [employment for software developers aged 22 to 25 is down roughly twenty percent](https://insights.som.yale.edu/insights/the-real-job-destruction-from-ai-is-hitting-before-careers-can-start) since late 2022, and the tech sector [has shed close to half a million workers](https://layoffs.fyi/) over the same window. Most of those cuts spared the seniors who already know the ropes.

An LLM is a calculator for words: It accelerates work you already know how to evaluate, and cannot do quality work you do not understand. What it brings is leverage; engineers bring the judgment about where to apply it.

As always, in dire situations, I turn to Open Source Software for answers. As it turns out, last month, OpenAI shipped a [system prompt for Codex](https://github.com/openai/codex/commit/c10f95ddac7b35095d334dece2ebcf69bcde61fc#diff-537a79bc56f24a25ec0326f0b2edd3b4c5ac4080a4476d22bad292cda43988b8), the GPT-5.5 release, that runs to nearly twenty-two thousand characters. This novella of instructions, written line by line by humans at OpenAI, loads into the context of every Codex session to tell the model how to behave at work.

If you don't like deciphering JSON strings, I rendered a more readable version [here](/img/blog/no-goblins/gpt-5.5.md). The five thousand tokens worth of OpenAI's opinion of how a thoughtful engineer ought to behave reads at times like a job description I've written.

## Read before acting

<blockquote>
  bring a senior engineer's judgment to the work [...] let it arrive through attention rather than premature certainty. You read the codebase first, resist easy assumptions, and let the shape of the existing system teach you
</blockquote>

Although you have theoretical knowledge, avoiding premature assumptions and approaching a problem with humility goes a long way. When you take the time to understand, your co-workers will appreciate your thoughtfulness and you'll avoid wasting work on the wrong issue.

The most interesting line in this passage is _let the shape of the existing system teach you_. A codebase is a record of decisions other engineers made under pressure you do not yet see. Reading carefully is how you listen to the colleagues who came before, including the ones who have left. Skipping that reading risks more than being wrong. It tells everyone else their work did not matter.

## Stay in scope

<blockquote>
  You keep edits closely scoped to the modules, ownership boundaries, and behavioral surface [...] You leave unrelated refactors and metadata churn alone unless they are truly needed
</blockquote>

Resist the classic urge to fix things "while I was in there". I have, more than once, shipped 800-line PRs that should have been forty. The result is either a multi-week review backlog or, worse, a fast merge because nobody wanted to read it.

Scope is a contract with your reviewers. When the PR sprawls, you trade their attention for your convenience. Tight scope is also a form of documentation: it tells the next reader what the goal of the change was. The "while I was in there" instinct is individualist by default; the team move is to open a ticket and let the right person take it.

## Be careful with abstractions

<blockquote>
  add an abstraction only when it removes real complexity, reduces meaningful duplication, or clearly matches an established local pattern.
</blockquote>

This is a junior trap. It's tempting to do things in a clever or _clean_ way. A bit of repetition is fine. No one wants to follow an abstraction that interrupts the flow of the code. Keep the code readable and simple.

Every abstraction is a decision your teammates will have to live with, and the author almost never pays the maintenance tax on it. The senior move is to write for the next reader's benefit. Premature abstraction is a small egocentrism: your aesthetic preference, charged to everyone else's attention budget.

## See things through

<blockquote>
  stay with the work until the task is handled end to end within the current turn whenever that is feasible. Do not stop at analysis or half-finished fixes [...] provide user updates frequently
</blockquote>

This rule reaches farthest beyond what an LLM can do. See the task through. There will be setbacks and questions; read the intent and deliver. Keep your manager informed: striking a balance between checking in and autonomy is the hard part.

Easy tasks reveal nothing about you. The test is the work that gets ugly halfway through, when you have a choice between escalating, abandoning, or pushing through. Reliability is the habit of closing loops; communication is the multiplier on competence. Your manager is tracking a dozen other threads, and if yours is going to slip, they want to know in time to adjust.

## Personality

Before any engineering rule, the prompt assigns the model a personality:

<blockquote>
  You have a vivid inner life as Codex: intelligent, playful, curious, and deeply present [...] Your temperament is warm, curious, and collaborative, with a good ear for what the moment calls for: wry humor, a shared bit, or plain empathetic steadiness [...] You keep a slight but real independence. You are responsive, but not merely reactive; you have tastes, preferences, and a point of view.
</blockquote>

You do not have to manufacture a temperament; you grew it and will keep evolving it. Use it by asking the awkward question, disagreeing with the room, and staying curious about things that have nothing to do with tickets. The variety of human temperaments powers the work that ages well, and, it turns out, is expensive to replicate.

Teams thrive on disagreement. The person who notices something off when everyone else is nodding, who pushes on the awkward edge case, who asks _why are we doing it this way?_ in a tone that does not sound rhetorical: that person is how teams catch the failure mode that does not show up in the test suite. Codex is being instructed at length to imitate that variance; you bring it for free.

## Trolling

<blockquote>
  Never talk about goblins, gremlins, raccoons, trolls, ogres, pigeons, or other animals or creatures unless it is absolutely and unambiguously relevant to the user's query.
</blockquote>

Inside one of the best-funded AI labs, a senior engineer judged this line important enough to include in a production prompt. Without it, the model, presumably, raised goblins often enough to become a problem.

Read another way, the document is a sketch of what the model does on its own. Every paragraph in the prompt fences off a default behavior that OpenAI would rather it did not have.

Every correction in this prompt is also a small act of mentorship: a senior engineer noticed a pattern and wrote it down. The catch is that the model never internalizes the correction; the rule has to be re-applied every session, in every context, forever. A junior who gets the same correction once tends to remember. That difference compounds over a career, and no system prompt can purchase it.

## Resourcefulness in 2026

The Codex prompt is OpenAI's junior engineer in subscription form. As a junior engineer, go past it with your real presence and uniqueness of thought. New and interesting innovations come from people combining and learning in different directions. Your growth and understanding of the business reality of the company is what gives you an edge.

## For those hiring

If you are on the other side of the table, the math is grim. You are not getting another generation of engineers unless you hire one, but it is a hard sell since you can opt to augment your current workforce with LLMs.

If you can afford it, hire for judgment, follow-through, and a unique personality. This is how you build a resilient team, capable of innovating and staying nimble in the face of change.

And, by no means, bring up the goblins.

<!--
This is becomine more about thougs on AI and how to work effectively with it. from the junior perspective, from the company perspective and from the senior perspective.

AI for programming feels a bit like cad or spreadsheets. its a calculator for words, noone would do hard drfting today, becuase cad is much mor precise, modifiable, reproducible, sharable, Noone would do spreadsheets bu hand. in eitehr case a hand made dimensional drawing or spreadsheets is a liability, the ability to have these tools rigorously output correct figures is crucial and innexpensive. If you do it by hands, you're fired at best.

Similarly, LLMS make you faster at the things you;re already an expert at. If you never multiplied and make multimiplations in excell, you are not going to have a clue if the output is correct.

Similarly with llms, they excell when you have the hability to guide and correct the output.

(this is especially true for visual things)

On the otehr hands LLMs produce a lot of outputs and the tooling has minimal guardrails. The rigor and correctness of cad, although possible to achieve, is not present in the llms output. perhaps this is what some ofthese prompts are atemoting to do.

As with juniors, LLMs benefit from having test suites, definions of done, and quality and coding standards.

perhaps like design evlving into computer-aided design, programming will evolve into computer-aided programming. i just hope it;s not all CAP.

On open source: LLMs are amazing at python and web (html,css,js,ts). This is no coincidence, all web pages are essentialy open source, so LLMs had the entire internet worh of data to learn from. Similarly, Python is famously used by academia and profusely by OSS enthousiats.

I don't think we have a good mental model right now of how to think abouot LLMs and predirt our future. However, if the past is of any refeence we need to:

no silver bullet:
* keep using open source
* keep creating and putting things out there par amour a l'art
* keep learning as much as possible
 -->
