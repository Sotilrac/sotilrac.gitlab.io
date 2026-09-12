---
layout: layouts/post.njk
author: Carlos
title: I went banaNAS
categories:
  - My Projects
tags:
  - nas
  - self-hosting
  - linux
  - 3d-printing
  - esp32
  - zfs
---

Google nagged me into this, along with every other enshittified cloud ~~provider~~ dealer. For about a year, my phone warned me that the account was nearly full, so I moved the picture backups to a Nextcloud instance and freed the space, at which point the nagging switched to reminding me that backups were turned off. Gmail does the same and provides _helpful_ "Upgrade" buttons here and there. I do not want to rent space for my own pictures for the rest of my life, and I certainly do not want Google looking at them either. I wanted a place to keep the family's files, an automatic backup for years of pictures that were living on phones and aging PCs, a machine that could download Linux ISOs around the clock without anyone noticing. In other words, I thought I wanted a NAS, so I built one.

<!-- TODO: photo of the finished NAS -->

{% fig "/img/blog/i-went-bananas/nas-front.jpg", "The finished build" %}

## An Old Friend

Let's be honest, in he last few years it's becoming increasingly crazy to buy computers. GPUs specially. Luckily, every computer I ever bought had a GPU (you never know when you'll need that sweet sweet faxt matrix multiplication). And it turned out I had justthe computer for the job.

Enter the [Zotac MAGNUS EN1070K](https://www.zotac.com/us/product/mini_pcs/magnus-en1070k), a compact box with an i5, a good old GTX 1070. It spent a few years as the living room media centre and occasional gaming rig. I used the same model in robot prototypes, where it did great. It idles low, it transcodes video on the GPU, and it runs a small local model without complaining.

The problem is that Zotac designed it to hold exactly one 2.5" drive. So I designed an extension for its body in Onshape, printed it in glass-filled ABS, and bolted it on. Inside are an ICY Dock five-bay hot-swap cage, a printed holder for a sixth drive, a Pico PSU fed from the Zotac's own 19.5 V brick through a DC-DC converter (six drives spinning up at once pull about 125 W for a brief moment), and Noctua fans to move the air. The six SATA ports come from an ASM1166 adapter in the only M.2 slot, which is why the 1TB boot SSD lives in the 2.5" bay now.

<!-- TODO: photo of the extension, ideally with the cage and the sixth bay visible -->

{% fig "/img/blog/i-went-bananas/extension.jpg", "The printed extension, before the drives went in" %}

The rest of the upgrade came out of drawers. Two DDR4 sticks from an old laptop take the memory to the platform maximum of 32 GB, an SSD I had lying around boots it, and a WiFi card from a previous project replaces the original one. The only parts I paid for were the cage, the adapter and of course the drives.

## The Hard Way

It is 2026 and I bought six hard disk drives. I did not want to, I thought we were past mechanically spinning storage. SSDs at this capacity, if you can find them, will cost you a couple of kidneys. A NAS is the one place where a drive's price per terabyte matters more than anything else. Don't get me wrong, hard drives are not cheap either. AI data centres are buying every drive, every memory chip and every GPU the fabs can make: [Western Digital's hard drive production is sold out for all of 2026](https://finance.yahoo.com/news/hard-drives-sold-2026-ai-173205634.html), [DRAM and NAND contract prices nearly doubled in a single quarter](https://www.trendforce.com/presscenter/news/20260202-12911.html), and the rest of us get what is left at whatever price. Luckily there is a healthy market for second-hand NAS drives on eBay, and a matched set of 8 TB WD Red Plus came at a reasonable cost.

They are in a single RAIDZ2 pool: 43.7 TB raw, 29 TB usable, any two drives can die without taking data with them. It was so satisfying to tested this by pulling a drive out of the live pool. Reads and writes kept going, Samba kept serving, an alert landed in my mailbox two seconds later, and when I pushed the drive back in it resilvered on its own. Becuase it's me, the pool is encrypted and unlocks itself at boot from a key server elsewhere in the house, so someone stealing this would get a ratehr heavy paperweight.

## Only Fans

The thermals are bad. A steel case conducts heat out of the drives; my plastic one insulates them. Five of the six bays sit at 45 to 46 °C idle, ten degrees above the ideal, and the dashboard warns me about it every single day. I iterated the enclosure a couple of times and added extra fans. things are a bit better but not ideal. Once pleasant discovery is that the Noctua fans are indeed very quiet and super high quality.

{% fig "/img/blog/i-went-bananas/winter-is-coming.gif", "My cooling strategy" %}

Luckily, winter is coming, so I have some time to tinker with it some more.

## Eye Candy

I could be done here, slap an OS and move on. But I really wanted something more. I've been wanting to experiment with more interesting UIs and given that this computer is not supposed to be connected to a big screen, i figured it would be a good opportunity to do something cool. Like connecting it to a tiny screen.

I'm pretty prooud of this 1.47" touch screen on the front. It's driven by an ESP32-S3 that I soldered to the pads of one of the Zotac's USB connectors (the EN1070K has no Internal USB header). The NAS streams its status to it over serial, and the firmware, written in C with LVGL, renders seven screens you swipe through: pool health, drive temperatures, app status, network throughput, and so on. It goes to sleep after a while and wakes on touch. Walking past the machine, i can see at a glance what's going on without using any aditional device. Plus, it looks pretty cyberpunk.

<!-- TODO: photo or short clip of the display -->

{% fig "/img/blog/i-went-bananas/display.jpg", "Everything is fine" %}

## The True TrueNAS

Going into this, i watched a lot of YouTubers recommend TrueNAS for their build and tout it's many features. Naively, I belived it and just thought I woudl be able to sue the seeminly perfect NAS distro. What a dissapointment.

The NAS lives far from the router and there is no wired connection available, so it runs on WiFi (I know, shame!) This upset me less than I expected: the WiFi 6E card negotiates above what either of the box's gigabit ports could pass, and I measured 893 Mbit/s of actual internet through it.

What this did rule out, to my surprise, was TrueNAS. It has no wireless support at all, not in the UI or the console. Its latest release also dropped the proprietary NVIDIA driver in favour of the open kernel modules, which do not support a Pascal GPU, so the 1070 would have been a dead weight too. And beyond the two hard blockers, I was disappointed by how little it lets you do: it is an appliance, it wants you to stay out of the base system. Even my display daemon that talks over `/dev/ttyACM0` is awkward to run.

So the NAS runs Kubuntu 24.04 with ZFS, everything else in Docker Compose behind Caddy, and a dashboard I wrote myself: one page, amber on black like the box itself. It shows the full status of the hardware and various services. It serves as teh portal to all the NAS features. The apps each get their own hostname, and the whole thing is a git repo with a `make` targets that lints and tests the compose files, the systemd units, the Python, the C and the docs. I am slowly turning this into its own OS, and I will share it when it is presentable.

## More Than Meets the Eye

NAS is an outdated name. Sure, it is storage attached to a network, but this box also serves the movies, indexes the photos, runs the password manager, hosts the household's git repos, keeps the Time Machine backups, and downloads the ISOs. It is the household's computer, much like a house has a furnace and a water heater.

I have been moving away from the proverbial clouds for a while now, and this is my biggest step yet. Everything I put on this machine is mine, stays where I can see it, and does not depend on a subscription, a terms-of-service update, or a company deciding my photos belong to a training set. The quota warnings have stopped, too. I project household computers to become the norm: they give us ownership, permanence and independence over our own data, and most engineers already have the hardware to do it in a drawer.
