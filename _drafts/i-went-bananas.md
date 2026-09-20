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
---

Google nagged me into this, along with every other enshittified cloud ~~provider~~ dealer. For about a year, my phone warned me that the account was nearly full, so I moved the picture backups to a Nextcloud instance and freed the space, at which point the nagging switched to reminding me that backups were turned off. Gmail does the same and provides _helpful_ "Upgrade" buttons here and there. I do not want to rent space for my own pictures for the rest of my life, and I certainly do not want Google looking at them either. I wanted a place to keep the family's files, an automatic backup for years of pictures that were living on phones and aging PCs, and a machine that could download Linux ISOs around the clock without anyone noticing. In other words, I thought I wanted a NAS, so I built one.

{% fig "/img/blog/i-went-bananas/nas-front.jpg", "The finished build, six bays and a screen bolted under a mini PC" %}

## An Old Friend

Let's be honest, in the last few years it has become increasingly crazy to buy computers, GPUs especially. Luckily, every computer I ever bought had a GPU (you never know when you'll need that sweet, sweet fast matrix multiplication), and it turned out I had just the computer for the job.

Enter the [Zotac MAGNUS EN1070K](https://www.zotac.com/us/product/mini_pcs/magnus-en1070k), a compact box with an i5 and a good old GTX 1070. It spent a few years as the living room media centre and occasional gaming rig. I used the same model in robot prototypes, where it did great. It idles low, it transcodes video on the GPU, and it runs a small local model without complaining.

The problem is that Zotac designed it to hold exactly one 2.5" drive. So I designed an extension for its body in Onshape, printed it in glass-filled ABS, and bolted it on. Inside are an ICY Dock five-bay hot-swap cage, a printed holder for a sixth drive, a Pico PSU fed from the Zotac's own 19.5 V brick through a DC-DC converter (six drives spinning up at once pull about 125 W for a brief moment), and Noctua fans to move the air. The six SATA ports come from an ASM1166 adapter in the only M.2 slot, which is why the 1 TB boot SSD lives in the 2.5" bay now.

{% fig "/img/blog/i-went-bananas/nas-open.jpg", "The Zotac on top, the printed half below it holding the Pico PSU and a Noctua fan" %}

The rest of the upgrade came out of drawers. Two DDR4 sticks from an old laptop take the memory to the platform maximum of 32 GB, an SSD I had lying around boots it, and a WiFi card from a previous project replaces the original one. The only parts I paid for were the cage, the adapter and, of course, the drives.

## The Hard Way

It is 2026 and I bought six hard disk drives. I did not want to; I thought we were past mechanically spinning storage. SSDs at this capacity, if you can find them, will cost you a couple of kidneys. A NAS is the one place where a drive's price per terabyte matters more than anything else. Don't get me wrong, hard drives are not cheap either. AI data centres are buying every drive, every memory chip and every GPU the fabs can make: [Western Digital's hard drive production is sold out for all of 2026](https://finance.yahoo.com/news/hard-drives-sold-2026-ai-173205634.html), [DRAM and NAND contract prices nearly doubled in a single quarter](https://www.trendforce.com/presscenter/news/20260202-12911.html), and the rest of us get what is left at whatever price. Luckily there is a healthy market for second-hand NAS drives on eBay, and a matched set of 8 TB WD Red Plus came in at a reasonable price.

They are in a single RAIDZ2 pool: 43.7 TB raw, 29 TB usable, any two drives can die without taking data with them. It was so satisfying to test this by pulling a drive out of the live pool. Reads and writes kept going, Samba kept serving, an alert landed in my mailbox two seconds later, and when I pushed the drive back in it resilvered on its own.

{% fig "/img/blog/i-went-bananas/drive-tray-out.jpg", "Bay two, out while the pool kept serving" %}

Because it's me, the pool is encrypted and unlocks itself at boot from a key server elsewhere in the house, so someone stealing this would get a rather heavy paperweight. It is a heavy one, too: the machine weighs 8.5 kg on its own, and over 10 kg once you count the 300 W brick that replaced the original.

## Only Fans

The thermals are bad. A steel case conducts heat out of the drives; my plastic one insulates them. Five of the six bays sit at 45 to 46 °C idle, ten degrees above the ideal, and the dashboard warns me about it every single day. I iterated on the enclosure a couple of times and added extra fans; things are a bit better but not ideal. One pleasant discovery is that Noctua fans are indeed very quiet and very well made.

{% clip "/img/blog/i-went-bananas/winter-is-coming", "My cooling strategy" %}

Luckily, winter is coming, so I have some time to tinker with it some more.

## Eye Candy

I could have stopped here, slapped an OS on it and moved on. But I really wanted something more. I've been wanting to experiment with more interesting UIs, and given that this computer is not meant to be connected to a big screen, I figured it would be a good opportunity to do something cool, like connecting it to a tiny screen.

I'm pretty proud of this 1.47" touch screen on the front. It's driven by an ESP32-S3 that I soldered to the pads of one of the Zotac's USB connectors (the EN1070K has no internal USB header). The NAS streams its status to it over serial, and the firmware, written in C with LVGL, renders seven screens you swipe through: pool health, drive temperatures, app status, network throughput, and so on. It goes to sleep after a while and wakes on touch. Walking past the machine, I can see at a glance what's going on without picking up another device. Plus, it looks pretty cyberpunk.

{% clip "/img/blog/i-went-bananas/esp32-touchscreen", "Seven screens, swiped from the front panel" %}

The screens are not only for reading. The last one is a power menu, so I can shut the machine down or reboot it from the front panel without finding a keyboard or a phone, with a countdown in case of second thoughts.

{% clip "/img/blog/i-went-bananas/shutdown", "Rebooting the NAS by touch" %}

## The True TrueNAS

Going into this, I watched a lot of YouTubers recommend TrueNAS for their builds and tout its many features. Naively, I believed them and assumed I would be able to use the seemingly perfect NAS distro. What a disappointment.

The NAS lives far from the router and there is no wired connection available, so it runs on WiFi (I know, shame!). This upset me less than I expected: the WiFi 6E card negotiates above what either of the box's gigabit ports could pass, and I measured 893 Mbit/s of actual internet through it.

What this did rule out, to my surprise, was TrueNAS. It has no wireless support at all, not in the UI or the console. Its latest release also dropped the proprietary NVIDIA driver in favour of the open kernel modules, which do not support a Pascal GPU, so the 1070 would have been a dead weight too. And beyond the two hard blockers, I was disappointed by how little it lets you do: it is an appliance, and it wants you to stay out of the base system. Even my display daemon, which talks over `/dev/ttyACM0`, would be awkward to run.

So the NAS runs Kubuntu 24.04 with ZFS, everything else in Docker Compose behind Caddy, and a dashboard I wrote myself: one page, amber on black like the box itself. It shows the full status of the hardware and various services. It is the portal to all the NAS features. The apps each get their own hostname, and the whole thing is a git repo with `make` targets that lint and test the compose files, the systemd units, the Python, the C and the docs. I am slowly turning this into its own OS, and I will share it when it is presentable.

{% fig "/img/blog/i-went-bananas/dashboard.png", "The dashboard: one page, amber on black, everything the box knows about itself" %}

## More Than Meets the Eye

NAS is an outdated name. Sure, it is storage attached to a network, but this box also serves the movies, indexes the photos, runs the password manager, hosts the household's git repos, keeps the Time Machine backups, and downloads the ISOs. It is the household's computer, much like a house has a furnace and a water heater.

I have been moving away from the proverbial clouds for a while now, and this is my biggest step yet. Everything I put on this machine is mine, stays where I can see it, and does not depend on a subscription, a terms-of-service update, or a company deciding my photos belong to a training set. The quota warnings have stopped, too. I expect household computers to become the norm: they give us ownership, permanence and independence over our own data, and most engineers already have the hardware to do it in a drawer.

{% gallery 3, "/img/blog/i-went-bananas/nas-low-angle.jpg", "/img/blog/i-went-bananas/nas-top.jpg", "/img/blog/i-went-bananas/nas-case-joint.jpg", "/img/blog/i-went-bananas/nas-back.jpg", "/img/blog/i-went-bananas/drive-trays-fanned.jpg" %}
