---
layout: layouts/post.njk
status: public
published: true
title: Opus Smart Card
author: Carlos
id: 71
wordpress_url: http://carlitoscontraptions.com/?p=71
date: 2009-03-11T00:11:00-04:00
date_gmt: 2009-03-11T07:11:00-04:00
categories:
  - Info
tags:
  - Electronics
---

{% include "archive-banner.njk" %}

> _The Opus card is pretty much like an onion_  
> ~ {% wayback "https://web.archive.org/web/20080203202857/http://uncyclopedia.wikia.com:80/wiki/Oscar_Wilde", "Oscar Wilde" %}

{% fig "/img/blog/opus-smart-card/img_1611.jpg", "" %}

Here in Montreal, the public transportation system ([STM](http://stm.info/)) started to use a new system for paying the fares: a smartcard.

{% fig "/img/blog/opus-smart-card/img_1614.jpg", "" %}

This smartcard is called {% wayback "https://web.archive.org/web/20080424131426/http://www.carteopus.info:80/en/main_nav/home/", "Opus" %} and features contactless communication as well as regular metal pads (like those on telephone cards). This card can be recharged with various tickets, month passes, week passes, etc. More info on it can be found in its very own [wiki page](http://en.wikipedia.org/wiki/Opus_card).

Ever since it came out, I wanted to hack it and learn more about it. By searching a bit on the net, I found out that it is similar to other smart cards being used elsewhere in the world and this allowed me to learn some interesting things.

Similarly to the Hong Kong version of the system, the reader has a security feature that avoids writing to more than one card at the time. Let me explain: if you try to add fares to many cards at the same time (on the paying machine that features a contactless reader) by placing them on the reader, only the first one will get loaded with fares. This means that the cards are more than a simple memory, they feature a more complex and almost certainly encrypted communication system.

Also, each card has its own identification number.

## Observations on the card behaviour:

- Cards loaded with a monthly pass will make the readers shine a green light (or yellow for students) during the given month and grant access.
- Cards loaded with tickets will make the reader say that one ticket has been used, shine a green light and grant access (same behaviour as with alternative magnetic band tickets). The ticket is then spent.
- If the card with a ticket is read again within two hours of spending a ticket, the reader will shine a green light and grant access without spending another ticket. The readers also displays a message acknowledging this.
- The process of loading a card with new fares takes around two seconds after the payment has been performed. While the card is being loaded, a yellow progress bar is shown. This means that writing to the card is a slow operation and cannot be performed on the fly while passing the card by the reader when entering the bus, for instance.
- It is unlikely that the readers in the buses are connected in a network with all metro stations and themselves.

## How I think the card works:

1.  The card is put next to the reader which provides it with power (same as any contactless communication)
2.  The reader sends the current time to the card.
3.  The card checks if it can grant access to the transportation at the given time.

4.  If it has a month pass, the card only worries to see if the month is right.
5.  If it has a ticket it stores the time and spends a ticket.
6.  If it has spent the ticket in the previous two hours it does not decrement the ticket count

7.  In all the previous cases, the card sends the instruction to the reader to grant access and tells it what kind of message/light it should show.
8.  If the card does not have tickets or month passes or transfers (a ticket spent in the last two hours) it lets the reader know and the reader does not grant access.

If this card is any similar to the ones in other countries, all the communication between the reader and the card are encrypted. The encryption may be symmetrical which means that there is a secret key shared by all the readers and the cards.

Also, at some point, the card may send its unique ID number to the reader.

## Some extra info:

I also wanted to see how the card is built, and the easiest way of doing so is to disassemble it.

{% fig "/img/blog/opus-smart-card/img_1618.jpg", "" %}

Since it is made out of plastic, I put it to soak in a bath of acetone (nail polish remover) for a bit less than a day while periodically checking how it was doing. I poured the acetone in an old iPod metal casing since it has almost the same size as the card.

{% fig "/img/blog/opus-smart-card/img_1627.jpg", "" %}

In the end I found out that the card is made up of several layers. These layers are very thin (or so are they after being soaked in acetone for 20 hours) but very sturdy.

{% fig "/img/blog/opus-smart-card/img_1634.jpg", "" %}

The middle layer contains the antenna and contact pads in order to be connected to the microprocessor. The chip is merely sitting on the pads, this may explain why the cards are so prone to break: when it is bent, the pads do not touch the antenna any more and the card becomes inactive.

Note that the dissolved plastic in acetone really stinks on the fingers when you manipulate the dissolved card and it is really a pain to clean.
