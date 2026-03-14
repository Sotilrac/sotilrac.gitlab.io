---
layout: layouts/post.njk
status: public
published: true
title: STM Bug Report
author: Carlos
id: 93
wordpress_url: http://carlitoscontraptions.com/?p=471
date: 2009-12-16T16:03:52-05:00
date_gmt: 2009-12-16T20:03:52-05:00
categories:
- Info
tags:
- Software
- Montreal
---
{% include "archive-banner.njk" %}

Ever since the implementation of the new [Opus Card system](http://carlitoscontraptions.com/2009/03/opus-smart-card/ "Opus Card") by the Montreal's Public Transportation ([STM](http://stm.info/ "STM")), there have been lots of malfunctions and bugs.

{% fig "/img/blog/stm-bug-report/ss851347.jpg", "Crashed STM Ticket Vending Machine" %}

The malfunctions were mainly caused by the poor build quality of the smartcards, the poor wireless reader range, the easy demagnetization of the paper tickets, etc. Slowly (very slowly) these malfunctions are being addressed and (sometimes) solved. The unsolved bugs become a part of the daily routine and we Montrealers learn to accept them.

On last weekend, I witnessed a bug that I would have never thought possible in a professional widespread software application that involves so many money transactions: what I usually call a boundary condition bug.

## The Bug

**Quick note on the STM's fares (for those who do not live it day-to-day):**  
There are mainly two transportation systems: the bus and the metro (subway) and the fare pricing is governed by a (somewhat) simple set of rules:

*   There are monthly passes that allow unlimited fares within the month in both the metro and the bus. They are more expensive for adults than for students or elders.
*   There are weekly cards that are similar to the monthly cards by work for a given week.
*   There are tickets (either as a magnetic paper card or as some information on a smartcard) which allow for one fare that allow to take the metro, the bus, or both within a two-hour time limit. Should the time period be elapsed, or should you take the metro or the same bus more than once, you will need another ticket.

Since the Opus Card implementation, one of the first things that came into my mind was the attention required to compute the fare price when a month ends (i.e. at 12:00 on the 31th, 30th, 29th, or 28th), or when a week or a day ends. Everyone who has programed at least a little bit (like me) knows that these boundary conditions are usually exceptions to the normal behaviour of a program and need to be taken into account. I, of course, assumed that such mundane exceptions would be addressed by professional programmers swiftly and painlessly. I was wrong.

On last Saturday, my girlfriend and I took the metro after going to the movies and she swept her card (loaded with tickets) at exactly midnight (00:00 as reported by the STM records) at the metro reader. Around 20 minutes later, we walked into a bus and surprise! another ticket was charged instead of using a transfer from the previous ticket.

The conclusion to this is that when a day ends, there STM fare algorithm fails and defaults to charge you an extra ticket. Unfortunately, It is unlikely that this bug is noticed by the STM any time soon since they are not loosing any profit from it and they do not accept bug reports. Even the lady at the reclamations booth had a hard time to understand what the problem was.

[![Opus Card Fail](http://carlitoscontraptions.com/wp-content/uploads/2009/12/IMG_2674-300x225.jpg "Opus Card Fail")](http://carlitoscontraptions.com/wp-content/uploads/2009/12/IMG_2674.jpg)

In the end, instead of a full refund she got a "_courtoisie_" ticket which expires on next Sunday (instead of a regular ticket that which expires in around two years). So much for costumer service.

The poor programming quality is also reflected by the poor choice of OS for their vending machines. Let's just say that using Windows Embedded is the equivalent to eating a faulty grenade: it will rather sooner than later get ugly.
