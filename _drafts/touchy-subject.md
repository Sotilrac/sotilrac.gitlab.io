---
title: Touchy Subject
categories:
  - Projects
tags:
  - esp32
  - iot
  - aws
  - capacitive-sensing
date: 2020-01-30T12:00:00-05:00
---

It's too easy to lose touch in long-distance relationships; a text message is no substitute for a person in the room. I built Love Lantern, a pair of IoT lanterns that glow when touched, to shorten the distance. When you think of your loved one, touch your lantern, and theirs will shine bright. If they return the touch, the lanterns can shine even brighter.

But you can buy these, you say? Touché: there are commercial options, but I really wanted a personal touch. It turns out they make a great gift, and if you get your partner to lend a hand building them, it's a great bonding experience, especially since I got to teach her how to solder firsthand.

{% fig "/img/blog/touchy-subject/lanterns.jpg", "A Love Lantern, waiting for the other one" %}

## Hands on

Each lantern hides an ESP32 that talks to the AWS IoT service over MQTT. Every lantern publishes its touch state to its own topic and subscribes to its companion's, so a touch on one end becomes a message on the other, and the other end turns its lights up to full.

The lantern body is the touch sensor. A wire from the metal chassis goes to one of the ESP32's capacitive touch pins, and a graze on the lantern adds enough capacitance to drop the analog reading. The firmware low-pass filters the raw reading and tracks a slow baseline, so humidity, temperature and where the lantern stands on the shelf get absorbed into the baseline; a reading below 80% of it counts as a touch. While you hold it, your own lantern glows too, and when you let go, the light fades over a few seconds. Should the partner lantern be touched during that time, both go to maximum brightness.

Each lantern publishes when the state changes, plus a heartbeat every ten seconds. If Wi-Fi drops or five publishes in a row fail, the lantern resets itself and reconnects from scratch. Heavy-handed, but it works.

## Get a grip

Grab these parts:

- [A lovely lantern](https://smile.amazon.com/gp/product/B01J62PSVI) with fairy lights
- [An Adafruit HUZZAH32 Feather](https://www.adafruit.com/product/3405)
- [A 2N7000 MOSFET](https://smile.amazon.com/gp/product/B07BKX255D) and [a 100 Ω resistor](https://smile.amazon.com/gp/product/B07BKVNBH6)
- [A LiPo battery](https://smile.amazon.com/gp/product/B07BTTQDJQ)
- [Prototyping board](https://smile.amazon.com/gp/product/B074X2GDH2) and [wire](https://smile.amazon.com/gp/product/B01LH1G2IE)

The ESP32 drives the fairy lights through the MOSFET with a 13-bit PWM at 5 kHz, which leaves enough resolution for a fade that does not step. The touch wire goes straight from the chassis to the touch pin. A soldering iron and a wire stripper cover the tools.

{% fig "/img/blog/touchy-subject/schematic.png", "The whole circuit: a MOSFET, a resistor and a touch wire", "30em" %}

## Light the spark

The firmware is an Arduino sketch built with the Arduino IDE and the [AWS IoT library for the ESP32](https://exploreembedded.com/wiki/AWS_IOT_with_Arduino_ESP32). Each lantern needs an [AWS IoT thing](https://exploreembedded.com/wiki/Secure_IOT_with_AWS_and_Hornbill_ESP32) and its credentials in `web_creds.h`, and a define at the top of the sketch picks which end of the pair you are flashing. The source, schematic and KiCad files are on [GitLab](https://gitlab.com/sotilrac/love-lantern).

## To Do

The lanterns work, but there is room to improve. Wi-Fi settings are compiled in, so moving a lantern to a new home means reflashing it; a setup app and OTA updates could fix that. Both lanterns share one device certificate, where each should have its own, and device management on AWS could use some love too (maybe Lambdas?). A PCB could replace the prototyping board.
