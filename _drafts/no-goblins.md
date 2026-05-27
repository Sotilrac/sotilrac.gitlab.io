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

## A calculator for words

A large language model is a calculator for words. It speeds up work you already know how to evaluate, and it cannot do quality work you do not understand. The tool brings speed; you bring the judgment.

We have built tools like this before. Engineering drafting used to be done by hand on paper, and a generation of draftsmen earned their keep drawing dimensioned views in pencil with steady hands. No engineer drafts by hand today. CAD is more precise, more reproducible, easier to share, and easier to change. A hand-drawn dimensioned view is now a liability: slower to make, harder to revise, impossible to version. Spreadsheets did the same thing to arithmetic. Nobody runs the payroll on paper anymore, and if you tried, you would be fired before you got to row twelve.

The pattern is consistent: the tool amplifies the person who already knows what the answer should look like, and it ruins the person who does not. The first time you used a spreadsheet to sum a column, you could still check the total in your head. The hundredth time, you trusted the cell. If you had never multiplied two numbers by hand, you would not catch the day a stray decimal turned a six-figure forecast into a seven-figure one.

LLMs sit in the same lineage. They make experts faster at things they already understand, and they leave novices with output they cannot evaluate. (This is true twice over for visual work, where the tool fluently produces things that look right and are not.) The gains are real, and so is the cliff.

One side note worth holding onto: LLMs are best, by a long way, at Python and at web work. This is no accident. The web is open by default; every page ships its own source. Python has been the lingua franca of academia and open source for two decades. The training corpus for those stacks is, effectively, everything anyone ever wrote. For everything else, the model is working from whatever happened to leak out. The competence of the tool is shaped by what people gave away.

## Without the rigor

CAD has rigor built into the tool. Geometry that does not close raises a warning. Dimensions that contradict each other raise a warning. A spreadsheet that divides by zero tells you. The tool, by construction, refuses to silently emit wrong output for a wide class of mistakes.

LLMs do not work like this. They produce a great deal of plausible output, quickly, with minimal guardrails. The output is fluent whether or not it is correct. Ship what the model gives you without review, and you ship whatever was statistically likely, which is a different thing from what was right.

As I often do in dire situations, I turned to open source for answers. As it turns out, last month, OpenAI shipped a [system prompt for Codex](https://github.com/openai/codex/commit/c10f95ddac7b35095d334dece2ebcf69bcde61fc#diff-537a79bc56f24a25ec0326f0b2edd3b4c5ac4080a4476d22bad292cda43988b8), its GPT-5.5 release, that runs to nearly twenty-two thousand characters. This novella of instructions, written line by line by humans at OpenAI, loads into the context of every Codex session to tell the model how to behave at work. Read one way, it is an attempt to bolt rigor onto the tool from the outside, in plain English.

If you don't like deciphering JSON strings, I rendered a more readable version [here](/img/blog/no-goblins/gpt-5.5.md). The five thousand tokens worth of OpenAI's opinion of how a thoughtful engineer ought to behave reads, at times, like a job description I've written.

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

## A junior who never internalizes

The four rules above read as senior wisdom. Read another way, the prompt is a sketch of what the model does on its own, and every paragraph fences off a default behaviour OpenAI would rather it did not have.

This is the same maintenance work seniors already do for juniors. Teams write a definition of done, build out the test suite, and write down coding standards, because the work has to be legible to people who do not yet have the context to invent the right standard on the fly. LLMs benefit from the same scaffolding, for the same reason: the output is only as good as what the tool has been told to optimise for.

The catch is the asymmetry. A junior who gets the same correction once tends to remember it; the rule moves from the team's documents into their judgment. A model never internalizes the correction: the rule has to be re-applied every session, in every context, forever. That difference compounds across a career, and no system prompt can purchase it.

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

Inside one of the best-funded AI labs, a senior engineer judged this line important enough to include in a production prompt. Without it, the model, presumably, raised goblins often enough to become a problem. Whatever the corpus was that taught the model its taste in fauna, somebody had to write the rule in plain English to make it stop.

The goblin line is the whole document in miniature: every paragraph fences off something the model does on its own, and this is just the funniest example.

## Three desks

As a junior, the math is grim and the move is the same as it was in 2008: be visible, be useful, follow through. The Codex prompt is OpenAI's idea of what your junior year used to look like, except it is one model running in subscription form on every team that can pay for it. The way past it is real presence and uniqueness of thought, the things the prompt is trying to manufacture and the things you have for free. New and interesting work tends to come from people combining and learning in directions nobody wrote a system prompt for. Your growth, and your grasp of the business reality of the company, is what gives you the edge.

As a senior, the work that used to be optional is now the price of entry. Definition of done, test scaffolding, coding standards, code review with teeth: this is the work that makes a piece of code legible to a junior, a stranger, or a model, and the model raises the cost of skipping any of it. The Codex prompt is OpenAI doing this work for their own model in their own product; the equivalent on your team is the repository's READMEs, the CONTRIBUTING file, the test conventions, and the standards you enforce in review. Build the scaffolding once, and you spend the rest of your career applying it; skip it, and you spend the rest of your career re-explaining the same thing.

As a hiring manager, the math is also grim. You are not getting another generation of engineers unless you hire one, and it is a hard sell when you can augment your current workforce with LLMs instead. If you can afford it, hire for judgment, follow-through, and a unique personality. That is how you build a resilient team, capable of innovating and staying nimble when the next wave of tools arrives.

## No silver bullet

There is no silver bullet here. The honest advice for a junior engineer in 2026 is the same advice that worked in 2008, with the volume turned up: keep using open source, because the corpus that built the tools was given away and it has to keep being given away to stay alive; keep creating things _par amour de l'art_, because the work that ages well rarely started as a deliverable; keep learning, because the only edge that compounds is what you carry in your own head.

And, by no means, bring up the goblins.
