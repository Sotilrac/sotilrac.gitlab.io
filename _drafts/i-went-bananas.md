---
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

I wanted three things: a place to keep the family's files, an automatic backup for years of pictures that were living on phones and a stack of aging laptops, and a machine that could download Linux ISOs around the clock without anyone noticing. In other words, I wanted a NAS, so I built one.

<!-- TODO: photo of the finished NAS -->

{% fig "/img/blog/i-went-bananas/nas-front.jpg", "The finished build" %}

## The Old Friend

The computer is a Zotac MAGNUS EN1070K, a compact box with an i5, a GTX 1070, and a very small footprint. It spent a few years as the living room media center and occasional gaming rig, then a few more powering robotics projects, where it did great. It idles low, it transcodes video on the GPU, and it still runs a small local model without complaining, so I had no interest in replacing it with a purpose-built NAS appliance that would do less for more money.

The problem is that Zotac designed it to hold exactly one 2.5" drive. So I designed an extension for its body in Onshape, printed it in glass-filled ABS, and bolted it on. Inside are an ICY Dock five-bay hot-swap cage, a printed holder for a sixth drive, a Pico PSU fed from the Zotac's own 19.5 V brick through a DC-DC converter (six drives spinning up at once pull about 125 W for a moment, which is the number that sizes everything), and Noctua fans to move the air. The six SATA ports come from an ASM1166 adapter in the only M.2 slot, which is why the boot SSD lives in the 2.5" bay.

<!-- TODO: photo of the extension, ideally with the cage and the sixth bay visible -->

{% fig "/img/blog/i-went-bananas/extension.jpg", "The printed extension, before the drives went in" %}

The rest of the upgrade came out of drawers. Two DDR4 sticks from an old laptop take the memory to the platform maximum of 32 GB, an SSD I had lying around boots it, and a WiFi card from a previous project replaces the original one. The only parts I paid for were the drives, the cage, the adapter and the filament.

## Spinning Rust in 2026

It is 2026 and I bought six hard drives. I did not want to. SSDs at this capacity still cost data center money, and a NAS is the one place where a drive's price per terabyte matters more than anything else it does. Don't get me wrong, hard drives are not cheap either, but there is a healthy market for second-hand NAS drives on eBay, and a matched set of 8 TB WD Red Plus came in at a fraction of what new ones cost.

They are in a single RAIDZ2 pool: 43.7 TB raw, 29 TB usable, any two drives can die without taking data with them. I tested that claim by pulling a drive out of the live pool with data on it. Reads and writes kept going, Samba kept serving, an alert landed in my mailbox two seconds later, and when I pushed the drive back in it resilvered on its own. The pool is encrypted and unlocks itself at boot from a key server elsewhere in the house, so a stolen box is a heavy paperweight.

## Thermals, or Winter is Coming

The thermals are bad. A steel case conducts heat out of the drives; a plastic one insulates them. Five of the six bays sit at 45 to 46 °C idle, ten degrees above the loose sixth drive, and the dashboard warns me about it every single day. I measured the whole thing: the only fan the OS can control cools the CPU and GPU and never reaches the drives, and the cage fan that does cool them is a dumb 12 V line with no tachometer and no PWM. Running every fan at full blast for seven hours brought the drives down to 35 °C, which proves airflow is the fix and the enclosure is where it has to happen.

<!-- TODO: Winter is Coming meme -->

{% fig "/img/blog/i-went-bananas/winter-is-coming.jpg", "My cooling strategy" %}

Luckily winter is coming, and my basement will do for free what my enclosure does not, so revision two of the extension can wait for a couple of months.

## The Little Screen

The part I am proudest of is a 1.47" touch screen on the front, driven by an ESP32-S3 that is soldered to the pads of one of the Zotac's internal USB connectors (the EN1070K has no USB header, so I made one). The NAS streams its status to it over serial, and the firmware, written in C with LVGL, renders seven screens you swipe through: pool health, drive temperatures, what the apps are doing, network throughput, and so on. It goes to sleep after a while and wakes on touch. When I walk past the box I can see whether it is fine without opening a laptop, and that turns out to be the feature I use most.

<!-- TODO: photo or short clip of the display -->

{% fig "/img/blog/i-went-bananas/display.jpg", "Everything is fine" %}

## Why Not TrueNAS

The NAS lives where the media center used to, and there is no wired path from there to the router, so it runs on WiFi. This upset me less than I expected: the WiFi 6E card negotiates above what either of the box's gigabit ports could pass, and I measured 893 Mbit/s of actual internet through it. A cable would give me full duplex and a link that does not care about the neighbours, and it will happen eventually, but it is no longer a finding.

What it did rule out, to my surprise, was TrueNAS, the operating system every NAS video on YouTube tells you to install. TrueNAS has no wireless support at all, not in the console and not in the UI. Its latest release also dropped the proprietary NVIDIA driver in favour of the open kernel modules, which do not support a Pascal GPU, so the 1070 would have been a paperweight too. And beyond the two hard blockers, I was disappointed by how little it lets you do: it is an appliance, it wants you to stay out of the base system, and a long-running daemon that talks to a display over `/dev/ttyACM0` is exactly the kind of thing it makes awkward.

So the NAS runs Ubuntu 24.04 with ZFS, everything else in Docker Compose behind Caddy, and a dashboard I wrote myself: one page, amber on black like the box it describes, that answers "is it fine?" in two seconds and shows the live telemetry underneath. The apps each get their own hostname, the torrent client lives inside a WireGuard namespace no other process on the machine can see, and the whole thing is a git repo with a `make check` that lints the compose files, the systemd units, the Python, the C and the docs. I am slowly turning this into its own OS, and I will share it when it is presentable.

## More Than Storage

NAS is an outdated name. Sure, it is storage attached to a network, but this box also serves the movies, indexes the photos, runs the password manager, hosts the household's git repos, keeps the Time Machine backups, and downloads the ISOs. It is the household's computer, the way a house has a furnace and a water heater.

I have been moving away from the proverbial clouds for a while now, and this is the biggest step yet. Everything I put on this machine is mine, stays where I can see it, and does not depend on a subscription, a terms-of-service update, or a company deciding my photos belong to its training set. I think household computers should become the norm: they give us ownership, permanence and independence over our own data, and most engineers already have the hardware to do it in a drawer.
