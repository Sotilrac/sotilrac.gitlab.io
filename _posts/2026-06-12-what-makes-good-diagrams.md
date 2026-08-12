---
layout: layouts/post.njk
author: Carlos
title: What Makes Good Diagrams?
categories:
  - Software
tags:
  - engineering
  - communication
  - work
date: 2026-06-12T12:00:00-04:00
---

Twenty years ago I learned about UML and its promise of well organized information and software architectures. Back in college, I assumed tools existed to draw this mythical UML. They do; they are abysmal.

Good diagrams are hard to come by, especially in engineering. Some concepts and systems live better in graphical form, and drawing them well is an art. Drawing a _pretty_ diagram that is inaccurate or incomplete takes far less effort. Inaccurate here can mean misleading, but I am not covering deceptive diagrams, only the ones drawn in good faith with too little skill or the wrong tool.

Am I being opinionated about these tools? Absolutely, and with good reason: I drew diagrams for every robotic system I designed and worked on. Were they good diagrams, you may ask? They tried to be for some time, and eventually failed.

So I developed some rules, and ultimately a tool, to make diagramming manageable and pleasant.

## What Good Diagrams Do

A good diagram speaks a visual language, and it holds that language consistent (e.g. dotted lines mean wireless, rounded boxes are processes). A consistent visual grammar lets the viewer internalize the information quickly.

Good diagrams also flow, and they hold up at a reasonable scale, ideally fitting on one screen or one large printout with fonts that stay readable even when you take in the whole thing at once.

Beyond consistency and readability comes accuracy: the diagram has to faithfully represent the reality it describes. Abstractions and simplifications are fine, provided they are intentional and stated.

Accuracy also decays, so the diagram should be up to date, or failing that, dated to when it was.

## What Makes It Hard

Diagramming tools fall into two camps: WYSIWYG point-and-click, and code-based.

### What You Saw Is What You Get

I have yet to find a point-and-click tool I like. Visio back in the day, then Lucidchart and draw.io: all of them non-free, artificially limited, or locking you into their format. A few FOSS ones exist, and they disappoint the same way.

Take block diagrams: applying a style across a set of edges or boxes fights you at every step. Some tools support styles (a la CSS), but they bury them in menus behind a pile of caveats (yes Lucidchart, I'm talking about you!). You align mostly by hand, the grid treats edges differently from boxes, text styling flunks the same way, and no tool bothers with a spell checker. Don't get me started on labeling edges, or god forbid keeping two boxes connected as you drag them around without spawning a spaghetti mess.

These tools do let you decide the general layout, and with enough hours and a bit of carpal tunnel you can draw a decent diagram. But what if the company color turns green instead of orange, or someone adds a subsystem? More hours and carpal tunnel await.

{% fig "/img/blog/what-makes-good-diagrams/aint-nobody-got-time-for-that.gif", "Ain't nobody got time for that!" %}

These diagrams resist maintenance, and they are impossible to collaborate on even when the tool claims otherwise. They go stale fast, and deceive without meaning to.

Call it diagram debt: part of a broader documentation debt, and it compounds like technical debt, except without failing test.

### Code-Based

The other camp writes code and renders it as a diagram, which sounds like a great idea: consistent styles, automation, spell and syntax checks, linting, syntax highlighting, and best of all, version control and diffs.

Mermaid excited me when I first found it, and later D2 (for consistent styling of edges as well). Then the automatic layout renders, and every one of those advantages evaporates. If the layout gods rule against you, no amount of tricking the parser will produce the layout you need, and in the rare case where you can massage the code into a passable layout, the code stops being readable: it becomes a hacky, confusing mess.

No wonder these tools are used in automated code documentation, where determinism and rough readability are the whole requirement (Graphviz and PlantUML come to mind).

## Are People Just Dumb?

{% fig "/img/blog/what-makes-good-diagrams/yes_but_no.gif", "Well yes, but actually no" %}

Blaming yourself comes easy, and I certainly do: maybe if I mastered the tools, or learned some obscure syntactic incantation, I could get the diagram I want, and get it fast. But plenty of other engineers sit in the same rut.

On a [Reddit thread](https://www.reddit.com/r/devops/comments/1neyjf1/why_people_dont_document_honest_answers_only/) about documenting system architectures, one answer concludes: "I tried at first, really. But after a year in this I just don't care any more." One [Substack architect](https://livinginsoftware.substack.com/p/why-are-architecture-diagrams-never) recommends triage instead, given the cost of maintenance: "if the architecture diagram will help solve important questions which have to do with compliance, regulators and strategic direction, then it needs to be maintained." And a [dev.to piece](https://dev.to/erajasekar/the-real-reason-architecture-diagrams-go-stale-35ok) names the problem outright: "the artifact is too expensive to keep close to reality."

The current tools force an impossible choice: (noisy) correctness or visual appeal (that will devolve into a confident lie).

## Why Is This Still a Problem in 2026?

Tool builders solve for their own users. Graphviz serves researchers who need reproducible layouts in papers, Mermaid serves developers embedding diagrams in markdown, and draw.io serves business users assembling something for a Tuesday presentation. Documentation teams don't need interactivity, designers don't need git, and then there's me, the robotics systems engineer, apparently not a large enough market.

So the accepted state of the art is a PNG in a Google Drive folder roting away for many years to come.

## What Would Solve It

{% fig "/img/blog/what-makes-good-diagrams/por-que-no-los-dos.gif", "¿Por qué no los dos?" %}

What if both camps got fused? Code defines the graph's structure and styles it semantically, so it tracks the system as the system changes, while you place the layout by hand, on purpose. Editing the structure leaves the layout alone; editing the layout cannot contradict the source. The machine handles correctness, and you design the communication.

Layout engines, parsers, routers, and interactive canvas libraries already exist. What's missing is a persistence model that lets the layout survive graph edits, and someone with reason enough to build it.

## Daedalus

So I built it. [Daedalus](https://gitlab.com/sotilrac/daedalus) takes D2 as the source of truth and ELK for the first layout pass. D2 specifically, because it reads as easily as Mermaid and adds classes that apply to edges, which is what lets you build a real visual grammar.

From there, you shape the layout: drag nodes around, scale them, and assign connections per side. Daedalus autoroutes the edges around collisions and saves everything to a `.daedalus.json` file next to the source.

Save the D2 file and the diagram refreshes without disturbing your layout. New nodes show up in open space, waiting for you to place them.

{% compare "/img/blog/what-makes-good-diagrams/daedalus_diagram_light.png", "/img/blog/what-makes-good-diagrams/daedalus_diagram_dark.png", "Editing in Daedalus (Light vs Dark)" %}

Most tools neglect edges, so edges got the most work. libavoid routes them orthogonally (the same engine as Inkscape), every node side holds an ordered list of slots you can drag endpoints between, and labels slide along the edge or sit centered by default. Export the result to SVG or PNG.

It's a Tauri desktop app, MPL-2.0 licensed, and it runs against a folder of `.d2` files. If you have to make good diagrams, [download a release](https://github.com/Sotilrac/daedalus/releases/) and give it a try.

{% compare "/img/blog/what-makes-good-diagrams/example_ELK.png", "/img/blog/what-makes-good-diagrams/example.png", "ELK vs. Daedalus" %}
