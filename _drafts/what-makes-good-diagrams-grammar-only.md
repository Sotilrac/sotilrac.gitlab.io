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
---

Good diagrams are hard to come by, especially in engineering. Some concepts or systems are better represented in graphical form and creating such a representation is an art.

It is too easy to make a _pretty_ diagram that is inaccurate or incomplete. Inaccurate here can be another word for misleading, but we are not going to cover deceptive diagrams, only those that are made in good faith but perhaps without that much skill or with the wrong tool.

I remember learning twenty years ago about UML and the promise of well organized information and software architectures. I remember thinking back in college at the time, that there must be tools to create this mythical UML. And there are; they are abysmal.

Am I being extremely opinionated about these tools? Absolutely, and with good reason. I had to make a lot of diagrams for the various robotic systems I designed and worked on. Were they good diagrams? you may ask. They tried to be, and eventually failed.

For this reason I developed some rules and ultimately a tool to make diagramming more manageable and pleasant.

## What Good Diagrams Have

A good diagram is a visual language. It provides consistency (e.g. dotted lines mean wireless, rounded boxes are processes). This consistent visual grammar allows the viewer to internalize the information quickly and effectively.

Another important aspect is that they need to flow and be viewable at a reasonable scale. Ideally fitting in one screen or large print out with readable fonts throughout even when viewed in their entirety.

Of course, in addition to being consistent and readable, they need to be accurate. The diagram needs to faithfully represent the reality it attempts to convey. Of course there can be abstractions and simplifications, but they need to be intentional and stated.

To elaborate further on accuracy, it is also important that the diagram is up to date, or lacking that, at least dated to when it was accurate.

## What makes it Hard

There are two main camps of diagramming tools: WYSIWYG point-and-click or code-based.

### What You See Is What You Get

<!-- note lets find alternatives interpretations of the acronym -->

I have yet to find a point-and-click tool that I like. I remember Visio back in the day, I tried Lucidchart and draw.io. All of them non-free, artificially limited or locking you into their format. There are some FOSS ones but they are similarly lackluster.

For instance, in block diagrams, they make it very difficult to apply styles across edges or boxes. Some support styles (a la CSS) but they are buried in menus and come with a lot of caveats (Yes Lucid, I'm talking about you!). Alignments are mostly manual, grid alignment applies differently for edges than boxes, text styling is equally flawed and spell checkers are not supported. Don't get me started on labeling edges or god forbid maintaining the connection between two boxes as you move them around without creating a spaghetti mess.

One thing these tools do well is allowing the user to decide the general layout. With enough hours and a bit of carpal tunnel you can make a decent diagram. But what if the company color is green instead of orange, or a new subsystem was added? More hours and carpal tunnel await.

{% fig "/img/blog/what-makes-good-diagrams/aint-nobody-got-time-for-that.gif", "Ain't nobody got time for that!" %}

These diagrams become very difficult to maintain. And they are impossible to collaborate on even if the tool says it supports it. Very quickly, they become stale and unwittingly deceiving.

Let's call this diagram debt. It's a part of a broader documentation debt, and compounds like technical debt. But, unlike with code, there are no failing tests to tell you the diagram is broken.

### Code Based

Then there's code that gets rendered as a diagram. This sounds like a great idea: consistent styles, automated, spell and syntax checks, linting, syntax highlighting! And perhaps most importantly, version controlled and diffable.

This is good and all, and got me very excited when I first encountered Mermaid diagrams and later D2 (for consistent styling of edges as well). Very quickly however, all the code advantages become moot when you see the resulting automatic layout. If the layout gods are not in your favor, there is no amount of tricking the parser that will get you the layout you need. And in the improbable occurrence where you can massage the code into making a passable layout, that code is no longer readable or maintainable. It's a hacky confusing mess.

It makes sense that these types of diagrams are used for simple automated use cases for code documentation where all that matters is them being deterministic and mildly readable (Graphviz and PlantUML come to mind).

## Are People Just Dumb?

{% fig "/img/blog/what-makes-good-diagrams/well_yes_but_no.jpg", "Well yes, but actually no" %}

It's common to blame yourself. I certainly do. Maybe if I mastered the tools better, or learned some obscure syntactic incantation I could get the diagram I want and quickly at that. But alas, many more engineers are in a similar rut.

A [Reddit thread](https://www.reddit.com/r/devops/comments/1neyjf1/why_people_dont_document_honest_answers_only/) on documenting system architectures concludes: "I tried at first, really. But after a year in this I just don't care any more." A [Substack architect](https://livinginsoftware.substack.com/p/why-are-architecture-diagrams-never) prescribes prioritizing, given they are so costly to maintain: "if the architecture diagram will help solve important questions which have to do with compliance, regulators and strategic direction, then it needs to be maintained." A [dev.to piece](https://dev.to/erajasekar/the-real-reason-architecture-diagrams-go-stale-35ok) summarizes the problem well: "the artifact is too expensive to keep close to reality."

The current tools force an impossible choice: correctness or visual appeal. Correctness without clarity fails at communicating: it's noise. Clarity without correctness is arguably worse: a confident lie.

## Why is this still a problem in 2026?

Tool builders solve for their own users. Graphviz was built for researchers who need reproducible layouts in papers. Mermaid was built for developers embedding diagrams in markdown. Draw.io was built for business users making something for a Tuesday presentation. Documentation teams don't need interactivity, designers don't need git. And there's me, the robotics system engineer who is obviously not a large enough market.

At this point we can give up and accept that good diagrams should be very onerous and prone to rotting in a Google drive folder for years.

## What Would Solve It

{% fig "/img/blog/what-makes-good-diagrams/por-que-no-los-dos.gif", "¿Por qué no los dos?" %}

What if both camps got fused? The graph's structure comes from code, is semantically styled, and is easy to keep up-to-date with the system. On the other hand, the layout is intentional and hand-crafted. Changes to the structure don't destroy the entire layout; changes to the layout can't disagree with the source. Correctness gets automated, and communication can be designed.

The layout engines, parsers, routers, and interactive canvas libraries all already exist. What is missing is the persistence model that lets the layout survive graph edits, and, most importantly, someone with enough reasons to build it.

## Daedalus

So I built it. [Daedalus](https://gitlab.com/sotilrac/daedalus) takes D2 as the source of truth and ELK for the initial layout pass. D2 specifically, because it has the readability of Mermaid and adds classes that apply to edges. That allows the user to create a real visual grammar that works.

From there, you can modify the layout by dragging and dropping nodes, scaling them, and assigning connections per side. The edges get autorouted to avoid collisions, and everything saves to a `.daedalus.json` file next to the source.

Saving changes to the D2 file automatically refreshes the diagram but keeps your layout intact. New nodes appear in available spaces for you to place.

{% compare "/img/blog/what-makes-good-diagrams/daedalus_diagram_light.png", "/img/blog/what-makes-good-diagrams/daedalus_diagram_dark.png", "Editing in Daedalus (Light vs Dark)" %}

Edges are often overlooked, so they got the most work. Routing is orthogonal via libavoid (the same engine as Inkscape), every node side holds an ordered list of edge slots that you can drag endpoints between, and labels can be dragged along the edge or centered by default. The layout can be exported to SVG or PNG.

It's a Tauri desktop app, MPL-2.0-licensed, and runs against a folder of `.d2` files. If you have to make good diagrams, [download a release](https://github.com/Sotilrac/daedalus/releases/) and give it a try.

{% compare "/img/blog/what-makes-good-diagrams/example_ELK.png", "/img/blog/what-makes-good-diagrams/example.png", "ELK vs. Daedalus" %}
