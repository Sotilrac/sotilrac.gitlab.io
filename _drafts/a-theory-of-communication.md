---
layout: layouts/post.njk
author: Carlos
title: A Theory of Communication
categories:
  - Info
tags:
  - communication
  - cognitive-science
  - information-theory
  - philosophy
---

Two people watch the same event and describe it differently, and neither is lying; they are running the same input through different machinery. I want to sketch what I think that machinery is, because once I have the picture in my head, a surprising number of communication failures stop feeling like failures and start looking like predictable consequences of geometry.

<!-- TODO: interactive visualization goes here once built -->

## An Old Story

This is one of those ideas that an ancient parable already nailed. The [blind men and the elephant](https://en.wikipedia.org/wiki/Blind_men_and_an_elephant), found in Buddhist, Jain, and Hindu texts from at least the first millennium BCE, tells of several blind men each touching a different part of an elephant and concluding, with equal conviction, that it is a pillar, a rope, a fan, a tree. Each describes what they actually touched; each is right about their sample and wrong about the whole.

That is the basic shape I want to formalize. Every perceiver samples a low-dimensional slice of something much bigger, and reports their slice faithfully. Disagreement is not usually a failure of honesty; it is the predictable outcome of differently-sampled projections. The rest of this post is an attempt to give that intuition enough structure that it stops being a cute parable and starts being a model you can draw, poke, and compute with.

## The Pipeline

Reality is high-dimensional. Call it _N_ dimensions, where _N_ is whatever number you need to fully specify what is happening: every particle, every relation, every timeline, every observable. _N_ is huge, and for practical purposes effectively unbounded.

Our perception is lower-dimensional. Each person receives reality through a personal transform $T$ that maps the _N_-dimensional reality $R$ into an _m_-dimensional perception $P$, where $m \ll N$.

$$P_A = T_A(R)$$

$T$ is shaped by sensory apparatus, attention, language, culture, mood, prior experience, and current internal state. It is not shared between two people, and it isn't even stable across time for the same person. My $T$ at 9am on a good day is not my $T$ at midnight after a bad one.

Now, person A wants to communicate their perception. Language is _another_ dimensional reduction, call it $L$. A sentence is a small number of discrete tokens; even a long paragraph is vastly lower-dimensional than the perception it gestures at.

$$M_A = L_A(P_A) = L_A(T_A(R))$$

The message $M_A$ travels through a channel (with Shannon noise, typos, bad handwriting, phone static, whatever) and lands at person B.

Person B has to invert both steps. They apply their own $L_B^{-1}$ to get a reconstructed perception, and then either stop there or further try to reconstruct what reality must have been:

$$P'_B = L_B^{-1}(M_A) \quad\text{and}\quad R'_B = T_B^{-1}(P'_B)$$

The catch is that $L_B^{-1} \neq L_A$ and $T_B^{-1} \neq T_A$, and they cannot be, because B is doing the inverse using _their own_ transforms. What B ends up with is a perception A might have had if A were B, which A isn't.

## What This Implies

Communication is never recovery of reality; it is reconstruction of a reconstruction, through a pipeline where every stage is a lossy, personal projection. Two people can hear identical words and walk away with very different pictures, because their inverse transforms differ. This isn't a failure of the speakers or the listeners; it is what the geometry forces.

A few consequences drop out of this framing:

- **Lossiness is the default, not the exception.** The interesting question isn't "why does miscommunication happen" but "why does communication ever succeed."
- **Agreement is not the same as shared understanding.** Two people can nod at the same sentence while holding incompatible reconstructions.
- **Silence is high-bandwidth, sometimes.** If two people have well-aligned transforms, very little $M$ is needed to convey a lot of $P$. If their transforms diverge, no amount of $M$ is enough.

## Learning Someone's Transform

You cannot measure another person's $T$ directly, but you can triangulate.

If I observe the same event as my wife and she describes it, I can compare her description to my own perception; the delta between what I saw and what she said is a noisy estimate of $T_\text{me} - T_\text{her}$ projected through $L$, and over many samples, across many kinds of events, that estimate sharpens.

This is what intimacy is, mechanically: accumulated estimates of another person's transform. After enough joint experience, you can predict what someone will notice, what they will ignore, how they will phrase it, and what they will leave out; you start decoding their messages with a model of their $L$ and $T$ instead of only your own.

It also explains some patterns:

- **Old friends can shorthand because their transform models of each other are dense.**
- **Couples argue over "stupid things" because the surface dispute is almost never the real issue. The real issue is an un-calibrated corner of the transform space, suddenly exposed.**
- **Cross-cultural communication is harder because culture partially sets $T$, and divergent cultures mean divergent $T$s.**
- **Translation is never complete: translator applies $T_\text{source}^{-1} \circ L_\text{source}^{-1}$ then $L_\text{target} \circ T_\text{target}$, and each hop is lossy.**
- **Art often communicates better than prose because it deliberately under-specifies $M$, letting the receiver's $T$ fill in. Paradoxically, this reduces transform-mismatch collisions: the receiver reconstructs from their own model rather than colliding with a precise description that conflicts with it.**

## When Communication Is Easier

- **Prior overlap in $T$.** Shared language, culture, history, domain expertise.
- **Higher-bandwidth channel.** In-person beats video beats phone beats text beats async, because more bandwidth means less aggressive $L$-compression.
- **Shared context.** If we both just witnessed the same event, our $T$s are aligned at least on that event's dimensions.
- **Iterated exchange.** Each round of clarification is a calibration pass, and real-time dialogue outperforms one-shot messaging not because of speed but because it samples faster.

## When It Fails

- **Unacknowledged transform mismatch.** Both parties think they agree because the words match, without realizing that they are reconstructing different $P$s.
- **Low-bandwidth channel forcing severe $L$-compression.** Text strips tone, and tone carries a lot of the signal in spoken $L$.
- **Mismatched priors.** Specialist jargon carries high-density $L$; outsiders' $L^{-1}$ doesn't recover the intended $P$.
- **Adversarial transforms.** If one party's $T$ is deliberately distorted (motivated reasoning, self-deception), calibration from their side becomes noise.

## Related Work

I didn't invent this. The model I'm describing is mostly a re-assembly of things other people have said, from different angles and with different vocabularies. The references below are the ones I find most directly useful.

**Perception as species-specific world:**

- [Jakob von Uexküll's _Umwelt_ (1909-34)](https://en.wikipedia.org/wiki/Umwelt): every organism inhabits its own perceptual world, determined by its body, sensors, and behavioral repertoire. A tick's world is dominated by temperature and butyric acid; a bat's by echolocation; ours by color and language. Uexküll's "functional circle" (_Funktionskreis_) links perception (_Merkwelt_) to action (_Wirkwelt_) in a closed loop. This is the pre-cognitive-science version of $T$, and the clearest articulation that different organisms genuinely live in different realities, not just hold different opinions about one reality.
- [Thomas Nagel, "What Is It Like to Be a Bat?" (1974)](https://en.wikipedia.org/wiki/What_Is_It_Like_to_Be_a_Bat%3F): an argument that the subjective character of another creature's experience is inaccessible from outside. In the framing here, that's the claim that $T^{-1}$ applied to someone else's $P$ never fully recovers their experience, not even in principle.
- [Adrian Tchaikovsky's _Children of Time_ trilogy (2015-2022)](<https://en.wikipedia.org/wiki/Children_of_Time_(novel)>): three novels written at length from the point of view of uplifted spiders, octopuses, and corvids. Each species has a radically different $T$: spiders communicate through vibration and pheromone and think distributively across eight legs; octopuses think with their arms; corvids reason collectively across generations. It is the most sustained literary exercise I know of at the thing Nagel says cannot fully be done. Fiction cheats, because the reader is still a human reading English, but the books do the exercise anyway, and do it well.

**Information theory and encoding:**

- [Shannon's _A Mathematical Theory of Communication_ (1948)](https://en.wikipedia.org/wiki/A_Mathematical_Theory_of_Communication) gave us source, encoder, channel, decoder, destination. My framing adds the perception transform upstream of the encoder and the interpretation transform downstream of the decoder. Shannon's model was intentionally content-agnostic; this one is explicitly about meaning-making.
- [Korzybski's "the map is not the territory" (1933)](https://en.wikipedia.org/wiki/Map%E2%80%93territory_relation): the slogan version of the $T$ claim.

**Meaning and interpretation:**

- [Semiotics, Peirce and Saussure](https://en.wikipedia.org/wiki/Semiotics): sign is not signified; interpretation is mediated. The whole field is arguing about the structure of $L$ and $L^{-1}$.
- [Donald Davidson's triangulation (1990s)](https://plato.stanford.edu/entries/davidson/): objective thought requires a three-way correlation between two speakers and a shared world. Meaning emerges only from what two perceivers jointly respond to. This is the calibration process elevated to a necessary condition for language itself, and the most rigorous version of the "you can only learn another's $T$ by sharing reality with them" claim.
- [Gadamer's fusion of horizons (1960)](https://en.wikipedia.org/wiki/Fusion_of_horizons): every interpreter carries a "horizon" (language, culture, history, prior commitments), and understanding happens when two horizons partially merge, producing a new context not identical to either. The fusion is never complete, and there is no final horizon. This is the continuous-time version of transform-alignment.
- [Herbert Clark's common ground](<https://en.wikipedia.org/wiki/Common_ground_(communication_theory)>): successful conversation requires mutual assumptions about what both parties already know. Common ground is accumulated calibration.
- [Sperber and Wilson's relevance theory](https://en.wikipedia.org/wiki/Relevance_theory): hearers don't decode messages literally; they infer the intended interpretation by assuming speakers are being relevant. A specific model of $L^{-1}$.

**Language and perception coupled:**

- [Sapir-Whorf / linguistic relativity](https://en.wikipedia.org/wiki/Linguistic_relativity): language shapes perception. $L$ and $T$ are coupled, not independent.
- [Predictive processing (Friston, Clark)](https://en.wikipedia.org/wiki/Predictive_coding): perception is active inference. $T$ is not a passive filter; it does enormous amounts of generative filling-in.
- [Tomasello's shared intentionality](https://en.wikipedia.org/wiki/Shared_intentionality): the human capacity to jointly attend to something is what makes transform-alignment possible in the first place.

**Contemporary:**

- [Sucholutsky et al., "Getting aligned on representational alignment" (arXiv 2023)](https://arxiv.org/abs/2310.13018): a framework-building paper pulling together cognitive science, neuroscience, and machine learning around the question of when and how different systems form aligned internal representations. Finding relevant here: misalignment of word meanings between two people predicts communication failure. That is the $T$-mismatch prediction, tested empirically.
- [Re-Align Workshop (ICLR 2025)](https://representational-alignment.github.io/2025/): a growing research community, with submissions up 46% year-over-year, focused on exactly the questions in this post.
- **Autoencoder analogy.** In machine-learning terms, each person is an autoencoder: they learn a low-dimensional embedding of reality (their $T$), encode observations through a decoder-head (their $L$), and decode incoming messages with the same head run in reverse. Communication between two people is cross-model distillation without shared weights. I find this the most generative analogy; it suggests measurements and experiments, not just metaphors.

## The Elephant Game

Static prose is the wrong medium for this, so I want something close to a game: you play for ninety seconds, and the geometry of the post becomes obvious in a way no equation can deliver.

**The setup:**

A 3D elephant stands in the middle of the canvas, slowly animated: trunk swaying, ears flapping, feet shifting, shaded skin. You can orbit a free camera around it and see the full ground truth: shape, color, motion, texture, audio, everything.

**Your job:**

You have a camera, and it is bad on purpose. Its lens is skewed, its color response is warped (maybe you only see blues and oranges, or everything comes through a kaleidoscope), its resolution is pitiful, and some features it flat-out refuses to capture (no motion, or only silhouette, or shape but not color, or audio only). You move along a circular orbit around the elephant, adjust your aim within that orbit, wait for the right moment of the idle animation (trunk swaying, ears flapping, feet shifting), and click. You get a photograph, which is your $L(T(R))$, and it looks every bit as ugly as the theory promises.

**The interlocutor:**

On the other side of the channel is a partner who never sees the elephant; they only see your photos, from which they reconstruct what they think the elephant looks like, rendered as a 3D scene beside the ground truth. The reconstruction is shaped by the partner's own fixed transform and priors: maybe they assume volume from outline, maybe they fill in motion from texture, maybe they default to a cow when evidence is ambiguous.

**The play loop (three shots, one partner):**

1. **Shot 1, blind.** You orbit, frame, and take your best photograph. Send it. You do not yet know what your partner's $T^{-1}$ does to an image like this, so you are guessing.
2. **See their reconstruction.** Their 3D render appears beside the ground truth. It is wrong in specific ways. That wrongness is _information_ about their transform: you now know which features they missed, which they hallucinated, which they quietly projected from priors.
3. **Shot 2, adjusting.** You reposition, maybe toggle a camera feature, and take another photo that compensates for the specific failure modes you just observed. Send.
4. **Reconstruction updates.** The partner re-renders using both photos, fighting between your new evidence and their own priors.
5. **Shot 3, precision.** Last chance. By now you have a working model of your partner's blind spots. Pick the single shot that closes the biggest remaining gap.
6. **Final score.** Structural similarity between their reconstruction and the ground truth, broken out by shape, color, motion, and texture.

The whole theory lives in this loop: shot 1 is communication without calibration, watching the reconstruction is triangulation, and each adjustment is an update to your model of your partner's $T$. The score goes up when you stop trying to describe reality and start trying to compensate for one specific mind. After you finish a round, you can switch partners and discover that everything you just learned is now useless.

**Partner presets (each is a fixed $T^{-1}, L^{-1}$ pair):**

- The **twin**: transforms almost identical to yours. Easy mode. The "long friendship" case.
- The **foreigner**: different cultural priors and default object classes. Same photo, different reconstruction.
- The **specialist**: only cares about certain features (a zoologist fixated on tusks; a color theorist fixated on hue; a kinematicist fixated on gait).
- The **child**: higher noise floor, stronger generative priors, less calibrated.
- The **bat**: Umwelt-shifted, reconstructs in echolocation-space rather than vision-space. Your photo of a silent elephant is not useful data; a recording of its footsteps is.
- The **blind men**: an ensemble of three partners with non-overlapping attention windows, as in the opening parable. Your job: compose photos that let all three reconstruct something plausible together.
- The **adversary**: a partner whose transform is deliberately mis-aligned or motivated. Same photos, distorted reconstruction on purpose. The model for bad-faith communication.

**Camera presets (your $T + L$):**

- Default: low-res, color-cast, narrow FOV. Everyone starts with a bad camera.
- Toggle on a feature ("now you can capture motion") and watch which partners suddenly reconstruct better and which still cannot.
- A basis-rotation slider that literally rotates the perceptual axes, so the same aim yields different photographs.
- A bandwidth slider: fewer bytes per message means harsher $L$-compression. Your photo gets posterized, blurred, or tokenized into very few symbols.

**Advanced modes:**

- **Calibration mode**: you and one partner exchange many rounds. Reconstruction error drops as the partner's implicit model of your $T$ sharpens. This is "getting to know someone," made into a visible curve.
- **Two-player mode** via URL room code: two humans each get a camera and a fresh elephant, and try to communicate about it across a narrow channel. Scored like Pictionary, but with explicit transforms.
- **Disagreement overlay**: when reconstruction diverges from ground truth, the system highlights on the 3D elephant which features the partner got wrong. You see your partner's gaps, not just an error number.

**Implementation sketch:**

- WebGL via [Three.js](https://threejs.org). Worth the dependency cost for camera controls and model loading; hand-rolling those is not the interesting part.
- Elephant: a rigged CC-licensed mesh with a cheap animation loop.
- User camera: a custom fragment shader that applies the skew, color-warp, blur, and feature masking of the current $T \circ L$. The output of the shader is literally the photo shown to the partner.
- Partner reconstruction: a small parametric renderer that takes a message (quantized photo) and renders a 3D scene using the partner's predefined inverse transforms and priors. For the MVP this can be lookup-based (map message features to rendering parameters); a richer version could be a tiny neural decoder.
- Scoring: pixel-difference on rendered views plus a structural comparison of parameters (shape, color, motion) between ground truth and reconstruction.
- Web-component pattern from the [programmer calculator post]({{ "/blog/i-see-0xdeadbeef/" | url }}), Shadow DOM for style isolation, single-file embed.
- Ballpark 2000-3000 lines of JS plus shaders.

## Open Questions

Some things I haven't worked out yet and would like to think about:

- **Is $T$ compositional?** Can I factor it as $T = T_\text{body} \circ T_\text{culture} \circ T_\text{language} \circ T_\text{mood}$, or do those interact non-linearly?
- **Stability.** Over what timescale is $T$ stable? Mood shifts daily, culture over years, sensory apparatus over decades.
- **Identifiability.** Given only messages, you cannot separate $T_A$ from $L_A$. You need access to reality to calibrate, and we only have access to our own perception of reality, which is already $T$-filtered. So the calibration is always done against another $T$. This feels like a fundamental limit.
- **Relationship to theory of mind.** Is modeling another person's $T$ exactly what "mentalizing" is, or a subset of it?
- **Relevance-theoretic inverse.** When a hearer does relevance-theoretic inference, are they applying a different $L^{-1}$ or the naive one with stronger priors?
- **Can $T$-distance predict disagreement in _unrelated_ domains?** If so, it would be a surprisingly general model of interpersonal prediction.
- **Failure modes.** What does an _adversarial_ $T$ look like? What about a $T$ with high variance (inconsistent perceiver)?

<!-- Working notes below, to clean up:

- Figure out whether to use math formulas or keep it prose-only. KaTeX renders if we want it; adding math may lower accessibility for casual readers.
- The "lossy autoencoder" analogy is probably the cleanest hook for a technical audience. For a general audience, the "translation never arrives" framing lands harder.
- Decide whether the viz is part of this post or a separate followup.
- Consider a short tangent on why LLMs are a new kind of participant in this pipeline: their T and L are learned from aggregated human output, which makes them an "average decoder." That's interesting but probably its own post.

-->
