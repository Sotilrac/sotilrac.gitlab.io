---
author: Carlos
title: BuzzKill
categories:
  - My Projects
tags:
  - android
  - kotlin
  - attention
  - f-droid
---

I had a Reddit problem. Not a dramatic one, just the ordinary kind where the phone comes out of the pocket without a decision being made, the thumb finds the icon, and twenty minutes later I am reading an argument about dishwasher loading. The fixes that people suggest, uninstalling the app, greyscale mode, screen time limits, all share the same flaw: they are a tap away from being undone by the same thumb that started the problem. What I wanted was friction of a kind I could not swipe past, and the most stubborn friction a phone has is being off.

{% fig "/img/blog/buzzkill/panel.png", "The panel. Corporations kill for your attention." %}

## Shut It Down

BuzzKill powers the phone off. You set a kill zone, say 21:00 to 05:30, and inside it the app waits for the screen to stay off for a couple of minutes, then shuts the phone down. A sleeping phone becomes a dead one, and a dead one takes a minute of boot animation to come back, which is long enough for the impulse to pass. Waking up at 2 am to a buzz is impossible, because the phone is off. In the morning, the phone turns itself back on with the scheduled power-on that most Android skins bury in their settings.

Android does not give apps permission to turn the phone off, so BuzzKill does it the way a person would: an accessibility service opens the system power dialog, finds the "power off" control by its text, and performs the slide gesture, with three retries if the slider does not engage. The strings it matches live in a per-vendor file, tuned for the OnePlus 11 I use, so supporting another phone is a data change and not a code change. A test button runs the whole sequence in dry-run mode with a ten-second countdown, so you can check that the dialog still matches after a firmware update without losing whatever you had open.

The interface is one screen styled like a piece of rack gear: seven-segment displays for the kill zone, a toggle switch to arm it, a green LED when it is live. It felt right that a tool for switching a device off should look like it has a physical switch. The tagline at the top, "corporations kill for your attention", is there because I wanted to remember what the fight is about every time I open it.

## Escalation

The night zone worked, so I widened it. A "hacker mode" panel lets each day of the week have its own schedule, including all day, and I ended up with the phone powering itself off after two idle minutes for most of my waking hours. It sounds unlivable and it was fine: the phone still rings, still navigates, still takes the photo, because using it resets the timer. What it stops doing is waiting in your hand, warm and ready, for the next idle moment. The pickups that survive are the ones I meant to make.

## The Ceasefire

The experiment ended for reasons that had little to do with willpower. The first was [Foggy Maps](/drafts/foggy-maps/), which needs the phone on to log where I walk, so an app that switches it off every two minutes is an app that erases my afternoon from the map. I turned BuzzKill down to nights, then off. The second was Reddit itself. I force my browser onto old.reddit with an extension, because the redesign is unusable, and Reddit recently started requiring a login to see it. I do not log in, so the site simply stopped opening, and after a few months of BuzzKill the reflex to try had already weakened enough that this finished it. Sometimes the addiction gets fixed by the dealer.

BuzzKill is on [F-Droid](https://f-droid.org/packages/ca.asmat.buzzkill/) and the [source is on GitLab](https://gitlab.com/sotilrac/buzz-kill), free software under the Apache licence. I still keep it armed on the phone for the night zone, not because anything keeps me up any more, but because a phone that cannot buzz at 2 am is the right default for a phone.
