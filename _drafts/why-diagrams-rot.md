---
layout: layouts/post.njk
author: Carlos
title: Why Do Your Diagrams Rot?
categories:
  - Info
tags:
  - engineering
  - communication
  - work
---

Twenty years ago, I learned about UML in college and thought diagrams were a solved problem: a standard, tools, a methodology, formal descriptions that generated images. The future had arrived! Sadly, the future is still not here.

On every large project I've worked on, from humanoid robots at Aldebaran to wearable exoskeletons at Dephy, someone eventually asks "do you have a diagram of the system?" and the answer is always some version of "sort of, but it's out of date." Or worse: they find the diagram on their own, it looks authoritative, and it's wrong.

## The Rotting Pattern

You spend a day on a diagram for a new hire, a client visit, or your future self. You decide what to include, how to arrange it, what connects to what. You present it, people understand it, and then the system changes. RS-232 becomes RS-485 because noise is an issue, a firmware module gets refactored, a component gets swapped, or a new requirement is discovered. The diagram doesn't change with it. It sits in Confluence, still authoritative, every day becoming more fictional.

This diagram debt (a part of a broader documentation debt) compounds like technical debt. Unlike code, nothing tells you the diagram is broken: no failing test, no red squiggle, just a lie in waiting.

Striving for clarity makes the rot worse. A good diagram is almost a language: dotted lines mean wireless, red lines mean power, rounded boxes are processes, square boxes are hardware. A consistent visual grammar lets a reader derive meaning fast. Building that grammar takes intention, and keeping it honest as the system changes takes even more intention. Nobody has that time.

{% fig "/img/blog/why-diagrams-rot/aint-nobody-got-time-for-that.gif", "Ain't nobody got time for that!" %}

It's common to blame yourself. A [Reddit thread](https://www.reddit.com/r/devops/comments/1neyjf1/why_people_dont_document_honest_answers_only/) titled "Why people don't document, honest answers only" reads in exactly that register: "I tried at first, really. But after a year in this I just don't care any more." The published prescriptions don't fare much better. A [Substack architect](https://livinginsoftware.substack.com/p/why-are-architecture-diagrams-never) prescribes organizational priority: "if the architecture diagram will help solve important questions which have to do with compliance, regulators and strategic direction, then it needs to be maintained." A [dev.to piece](https://dev.to/erajasekar/the-real-reason-architecture-diagrams-go-stale-35ok) gets the diagnosis right, "the artifact is too expensive to keep close to reality," and prescribes sketching during the decision rather than after. That's closer, but it's still only the correctness half.

The problem isn't laziness, disorganization, or process. The tools force an impossible choice, and you lose either way.

## Honest or Legible

Diagramming splits into two non-overlapping camps.

The **correctness camp** is code-based: Graphviz, Mermaid, D2, PlantUML. You write structure in text, the tool renders an image. The output is deterministic, diffable, reviewable in a pull request, and tied to source. The tradeoff is that you surrender layout control. The engine decides where nodes go and how edges route, and it's opinionated: tiny changes to source can radically rearrange the whole picture. Users resort to invisible edges in Graphviz, hidden connections in PlantUML, and long-standing feature requests like D2's [open](https://github.com/terrastruct/d2/issues/2197) [ticket](https://github.com/terrastruct/d2/issues/2379) for port support, all to nudge the layout into place.

The **presentation camp** is interactive: draw.io, Lucidchart, Visio. You drag, draw, and position every element exactly. The diagram looks the way you designed it. The tradeoff is that it's an artifact, not a source of truth: you can't meaningfully diff it, review it, or merge concurrent edits. It's born disconnected from the system it describes, and only drifts further from there.

Correctness without clarity communicates nothing, it's noise. Clarity without correctness is worse, it's a confident lie. The engineer leading a system needs both, and gets neither.

## Why the Gap Stays Open

Tool builders solve for their own users. Graphviz was built for researchers who need reproducible layouts in papers. Mermaid was built for developers embedding diagrams in markdown. Draw.io was built for business users making something for a Tuesday presentation. Documentation teams don't need interactivity, designers don't need git, and the engineer who needs both isn't a strong enough market signal.

A skeptic will object that diagrams should rot because systems evolve faster than docs, and keeping them in sync is ROI-negative. That's true for the diagrams we currently know how to make. It stops being true once the graph is generated from a source of truth and only the layout is human work: at that point, correctness is automatic and intention goes where intention matters.

## What's Missing

{% fig "/img/blog/why-diagrams-rot/por-que-no-los-dos.gif", "¿Por qué no los dos?" %}

The answer is clear even though nobody's built it. On one hand, the graph's structure comes from code, is semantically styled, and is easy to keep up-to-date with the system. On the other, the layout is intentional and human-designed, stored alongside the source. Changes to the structure don't destroy the entire layout; changes to the layout can't disagree with the source. Correctness is automated, and communication is designed.

The layout engines, parsers, routers, and interactive canvas libraries all already exist. What is missing is the persistence model that lets the layout survive graph edits, and, most importantly, someone with enough reason to build it.

## WWDD? (What Would Daedalus Do?)

It turns out there _is_ someone motivated enough to solve this problem. I called the solution [Daedalus](https://gitlab.com/sotilrac/daedalus)!

It uses D2 as the source of truth and ELK for the initial layout pass. From there, you modify the layout by dragging and dropping nodes, scaling them, and assigning connections per side. The edges get autorouted to avoid collisions, and everything saves to a `.daedalus.json` file next to the source.

Saving changes to the D2 file automatically refreshes the diagram but keeps your layout intact. New nodes appear in available spaces for you to place.

{% compare "/img/blog/why-diagrams-rot/daedalus_diagram_light.png", "/img/blog/why-diagrams-rot/daedalus_diagram_dark.png", "Editing in Daedalus (Light vs Dark)" %}

Edges are the part most tools punt on, so they got the most work. Routing is orthogonal via libavoid (the same engine Inkscape uses), every node side holds an ordered list of edge slots that you can drag endpoints between, and labels land on a backing pill at the route's midpoint so they read on dense boards. The layout can be exported to SVG or PNG.

It's a Tauri desktop app, MPL-2.0-licensed, and runs against a folder of `.d2` files. If the friction in this post is yours too, [download a release](https://github.com/Sotilrac/daedalus/releases/) and give it a try.

{% compare "/img/blog/why-diagrams-rot/example_ELK.png", "/img/blog/why-diagrams-rot/example.png", "ELK v.s. Daedalus" %}
