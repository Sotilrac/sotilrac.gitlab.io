---
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
date: 2026-09-20T12:00:00-04:00
---

Google nagged me into this, along with every other enshittified cloud ~~provider~~ dealer. For about a year, my phone warned me that the account was nearly full, so I migrated the picture backups to a Nextcloud instance and freed the space, at which point the nagging switched to reminding me that backups were turned off. Gmail does the same and provides _helpful_ "Upgrade" buttons here and there. I do not want to rent space for my own pictures for the rest of my life, and I certainly do not want Google looking at them either. I wanted a place to keep the family's files, an automatic backup for years of pictures that were living on phones and ageing PCs, and a machine that could download Linux ISOs around the clock without anyone noticing. I thought I wanted a NAS, so I built one.

{% fig "/img/blog/i-went-bananas/nas-low-angle.jpg", "The finished build" %}

## An Old Friend

Let's be honest, it's been increasingly crazy to buy computers in the last few years, GPUs especially. Fortunately, every computer I ever bought had a GPU (you never know when you'll need that sweet, sweet fast matrix multiplication), and it turned out I had just the computer for the job.

Enter the [Zotac MAGNUS EN1070K](https://www.zotac.com/us/product/mini_pcs/magnus-en1070k), a compact box with an i5 and a good old GTX 1070. It spent a few years as the living room media centre and occasional gaming rig. I used the same model in robot prototypes, where it did great. It idles low, it transcodes video on the GPU, and it runs a small local model without complaining.

The problem is that Zotac designed it to hold a single 2.5" drive. So I designed an [extension for its body in Onshape](https://cad.onshape.com/documents/066c01cffe249f8e1757c5a5/w/e859fc0acb6f99b32537dd0b/e/54fec4203c5d8eb1f143f64c), printed it in glass-filled ABS, and bolted it on. Inside are an [ICY Dock five-bay hot-swap cage](https://global.icydock.com/product_65.html), a printed holder for a sixth drive, a [Pico PSU](https://www.amazon.com/gp/product/B0D4QPHZQF?smid=AV0DDIXL2LYE1&psc=1) fed from the Zotac's upgraded 19.5 V brick through a [DC-DC converter](https://www.amazon.com/gp/product/B07V6X6L89?smid=A3GYM455B71YGR&psc=1) (six drives spinning up at once pull about 125 W for a brief moment), and [Noctua fans](https://www.noctua.at/en/products/nf-a9-flx) to move the air. The six SATA ports come from an [ASM1166 adapter](https://www.amazon.com/gp/product/B0B5RJHYFD?smid=AE2OZG2NN3099&psc=1) in the M.2 slot, which is why the 1 TB boot SSD lives in the 2.5" bay now.

{% fig "/img/blog/i-went-bananas/nas-open.jpg", "The Zotac atop the printed extension" %}

The rest of the upgrade came out of my junk drawers. Two DDR4 sticks from an old laptop take the memory to the platform maximum of 32 GB, an SSD I had lying around boots it, and a WiFi card from a previous project replaces the original one. The only parts I paid for were the cage, the adapter, and, much to my dismay, the drives.

## The Hard Way

It's 2026, and I bought six hard disk drives. I did not want to; I thought we were past mechanically spinning storage. SSDs at this capacity, if you can find them, will cost you a couple of kidneys. For a NAS, the price per TB matters a lot; I did my best to keep it as low as practical. Don't get me wrong, hard drives are not cheap either. AI data centres are buying every drive, every memory chip, and every GPU the fabs can make: [Western Digital's hard drive production is sold out for all of 2026](https://finance.yahoo.com/news/hard-drives-sold-2026-ai-173205634.html), [DRAM and NAND contract prices nearly doubled in a single quarter](https://www.trendforce.com/presscenter/news/20260202-12911.html), and the rest of us get what is left at whatever price. There's a healthy market for second-hand NAS drives on eBay, and I was able to snatch a matched set of 8 TB WD Red Plus at a reasonable price.

They're in a single RAIDZ2 pool: 43.7 TB raw, 29 TB usable, any two drives can die without taking data with them. I tested this by pulling a drive out of the live pool. Reads and writes kept going, Samba kept serving, an alert landed in my mailbox a few seconds later, and when I pushed the drive back in it resilvered on its own. It's hard to overstate how satisfying that is when nothing is actually on fire.

{% fig "/img/blog/i-went-bananas/drive-tray-out.jpg", "Bay two out" %}

Because it's me, the pool is encrypted and unlocks itself at boot from a key server elsewhere in the house, so someone stealing this would get a rather heavy paperweight: the machine weighs 8.5 kg on its own, and over 10 kg once you count the 300 W brick that replaced the original.

## Only Fans

Time for a hot topic: the thermals are bad. The usual steel case conducts heat out of the drives while my printed one insulates them. Five of the six bays sit at 45 °C idle, ten degrees above the ideal, and the dashboard warns me about it every day. I iterated on the enclosure a couple of times and added extra fans; things are a bit better but still steamy. One pleasant discovery is that Noctua fans are indeed quiet and well crafted.

{% clip "/img/blog/i-went-bananas/winter-is-coming", "My cooling strategy" %}

Luckily, winter is coming, so I have some time to tinker with it.

## Eye Candy

I could have stopped here, slapped an OS on it, and moved on. But I wanted more. Specifically, to experiment with interesting UIs. Given that this computer is not meant to be connected to a big screen, I figured it would be a good opportunity to do something radically different: I connected a tiny screen.

I'm too proud of [this 1.47" touch screen](https://www.waveshare.com/esp32-s3-touch-lcd-1.47.htm) on the front. It's driven by an ESP32-S3 that I soldered to the pads of one of the Zotac's USB connectors (the EN1070K has no internal USB header). The NAS streams its status to it over serial, and the firmware, written in C with [LVGL](https://lvgl.io/), renders seven screens you swipe through: pool health, drive temperatures, app status, network throughput, and so on. It goes to sleep after a while and wakes on touch. Walking past the machine, I can see at a glance what's going on without picking up another device. Plus, it looks sleek.

{% clip "/img/blog/i-went-bananas/esp32-touchscreen", "Touchscreen status panel with gesture recognition" %}

The last screen is a power menu, so I can shut the machine down or reboot it from the front panel. It comes with the obligatory menacing countdown in case I change my mind at the last second.

{% clip "/img/blog/i-went-bananas/shutdown", "Shutting down the NAS" %}

## The Truth about TrueNAS

Going into this, I watched a lot of YouTubers recommend TrueNAS for their builds and tout its many features. Naively, I believed them and assumed I would be able to use the seemingly perfect NAS distro. What a disappointment.

The NAS lives far from the router and there's no wired connection available, so it runs on WiFi (I know, shame!). This upset me less than I expected: the WiFi 6E card negotiates above what either of the box's gigabit ports could pass, and I measured 893 Mbit/s of actual internet through it.

What this did rule out, to my surprise, was TrueNAS. It has no wireless support at all, not in the UI or the console. Its latest release also dropped the proprietary NVIDIA driver in favour of the open kernel modules, which do not support a Pascal GPU, so the 1070 would have been a dead weight too. Beyond the two hard blockers, I was disappointed by how little it lets you do: it's an appliance, and it wants you to stay out of the base system. Even my display daemon, which talks over `/dev/ttyACM0`, would be awkward to run.

So the NAS runs Kubuntu 24.04 with ZFS, everything else in Docker Compose behind Caddy, and a dashboard I wrote myself: one page, amber on black to echo the box itself. It shows the full status of the hardware and services. It's the portal to all the NAS features. The JSON that feeds the dashboard is the same one that gets serialized and sent to the ESP32 (keeping both UIs in agreement with a single source of truth). There's also an Actions API to trigger things like backups and speed tests. In the end, this far exceeds the functionality of any NAS dashboard I'm aware of.

The apps each get their own hostname with TLS, and the whole thing is a git repo with `make` targets that lint and test the compose files, the systemd units, the Python, the C, and the docs. I'm slowly turning this into its own OS, and I'll share it when it's presentable.

{% fig "/img/blog/i-went-bananas/dashboard.png", "My cyberpunk one-stop shop for all the household nerd needs" %}

## That Which We Call a NAS

What's in a name? NAS is an outdated one. Sure, it's storage attached to a network, but this box also serves media, indexes photos, runs the password manager, hosts the household's git repos, keeps the backups, and downloads the ISOs. It's the household's computer, much like a house has a furnace and a water heater. This is what I actually wanted; unfortunately, it doesn't have a punchy short name (yet!).

{% fig "/img/blog/i-went-bananas/nas-front.jpg", "The NAS, full frontal" %}

I've been moving away from the clouds for a while now, and this is my biggest step yet. Everything I put on this machine is mine, stays where I can see it, and does not depend on a subscription, a terms-of-service update, or a company deciding my photos belong to its training set. The quota warnings have stopped, too. I expect household computers to become the norm: they give us ownership of our own data, permanence, and independence, and most of us already have the hardware, dormant in a drawer.

{% gallery 3, "/img/blog/i-went-bananas/nas-top.jpg", "/img/blog/i-went-bananas/nas-case-joint.jpg", "/img/blog/i-went-bananas/nas-back.jpg", "/img/blog/i-went-bananas/drive-trays-fanned.jpg" %}
