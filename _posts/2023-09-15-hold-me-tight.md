---
layout: layouts/post.njk
status: draft
author: Carlos
title: Hold Me Tight
date: 2023-09-15T12:00:00-04:00
categories:
  - My Projects
tags:
  - jewelry
  - cad
  - 3d-printing
  - ring
---

How I got engaged, or the most convoluted way of making an engagement ring.

{% fig "/img/blog/hold-me-tight/ring_final.png", "The final ring render" %}

As a robotics engineer, I knew nothing about jewelry, or engagements, for that matter. Around 2021 we agreed the proposal would happen in 2023. I figured, "How hard can it be?". After all, it's simply manufacturing something, and I have over a year to figure this out.

Now I know how little I know about jewelry.

## The Requirements

We had discussed the topic of marriage and rings enough times that I had a clear spec from her side: rose gold, sapphire, dainty.

From my side, I was very intrigued by [tension-set rings](https://en.wikipedia.org/wiki/Tension_ring), where the band itself holds the stone through spring force instead of prongs. Beautiful _and_ functional. Since this ring is meant to be worn forever, it also had to be durable, comfortable, and snag-free. Traditional prong designs look like they're going to catch on every pocket and sweater in existence.

Of course, all this should be done using only open-source software. Yet again, another one of my projects where I chose the hardest possible path to do something, because it's the only way that feels right.

## Coming Up With The Design

I'm by no means a designer, and my aesthetic sense needs help. Common tension-set designs are anything but delicate since they rely on thick material to hold the stone. So I needed to find a way to make a tension-set ring that still looks elegant.

I'm a stubborn engineer with a [Midjourney](https://midjourney.com/) account. I ran many prompts and did some editing in [GIMP](https://www.gimp.org/) until I got something I was happy with.

{% fig "/img/blog/hold-me-tight/midjourney_inspiration.png", "Midjourney explorations: tension-set sapphire rose-gold engagement ring with diamonds" %}

{% fig "/img/blog/hold-me-tight/inspiration_edited.png", "The edited inspiration that became the design reference" %}

## The Sapphire Problem

Here's the thing about tension-set rings: the stone is held by friction and compression from the band alone. There are no prongs to forgive a sloppy fit. The gap in the band has to match the stone geometry _exactly_, or the stone either won't sit right or won't stay put.

I needed a precise 3D model of the actual sapphire I was going to use. The sapphire vendor's website had an interactive 3D viewer of the stone, but getting the actual model file was an extra cost, and it felt wrong to pay because the data was right there in front of my eyes. So I pulled up [Firefox](https://www.mozilla.org/firefox/) dev tools, downloaded the SRN file backing the viewer, and reverse-engineered the format. SRN is a proprietary format from [Sarine Technologies](https://sarine.com/) used for gemstone scanning data, and there was no existing tool to extract the 3D mesh from it.

So I wrote one: [srn-parser](https://pypi.org/project/srn-parser/), a Python library that parses SRN files and extracts the 3D model. I also wrote a [script to download the model](https://gitlab.com/sotilrac/srn-parser/-/blob/main/scripts/download_nsc.py) directly from the vendor's viewer. This gave me the exact stone geometry to hand off to the CAD designers for precise fitment.

## Jewelry CAD

It turns out "Jewelry CAD Designer" is an actual job title. After spending too long trying to learn [Blender](https://www.blender.org/) subdivision modeling myself, I posted a job on Upwork and hired two separate jewelry CAD designers with different strengths: manufacturability and aesthetics. I combined their work by feeding inspiration from one into the other; mostly late at night after she would fall asleep.

Five days later, the CAD was done.

{% gallery 4, "/img/blog/hold-me-tight/ring_top_final.png", "/img/blog/hold-me-tight/ring_side_final.png", "/img/blog/hold-me-tight/hand_ring_final.png", "/img/blog/hold-me-tight/hand_ring_final_3.png" %}

## 3D Print and Fit

I ordered a rose gold 3D print from Shapeways to test the fit before committing to the real thing. When the printed band arrived, the sapphire fit flawlessly! The ring size was right too (coincidentally the same diameter as my [iron ring](/blog/engineering-bling/)). It looked amazing.

I shopped various local jewellers but had few takers. One in particular shared the following wisdom when I described my project:

<blockquote>
You had too much internet.
<cite>— Old Asian Jeweler</cite>
</blockquote>

I eventually found a different jeweler willing to take on the project for the final stone setting, engraving and polish.

## The Proposal

The ring was ready one day before her birthday. I called the restaurant and we came up with a plan: bring the ring inside a glass of champagne at the beginning of the meal; it would be a _birthday courtesy_. They were very excited. I was ~~extremely excited~~ panicking.

The next day, I biked 40 minutes to pick up the ring. The jeweler wasn't available for another hour, so I parked by the seaport and spent an hour just sitting there, staring at the ocean. Breathing. Taking stock of everything that led to this moment.

The ring was much shinier than any of the renders. As a matter of fact, the rendered images would look fake if they were that shiny.

I biked to the restaurant, dropped off the ring, went home and pretended to have just come back from a dentist appointment. That evening, at her birthday dinner, the champagne arrived with something extra in the glass.

She said _yes_!

{% model "/img/blog/hold-me-tight/hmt-ring.glb", "Hold Me Tight — Engagement Ring", "38em", "38em", "150deg 90deg auto" %}

## Downloads

- [engagement_ring.stl](/img/blog/hold-me-tight/engagement_ring.stl): engagement ring
- [band_hers.stl](/img/blog/hold-me-tight/band_hers.stl): ~~her wedding band~~ we ended up changing this design
- [band_his.stl](/img/blog/hold-me-tight/band_his.stl): his wedding band (first ring I printed, worked on the first try)
- [ring_cad.3dm](/img/blog/hold-me-tight/ring_cad.3dm): Rhino 3D CAD source file
