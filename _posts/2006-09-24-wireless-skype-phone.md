---
layout: layouts/post.njk
status: public
published: true
title: Wireless Skype Phone
author: Carlos
id: 7
date: 2006-09-24T23:01:00-04:00
date_gmt: 2006-09-25T06:01:00-04:00
categories:
  - Projects
tags:
  - trash
  - hack
  - electronics
---

{% include "archive-banner.njk" %}

At first, I saw on {% wayback "https://web.archive.org/web/20050612023923/http://www.grynx.com:80/index.php/projects/siemens-skype/", "this site" %} someone who modified his wireless phone in order to connect it to his computer, transforming it in a wireless speaker and microphone. I thought it was kind of cruel to modify a working phone that way.

Some time later, my girlfriend gave me a broken wireless phone that belonged to her parents. I saw it was a nice phone so I tried to repair it but I couldn't. Basically it worked fine, you can play with the menu, store phone numbers, dial, call, the sound quality is good, the reception is OK and the battery life is satisfactory. It has only one small problem: you can't hang up. So unless you're planning to call someone and talk to him indefinitely, it is kind of useless. So I decided to make it into a cordless internet phone.

## General Idea

I wanted to have a wireless phone that connects to my computer speakers and microphone so I can use it as a PC wireless headset. Among other things, it could be used to talk over Skype.

In order to achieve this goal, I hard wired the voice inputs and outputs of the wireless phone to my computer.

## Materials:

- 1 cordless phone (mine is a {% wayback "https://web.archive.org/web/20060105185138/http://www.vtechcanada.com:80/en/products/24/data/vt2498.htm", "VTech 2428" %})
- 2 3.5mm plugs (headphone plugs)
- 1 switch
- 1 screw
- 1 washer
- some cables

## Getting it done

First, I looked for the part of the phone circuit that manages the RF transmission. This was easy since the RF transmitter and the phone PCB are separated. The two parts are connected together with a grey cable ribbon which, at least in my case, is of very poor quality and broke very quickly. I replaced the ribbon with many pieces of individual wires. The result is much stronger and, most importantly, very colourful.

{% fig "/img/blog/wireless-skype-phone/phone-inside.jpg", "" %}

Having found the RF transmitter, I needed to discover which of its pins carries the sound signals to and from the wireless headset. So, I probed the pins of the RF transmitter in order to know which one is ground, which one carries the sound to the speaker and which one brings the sound from the microphone by using an old toy that generates a sort of music (you could use any sound generator but keep in mind you could fry it).

I figured the ground pin had to be the top or the bottom one, since it makes sense to put the there (at least to me). To discover the speaker pin, I played a sound between two pins and tried to listen to it at the receiver until I hear it. For the microphone pin, I played a sound at the receiver's microphone and connected a speaker between two pins until I heard the sound.

Finally, I discovered that, for the VTech 2428 (and I presume for all the other VTech products that use the same transmitter) the first pin (top of the pin row in the picture) on the RF receiver is ground (which makes sense), the fourth is for the speaker and the last (bottom) is for the microphone.

{% fig "/img/blog/wireless-skype-phone/phone-connection.jpg", "" %}

Once the pins were discovered I simply soldered the 3.5mm plugs to them and secured the cables to the box using a big washer and a screw in order to ensure the connections won't break if the cables are pulled (don't worry for the space, this thing is mostly empty). By the way, I got my cables from a PC I found in the garbage so they were already colour coded and labelled as phone and mic.

{% fig "/img/blog/wireless-skype-phone/phone-washer.jpg", "" %}

Also, I drilled a hole on the back of the case in order to get the cables out of the phone.

Since I don't use the phone a lot, I installed a switch on it so I can turn it off. In order to interrupt the power flow into the device I desoldered the power connector, turned, the + leg up and soldered it back in so the + leg is not in contact with the PCB any longer. Then I soldered a switch between the leg and the PCB. I removed the phone line-out connector in order to fit the switch in its place. The line-in remains there and fully functional.

{% fig "/img/blog/wireless-skype-phone/phone-switch-inside.jpg", "" %}

{% fig "/img/blog/wireless-skype-phone/phone-switch.jpg", "" %}

After putting it back together the phone was done and ready to use, It just needs to be plugged in to a computer. As a final remark, the sound quality is very good, both for incoming and outgoing signals. It can be used to talk on Skype from anywhere in the house, as a wireless spy microphone, or even to listen to mp3s while working on some new project (the later uses are not recommended).

{% fig "/img/blog/wireless-skype-phone/phone-finished.jpg", "" %}

## Drawbacks

Unfortunately, this hack doesn't allow you to play the phone tones to the computer in order to dial or pick up Skype.

## Future improvements

I'm working on a ringer that will ring the phone when there is a Skype call. My idea is to use a square wave generated in the computer that will travel down the unused speaker channel(since the phone is mono) to switch on a ringer signal (90Vpp sine wave).

I would also like to add a pick up function but that seems difficult since I don't want to use any other connection besides the ones already available.
