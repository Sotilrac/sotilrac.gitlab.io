---
layout: layouts/post.njk
status: public
published: true
title: Solitudes
author: Carlos
id: 69
date: 2009-02-18T16:35:00-05:00
date_gmt: 2009-02-18T23:35:00-05:00
categories:
  - Info
tags:
  - trash
  - CD
---

{% include "archive-banner.njk" %}

In many drugstores and bookstores here in Montreal (AFAIK), we find the [Solitudes](http://www.solitudes.com/) CDs. These are CDs containing music mainly based on nature sounds (elevator music really). The interesting thing about this CDs is that they are displayed on a shelf with an interactive player that the customer can use to get a glimpse of the content of the CDs being offered. In other words, the customer touches on a CD icon, and the shelf starts to play (what seems to be) the contents of that CD.

{% fig "/img/blog/solitudes/img_1538.jpg", "" %}

Oddly enough, I found the guts of one of those shelves in the garbage and I will expose my findings here. Also, the system I found is in perfect working condition except for the power button which was broken.

## How the system works

One might think that the shelf contains a CD library that plays the selected CD on command (that is what I thought anyways). But it is much simpler than that. The system consists of a computer CD drive connected to a small computer power supply and a sort of IDE controller (run by a microcontroller). The IDE controller is told what to do by the user interface, a sort of large keypad hooked up to a(nother) microcontroller. The sound is taken from the CD drive by using the standard audio port.

{% fig "/img/blog/solitudes/img_1537.jpg", "" %}

{% fig "/img/blog/solitudes/img_1551.jpg", "" %}

But, how come it can play all the CDs if there is a single drive? Simple, it doesn't. It plays a special CD, with tracks corresponding to each one of the displayed CD. The tracks contain a mix featuring short samples of the CDs' songs. One can have the illusion the entire CD is playing since nobody stays near those shelves for long enough.

## Some Pictures

{% fig "/img/blog/solitudes/img_1545.jpg", "" %}

{% fig "/img/blog/solitudes/img_1541.jpg", "" %}

{% fig "/img/blog/solitudes/img_1542.jpg", "" %}

{% fig "/img/blog/solitudes/img_1543.jpg", "" %}

{% fig "/img/blog/solitudes/img_1546.jpg", "" %}

{% fig "/img/blog/solitudes/img_1549.jpg", "" %}

(BTW, I think the pictures are much more enlightening than my explanation. They show the naked keypad, the back of the keypad with the microcontroller and dip switch position guide, the inside of the black box, and the IDE controller.)
