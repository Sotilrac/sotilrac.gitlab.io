---
layout: layouts/post.njk
author: Carlos
title: Why Do Your Diagrams Rot? It's Not Your Fault.
categories:
  - Info
tags:
  - engineering
  - communication
  - work
---

Twenty years ago, I learned about UML in college and thought diagrams were a solved problem: a standard, tools, a methodology, formal descriptions that generated images. The future had arrived. The future is still not here.

On every project I've worked on, from humanoid robotics at Aldebaran to wearable exoskeletons at Dephy, someone eventually asks "do you have a diagram of the system?" and the answer is always some version of "sort of, but it's out of date." Or worse: the diagram exists, it looks authoritative, and it's wrong.

## The Rot

The pattern repeats itself. You spend a day on a diagram for a new hire, a client visit, or your future self. You think about what to include, how to arrange it, what connects to what. You present it, people understand it, and then the system changes. RS-485 becomes RS-232 because you need full duplex, a firmware module gets refactored, a component gets swapped. The diagram doesn't change with it. It sits in Confluence, still authoritative, slowly becoming fiction.

This is diagram debt, and it compounds like technical debt. Unlike code, nothing tells you the diagram is broken: no failing test, no red squiggle, just a quiet lie that every reader absorbs.

Clarity makes the rot worse. A good diagram is almost a language: dotted lines mean wireless, red lines mean power, rounded boxes are processes, square boxes are hardware. Consistent visual grammar lets a reader derive meaning fast. Building that grammar takes intention, and keeping it honest as the system changes takes more intention still. Nobody has that time.

## The Self-Blame Is Misplaced

The common response is to blame yourself. On Reddit, engineers write things like "I dedicated a few days documenting a bunch of stuff a year ago; since then I haven't had the time, and quite a bit of that documentation is out of date." Enterprise architects prescribe "cadence and governance." One blog post suggests limiting the number of diagrams your team maintains, as if the answer to bad tools is to use them less.

The problem isn't laziness, disorganization, or process. The tools force an impossible choice, and you lose either way.

## Two Camps, One Gap

Diagramming splits into two non-overlapping camps.

The **correctness camp** is code-based: Graphviz, Mermaid, D2, PlantUML. You write structure in text, the tool renders an image. The output is deterministic, diffable, reviewable in a pull request, and tied to source. The tradeoff is that you surrender layout control. The engine decides where nodes go and how edges route, and it's opinionated: tiny changes to source can radically rearrange the whole picture. Users resort to invisible edges in Graphviz, hidden connections in PlantUML, and long-standing feature requests like D2's open ticket for port support, all to nudge the layout into place.

The **presentation camp** is interactive: draw.io, Lucidchart, Visio. You drag, draw, and position every element exactly. The diagram looks the way you designed it. The tradeoff is that it's an artifact, not a source of truth: you can't meaningfully diff it, review it, or merge concurrent edits. It's born disconnected from the system it describes, and only drifts further from there.

Correctness without clarity communicates nothing, it's noise. Clarity without correctness is worse, it's a confident lie that people act on. The engineer leading a system needs both, and neither camp serves them.

## Why the Gap Stays Open

Tool builders solve for their own users. Graphviz was built for researchers who need reproducible layouts in papers. Mermaid was built for developers embedding diagrams in markdown. Draw.io was built for business users making something for a Tuesday presentation. Documentation teams don't need interactivity, designers don't need git, and the engineer who needs both isn't a strong enough market signal.

A skeptic will object that diagrams should rot because systems evolve faster than docs, and keeping them in sync is ROI-negative. That's true for the diagrams we currently know how to make. It stops being true once the graph is generated from a source of truth and only the layout is human work: at that point, correctness is automatic and intention goes where intention matters.

## What the Missing Tool Looks Like

The shape of the answer is clear even if nobody's built it. The graph comes from code, so it stays honest with the system. The layout is intentional and human-designed, stored alongside the source and round-tripped back through a canvas. Changes to structure don't nuke the layout, changes to layout don't break the source. Correctness is automated; communication stays a human act.

The layout engines, the parsers, and the interactive canvas libraries all already exist. What's missing is the persistence model that lets layout survive graph edits and vice versa, and someone with enough reason to build it.

Stop blaming yourself for letting diagrams rot. Start asking why, twenty years in, the tools still make you pick between honest and legible.
