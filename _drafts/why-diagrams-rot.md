---
author: Carlos
title: Why Do Your Diagrams Rot? It's Not Your Fault.
categories:
  - Info
tags:
  - engineering
  - communication
  - work
---

I remember learning about UML in college and thinking this was a solved problem. There was a standard, there were tools, there was a whole methodology. You could describe a system in a formal way and generate diagrams from it. The future was here.

That was roughly two decades ago. The future is still not here.

Every project I've worked on, from humanoid robotics at Aldebaran to wearable exoskeletons at Dephy, the same thing happens. Someone asks: "Do you have a diagram of the system?" And the answer is always some version of "sort of, but it's out of date." Or worse, the diagram exists, it looks authoritative, and it's wrong.

## The Diagram You Made Last Month Is Already Lying

Here's how it goes. You have a new system, a new product, a new architecture. Somebody needs to understand it. Maybe it's a new team member. Maybe it's a client visit. Maybe it's your future self. So you sit down and spend a day making a diagram. You think carefully about what to include, how to arrange it, what connects to what. You make it clear. You present it. People understand it.

Then the system changes. Someone swaps the RS-485 bus for RS-232 because the project needs full duplex now. A firmware module gets refactored. A component gets replaced. And your diagram is wrong. But it still exists in your Confluence page, in your presentation deck, looking just as authoritative as the day you made it.

You don't have time to update it. You're resource-starved. Every team I've worked on has been resource-starved. So the diagram sits there, slowly becoming fiction. And the next person who reads it thinks they understand the system, but they're reading something that no longer reflects reality.

This is what I call diagram debt. It compounds, just like technical debt. The longer the diagram sits, the more the system drifts from the picture. And unlike code, there's no compiler to tell you the diagram is broken.

## Did You Catch My Drift?

The word "drift" does a lot of work here. When a diagram drifts from the system it describes, it doesn't announce itself. There's no red squiggly line. There's no failing test. The diagram just quietly becomes wrong, and everyone who looks at it absorbs that wrongness without knowing it.

I've seen this happen over and over. Someone shows me a diagram they're proud of. "Look at this, it's so clear." And I look at it and I see chaos. Not because the person is bad at diagrams, but because the visual choices are accidental rather than intentional. A line is curved here and straight there. Does that mean something? A box is rounded in one place and square in another. Is that significant? The person who drew it knows these differences are meaningless, artifacts of the tool or the moment. But as an external reader, I don't know that. I have to spend cognitive energy filtering signal from noise before I can even begin to understand the system.

A good diagram is almost like a language. It has a consistent visual grammar. Dotted lines mean wireless. Red lines mean power. Rounded boxes are processes. Square boxes are hardware. If the grammar is consistent, you can read it fast. You can derive meaning from visual characteristics almost instantly. That's what makes a diagram actually useful, as opposed to just existing.

But building that visual grammar into a diagram takes time and intention. And keeping it honest as the system changes takes even more time. Time that nobody has.

## You're Not Bad at Documentation

Here's what people tell themselves: "I'm bad at keeping documentation up to date." "Our team is disorganized." "We need better processes." "We need governance and cadence around our documentation."

This is everywhere. On Reddit, engineers write things like "I dedicated a few days documenting a bunch of stuff a year ago. Since then I haven't had the time to document anything else and quite a bit of that documentation is out of date." Enterprise architects talk about needing "cadence and governance" to keep diagrams current, framing it as a discipline problem. One blog post suggests the solution is to "simply limit the number of diagrams your team is working with," as if the answer to bad tools is to use them less. People are literally asking whether it even matters to have and maintain architecture diagrams, because the maintenance burden is so high that the whole exercise feels pointless.

But the problem isn't laziness. It isn't negligence. It isn't bad process. The problem is that the tools are structurally designed in a way that makes diagram rot inevitable.

## Two Camps, One Gap

The diagramming world is split into two camps that don't talk to each other.

The first camp cares about correctness. These are the code-based tools: Graphviz, Mermaid, D2, PlantUML. You write the structure in text, the tool generates the image. The output is deterministic and reproducible. You can version-control it, diff it, review it in a pull request. The diagram stays tied to a source of truth. The tradeoff is that you surrender control over the layout. The tool decides where your nodes go, how your edges route, what the visual hierarchy looks like. And the layout engines are opinionated. Tiny changes to the source can radically rearrange the entire diagram. Users resort to hacks like invisible edges in Graphviz or hidden connections in PlantUML just to nudge things into place. D2 has an open feature request for port support that's been sitting since the early days of the project. Mermaid users report that "tiny changes can radically change the whole layout." The tools treat layout as sacred and untouchable, and users are left fighting them.

The second camp cares about presentation. These are the interactive editors: draw.io, Lucidchart, Visio. You drag boxes, draw lines, position everything exactly where you want it. The diagram looks exactly how you designed it. The tradeoff is that the diagram is now an artifact, not a source of truth. It's an image, not code. You can't meaningfully diff it. You can't review changes in a pull request. Merging concurrent edits is painful or impossible. The diagram is born disconnected from the system it describes, and it only drifts further from there.

The first camp gives you correctness but takes away your ability to communicate clearly. The second camp gives you visual control but takes away your ability to keep the diagram honest. And nobody is building for the person who needs both.

## Why Nobody Is Building for You

The reason this gap exists isn't that the two paradigms are fundamentally incompatible. It's that the builders of these tools are solving for their own users, and those users happen to fall neatly into one camp or the other.

Graphviz was built for researchers who need reproducible graph layouts for papers. Mermaid was built for developers who want diagrams embedded in markdown documentation. D2 was built for engineers who want prettier output than Mermaid with more expressive syntax. All of them optimize for "code in, image out" and treat interactive editing as outside their scope.

Draw.io was built for business users who need to make a diagram for a presentation today. Lucidchart was built for teams who need real-time collaboration on visual artifacts. They optimize for immediate visual control and treat version control as someone else's problem.

The person who needs both, the engineer leading a system who needs diagrams that are version-controlled and diffable and also intentionally designed to communicate clearly to mixed audiences, that person is too niche. It's not a strong enough market signal. Documentation teams don't need interactivity. Designers don't need git. So the tool doesn't get built, and people hack around it with exports and manual tweaks and stale Confluence pages.

There's also a cost problem. Building a tool that properly bridges code-based diagram definition with interactive layout editing is genuinely expensive. You need a parser for the source language. You need a layout engine that handles automatic edge routing. You need an interactive canvas where users can adjust positions. You need a persistence model that can round-trip layout changes back into the source code. You need to handle partial invalidation so that editing one part of the diagram doesn't destroy the layout of everything else. That's not a weekend project. It's a multi-person, multi-year effort for a market of maybe thousands of people globally.

## The Evidence Is in the Training Data

Here's a telling detail. When you ask an AI to generate diagram code, it struggles. Not just with D2, but with Graphviz and Mermaid and PlantUML too. The model has seen enough JavaScript to be fluent in it, millions and millions of examples across every conceivable pattern. But diagram-as-code? Maybe three orders of magnitude less material. There simply aren't enough examples in the wild for the model to internalize the idioms, the gotchas, the subtle interactions between layout attributes.

With D2 specifically, it gets things confidently wrong. It generates syntax that looks plausible but doesn't work, or attributes that it expects to have one effect but produce the opposite. The documentation exists but it's rough, and there isn't enough real-world D2 code in repos or blog posts for the patterns to be well-represented in training data.

This is a feedback loop. The tools are niche, so adoption is low. Adoption is low partly because the learning curve is steep and documentation is sparse. The learning curve is steep partly because there's no critical mass of examples, tutorials, and Stack Overflow answers. And there's no critical mass because the tools are niche. Even AI can't help you much, because AI learns from the same ecosystem that's underserving you.

## Correctness and Clarity Are the Same Problem

Most people pick a lane. The infrastructure team cares about correctness. The graph reflects what's actually running, period. The product team cares about clarity. The diagram tells a story, guides the eye, makes sense to someone seeing the system for the first time.

But these aren't opposing forces. They're the same thing.

A correct diagram that's a visual disaster communicates nothing. It's just noise. And a clear, beautifully laid-out diagram that's wrong is worse than noise. It's a lie that people will act on.

You need the automation to keep the graph correct and in sync with what's real. But you need manual control to make it communicate that correctness effectively. The graph stays honest because it's code-based and versioned. The layout is intentional because you designed it for your audience.

The fact that this is hard to solve doesn't mean it isn't worth solving. It just means nobody's had the right combination of motivation and accessible technology to do it yet. The layout engines exist. The parsing tools exist. The interactive canvas libraries exist. The cost of assembling them into something coherent has been prohibitive until now, but maybe that's changing.

Maybe it's time to stop blaming ourselves for letting diagrams rot and start asking why the tools make it so hard to keep them alive.
