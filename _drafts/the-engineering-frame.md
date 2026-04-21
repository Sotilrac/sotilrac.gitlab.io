---
author: Carlos
title: The Engineering Frame
categories:
  - Info
tags:
  - engineering
  - communication
  - work
  - craft
---

For most of my career I tried to win design arguments on taste. The code would be cleaner this way. That interface is ugly. This architecture is correct. It mostly didn't work, and when it did work it left a bad taste. Over the last couple of years I've stopped framing things that way, and results are dramatically better. The change is small and almost entirely about framing.

## The Old Frame (Taste, Rightness, Artistry)

Taste arguments sound like this:

- "This is the right way to do it."
- "That's ugly."
- "Good engineers don't do it that way."
- "I wouldn't ship this."

These all implicitly rely on the listener accepting that _you_ have the taste and _they_ don't. Which, even when true, is a confrontational move. It turns a technical conversation into a status conversation. You are telling the client, or your PM, or your teammate, that their judgement is wrong. The defense it triggers is not an engineering defense, it's a personal one.

I think of this as the **artist frame**. The artist argues from interior conviction. "I just know this is better." It is a valid way to make things, and I respect it, but it is a terrible way to negotiate changes with someone who also has stakes in the outcome. The client hears: you are trying to impose your preferences on my project.

Worse, the taste frame is unfalsifiable. There is no shared criterion. When someone disagrees, you can only escalate ("I've been doing this for X years") or capitulate. Neither is a collaboration.

## The New Frame (Constraints, Trade-offs, What's Achievable)

The engineering frame reframes the same disagreement in terms neither party can easily dismiss:

- "Given the deadline, this approach gets you 80% of the feature for 30% of the effort. Option B is more complete but pushes us past the demo."
- "The performance budget here is X. The design you want costs 3X in memory. Here are two ways to bring it under."
- "If we do it this way, we'll pay for it with a month of debugging when we scale. Is that a trade you want to make?"
- "With the resources on the team right now, A is achievable by Q3. B would need another two engineers or a slip to Q1."

Note what changed. I'm not telling anyone their idea is bad. I'm describing the constraints the idea has to live inside, and letting them decide what trade-offs they want to accept. The criterion becomes shared: time, cost, effort, maintainability, risk. These are things we can both see.

The key move is that the engineer stops being a judge of taste and becomes a navigator of constraints. The client gets to keep their agency: they are the one making the call, armed with information they wouldn't otherwise have.

## Why This Works

Two reasons.

**Good faith is legible.** The engineering frame signals "I am here to help you find what works for your situation" rather than "I am here to be right." People respond to that. The conversation's emotional weather changes. You stop being an obstacle and become an ally with domain knowledge.

**The frame is inherently collaborative.** Constraints are a shared map of the terrain. You and the client are both looking at it, pointing at trade-offs, picking a path. In the taste frame you were standing on opposite sides of a fence. In the engineering frame you are standing next to each other.

There is also a less flattering reason: most of the time, the thing that is right technically is _also_ the thing that wins on constraints. If your taste is any good, you don't need to argue from taste; you can just name the constraints and let the right answer fall out. The taste frame is often a shortcut that papers over analysis you should have done.

## When the Engineering Frame Isn't Enough

It isn't a universal solvent. Some cases need more:

- **Irreducible aesthetic disagreement.** Sometimes two paths are genuinely equivalent on all measurable constraints, and preference is all that's left. Here, own the taste frame honestly: "both work, I'd lean here because I find it cleaner, but it's your call."
- **Values conflicts.** "This design is unsafe" or "this pattern is going to hurt users" isn't a trade-off to discuss, it's a line to hold. Don't engineering-frame yourself out of necessary pushback.
- **Client doesn't share the constraints.** If the stakeholder doesn't care about the constraint you're invoking (say, they don't care about maintainability, they'll ship this and never look back), the frame collapses. Then you need to either surface a constraint they _do_ care about, or accept their call.

## Moving Between Frames Deliberately

The meta-skill is noticing which frame you're in and choosing it on purpose. Artist frame for your own work when the decision is genuinely yours. Engineering frame for anything you're negotiating with someone else. Hold-the-line frame for the rare cases where you actually can't compromise.

I used to reach for artist frame by default because it's how I was trained to think about craft. Code as a personal expression. The switch to engineering frame has not made me care less about craft. It has made the craft easier to deliver, because the people I work with are no longer defending themselves from my opinions.

<!-- Working notes:
- Consider a concrete example from past work (anonymized) where taste frame failed and engineering frame unlocked things. Too personal?
- "Artist frame" might be the wrong label; the contrast with engineering is doing the work but "artist" sounds dismissive. Maybe "craft frame" or "aesthetic frame"?
- The "hold the line" section deserves its own expansion.
- Possible callback to the comms-theory post: taste frame fails partly because the other party has a different T and you can't just import your taste into theirs. Engineering frame sidesteps by finding T-invariant coordinates (constraints).
-->
