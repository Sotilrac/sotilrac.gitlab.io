---
layout: layouts/post.njk
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

For longer than i care to admit, I tried to win design arguments on taste, with assertions like "the code would be cleaner this way," "that interface is ugly," or "this architecture is correct." It mostly didn't work, and when it did work, it left a bad taste. Over the last couple of years, I've stopped framing things that way, and the results are much better; the change is small, and almost entirely about framing.

## The Old Frame (Taste, Rightness, Artistry)

Taste arguments sound like this:

- "This is the right way to do it."
- "That's ugly."
- "Good engineers don't do it that way."
- "I wouldn't ship this."

These all implicitly rely on the listener accepting that _you_ have the taste and _they_ don't, which, even when true, is a confrontational move because it turns a technical conversation into a status conversation. You are telling the client, your PM, or your teammate that their judgement is wrong, and the defense it triggers is a personal one rather than an engineering one.

I think of this as the **artist frame**, where the argument comes from interior conviction: "I just know this is better." It is a valid way to make things, and I respect it, but it is a terrible way to negotiate changes with someone who also has stakes in the outcome, because the client hears it as "you are trying to impose your preferences on my project."

The taste frame is also unfalsifiable, because there is no shared criterion. When someone disagrees, you can only escalate ("I've been doing this for X years") or capitulate; neither is a collaboration.

## The New Frame (Constraints, Trade-offs, What's Achievable)

The engineering frame reframes the same disagreement in terms neither party can easily dismiss:

- "Given the deadline, this approach gets you 80% of the feature for 30% of the effort. Option B is more complete but pushes us past the demo."
- "The performance budget here is X. The design you want costs 3X in memory. Here are two ways to bring it under."
- "If we do it this way, we'll pay for it with a month of debugging when we scale. Is that a trade you want to make?"
- "With the resources on the team right now, A is achievable by Q3. B would need another two engineers or a slip to Q1."

Note what changed. I'm not telling anyone their idea is bad; I'm describing the constraints the idea has to live inside, and letting them decide what trade-offs they want to accept. The criterion becomes shared and visible to both of us: time, cost, effort, maintainability, risk.

The key move is that you stop arbitrating taste and start laying out constraints. The client gets to keep their agency: they are the one making the call, with information they wouldn't otherwise have.

## Why This Works

The frame signals "I am here to help you find what works for your situation" rather than "I am here to be right," and people respond to that: you stop being an obstacle and become an ally with domain knowledge.

It is also collaborative by construction. Constraints are a shared map of the terrain, which you and the client are both looking at, pointing at trade-offs and picking a path. In the taste frame you are negotiating whose judgement wins; in the engineering frame you are both reading the same numbers.

There is also a less flattering reason: most of the time, the technically right answer is _also_ the one that wins on constraints, which means that if your taste is any good, you don't need to argue from taste; you can just name the constraints and let the right answer fall out. The taste frame is often a shortcut that papers over analysis you should have done.

## Assume Information Asymmetry

The engineering frame depends on a practice that is easy to skip: when you hit a real disagreement, pause and assume information asymmetry before anything else. In my experience, the underlying cause of most technical disputes is that one of us knows something the other doesn't, rather than diverging taste or bad judgement. Maybe they have tried my preferred approach in a past project and watched it blow up in a way I never heard about, or I know about a failure mode they haven't hit yet, or we are optimizing for different constraints that neither of us has named out loud.

So, the first move when a disagreement surfaces is to ask instead of counter-arguing: what is driving your preference, what have you seen with this approach before, what is the constraint I might be missing? Most "irreducible" disagreements dissolve once both parties finish sharing what they were each implicitly assuming the other already knew.

The alignment is free, and asking has a useful side effect: it signals that you think the other person might be right, which is itself part of the good-faith move the engineering frame is making.

## When the Engineering Frame Isn't Enough

It doesn't cover everything, and some cases need more:

- **Irreducible aesthetic disagreement.** Sometimes two paths are equivalent on all measurable constraints, and preference is all that's left. Here, own the taste frame honestly: "both work, I'd lean here because I find it cleaner, but it's your call."
- **Values conflicts.** "This design is unsafe" or "this pattern is going to hurt users" is a line to hold rather than a trade-off to discuss. Don't engineering-frame yourself out of necessary pushback.
- **Client doesn't share the constraints.** If the stakeholder doesn't care about the constraint you're invoking (say, they don't care about maintainability, they'll ship this and never look back), the frame collapses. Then you need to either surface a constraint they _do_ care about, or accept their call.

## Moving Between Frames Deliberately

The skill worth building is noticing which frame you are in and choosing it on purpose: the artist frame for your own work when the decision is yours, the engineering frame for anything you are negotiating with someone else, and the hold-the-line frame for the rare cases where you actually can't compromise.

I used to reach for the artist frame by default because it is how I was trained to think about craft: code as personal expression. The switch to the engineering frame has not made me care less about craft; it has made the craft easier to deliver, because the people I work with are no longer defending themselves from my opinions.

## Further Reading

The engineering frame is essentially principled negotiation applied to technical work. None of this is new; the references below are the ones I've found most directly useful.

- [Roger Fisher, William Ury, and Bruce Patton, _Getting to Yes_ (1981, rev. 2011)](https://en.wikipedia.org/wiki/Getting_to_Yes): the foundational text of principled negotiation, built on four rules: separate people from problem, focus on interests not positions, invent options for mutual gain, and insist on objective criteria. The engineering frame is the fourth rule applied to technical decisions; constraints _are_ the objective criteria.
- [Terrence Ryan, _Driving Technical Change_ (2010)](https://pragprog.com/titles/trevan/driving-technical-change/): specifically about advocating for technical decisions among colleagues and stakeholders. Enumerates seven patterns of resistance ("The Uninformed," "The Herd," "The Cynic," "The Burned," "The Time Crunched," "The Boss," "The Irrational") and matching approaches. Pragmatic, short, directly relevant.
- [Patterson, Grenny, McMillan, and Switzler, _Crucial Conversations_ (2002)](https://en.wikipedia.org/wiki/Crucial_Conversations): how to hold high-stakes conversations where stakes, opinions, and emotions are strong. The central move, creating a shared pool of meaning before trying to resolve anything, is upstream of what the engineering frame is doing on a smaller scale.
- [Will Larson, _An Elegant Puzzle_ (2019) and _Staff Engineer_ (2021)](https://lethain.com/): writings on navigating technical disagreement at scale, including how senior engineers advocate for decisions without relying on authority or taste. Good on the sociology of how technical decisions actually get made.
- [Peter Naur, "Programming as Theory Building" (1985)](https://en.wikipedia.org/wiki/Peter_Naur): classic essay reframing software as a shared theory held collaboratively by a team. Relevant because it clarifies _why_ taste arguments fail in practice: your taste is a private theory no-one else can audit, whereas constraints are legible to everyone at the table.

<!-- Working notes:
- Consider a concrete example from past work (anonymized) where taste frame failed and engineering frame unlocked things. Too personal?
- "Artist frame" might be the wrong label; the contrast with engineering is doing the work but "artist" sounds dismissive. Maybe "craft frame" or "aesthetic frame"?
- The "hold the line" section deserves its own expansion.
- Possible callback to the comms-theory post: taste frame fails partly because the other party has a different T and you can't just import your taste into theirs. Engineering frame sidesteps by finding T-invariant coordinates (constraints).
-->
