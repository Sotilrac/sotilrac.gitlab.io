---
title: I Tried to Prove ESP32 Beat Nordic
categories:
  - Info
tags:
  - electronics
  - bluetooth
  - python
  - data
---

Every embedded forum I read has decided that Nordic is yesterday's BLE chip and the ESP32 ate its lunch. I believed it too, enough to go looking for evidence, and the FCC seemed like the obvious place to find it: anything with a radio sold in the US has to be authorized, the filings are public, and an equipment authorization database has no marketing to do. So I wrote a program to pull eight years of it and count.

The answer turned out to be more interesting than the hypothesis, and most of what I learned was about how easy it is to measure the wrong thing convincingly.

## The data is not where you would expect

The FCC's own equipment authorization search lives at `apps.fcc.gov/oetcf/eas/reports/GenericSearch.cfm`, and it returns 403 to anything that isn't a browser, courtesy of an Akamai edge rule. The FCC also runs a Socrata open-data portal, which publishes exactly eight equipment-authorization datasets: the grantee registry, the accredited test firms, and the certification bodies. Grants themselves are absent. The one table I wanted was the one table missing.

What does work is enumerating by grantee code. Every company that certifies equipment has one (Espressif is `2AC7Z`, Raytac is `SH6`), the grantee registry maps codes to company names, and the mirrors paginate properly. So the shape of the whole project was forced by what the sources allow: you cannot ask "show me every BLE filing in 2024", but you can ask "show me everything Raytac has filed" and repeat that for every module house you can name.

That constraint matters more than it sounds, and I will come back to it.

## Counting modules measures the wrong thing

My first cut counted new module certifications per vendor per quarter. It produced a tidy table, and the table was close to meaningless.

Raytac is the clearest example. They are one of the largest Nordic module houses, their MDBT42 and MDBT50 parts are in an enormous number of products, and across my 2019 to 2026 window they contributed seven designs. The reason is that MDBT40 was certified in 2014, MDBT42 in 2016, and MDBT50 in 2018. A module gets certified once. It then keeps being designed into new products for a decade without generating another filing, so a date-windowed count of certifications measures how often a vendor releases new part numbers. That is a fact about their product roadmap.

A second problem ran deeper. Espressif sells its own silicon under one grantee code, while Nordic sells no modules at all, so Nordic's volume is scattered across Raytac, u-blox, Ezurio, Fanstel, Insight SiP, Minew and Holyiot, plus chip-down designs that never name the chip in any machine-readable field. Counting grants by grantee undercounts Nordic by construction. When I first noticed that, I was pleased: it meant the easy measurement was biased in favour of my own hypothesis, which is the most dangerous kind of bias to have.

Here is that series anyway, new BLE-capable module part numbers per year:

| Year | Espressif | Nordic | Telink |
| ---- | --------- | ------ | ------ |
| 2019 | 3         | 15     | 9      |
| 2020 | 9         | 34     | 5      |
| 2021 | 2         | 17     | 7      |
| 2022 | 16        | 27     | 5      |
| 2023 | 8         | 27     | 3      |
| 2024 | 6         | 17     | 11     |
| 2025 | 6         | 18     | 7      |

Shenzhen Minew accounts for 47% of the Nordic column. They make beacons and they file a lot of them, so that column describes Minew's paperwork habits more than Nordic's market position.

## Design wins are the host filings

The measurement that means something is the host product. When you put a certified module inside your gadget, your filing has to say "Contains FCC ID: ..." and point at the module. Every one of those references is a real design win, a company that chose that silicon and paid to ship it.

So the program searches the filing-document index for each of 439 BLE modules and collects the products citing them. After deduplicating (one host citing three Nordic modules counts once) that gives 2,744 host references:

| Year | Espressif | Nordic | ESP share |
| ---- | --------- | ------ | --------- |
| 2019 | 18        | 199    | 8%        |
| 2020 | 14        | 183    | 7%        |
| 2021 | 39        | 139    | 22%       |
| 2022 | 104       | 173    | 38%       |
| 2023 | 89        | 156    | 36%       |
| 2024 | 102       | 205    | 33%       |
| 2025 | 197       | 355    | 36%       |

Between 2020 and 2022 Espressif went from under a tenth of US BLE host designs to better than a third, and it has kept that ground since. This is the part of the forum consensus that held up when I tried to break it.

What did not happen is Nordic shrinking. Their absolute count is flat to rising across the same period, and 2025 was their best year in the series. The pie got bigger and Espressif took the new slice.

## The part where the measurement nearly lied to me

I want to be specific about this, because I nearly published a number that was garbage.

The document search splits an FCC ID on hyphens and matches the pieces, so a query for the module `2AN3WM5STAMP-PICO` cheerfully returns any filing containing "PICO". The first time I ran the host stage I got Espressif design wins dated 1998, which is impressive for a chip that launched in 2016 and for a company founded in 2008.

The fix that suggests itself is to drop modules with short, noisy tokens in their part numbers. I tried it, and ESP share jumped to 68%, which would have made a much better headline. It is also completely wrong: that filter throws away 23% of Nordic modules and 1% of Espressif ones, because Nordic part numbers are hyphenated (`BMD-340`, `NINA-B31`, `ISP1807-LR`) and ESP32 part numbers mostly are not. I had built a filter that deleted my opposition.

The defensible filter is chronological: a product cannot contain a module that was certified after the product was. That rule has no opinion about hyphens, and it drops 37% of hits on the Espressif side and 37% on the Nordic side. Identical error rates on both sides is the only reason I trust the share column at all. The absolute numbers are still inflated by whatever false positives survive, and I have no way to measure that without running OCR over several thousand label exhibits, which the mirror publishes as images.

Two reasonable analysts could have finished this with 33% or 68%. The gap between them is entirely filter choice, and neither number has an error bar on it.

## The check that matters

Nordic publishes its own Bluetooth SIG design-win numbers every quarter, which is a different population (global, all Nordic designs, not US filings) but should agree in direction. In Q1 2026 they reported a 32% share of new BLE product certifications; in Q2 2026, 115 designs and 28% for the quarter, with a trailing-twelve-month share of 31% that they note is three times their nearest competitor.

Three times the nearest competitor is not a company being displaced. If my pipeline had shown Nordic collapsing, the pipeline would have been wrong, and I would rather find that out from Nordic's investor relations page than from the comments.

## Where the hypothesis is completely right

The forums are measuring something real. It is just not design wins.

GitHub has 209,018 repositories matching `esp32` and 3,349 matching `nrf52`. Stack Overflow has 3,336 questions tagged `esp32` against 181 tagged `nrf52`. The `esptool` flashing utility is pulled from PyPI 1.3 million times a month. On developer mindshare the ratio runs about 60:1 in Espressif's favour.

Both facts are true at once, and they are answers to different questions. If you are asking which chip the next hobby project, dev board, or crowdfunded gadget will use, the ESP32 won that years ago by a wide margin. If you are asking which chip is inside the shipping, certified, commercially-supported BLE products, Nordic still accounts for roughly two thirds of what I can see, and their own numbers put them at three times the runner-up. A $4 module with Wi-Fi, a huge community and an Arduino core wins prototypes. A part with a mature Zephyr integration, a decade of certified module options and single-digit microamp sleep current wins products.

The hypothesis I started with was that developers are switching from Nordic to ESP32. The closer answer is that a very large number of new developers showed up, they all started on ESP32, and Nordic's business did not notice because it was never selling to them.

## The program

It lives in [`src/fcc-ble-trends/`](https://gitlab.com/sotilrac/sotilrac.gitlab.io/-/tree/master/src/fcc-ble-trends), it is stdlib Python with no dependencies, and it caches every fetched page in SQLite so a second run is almost free. Three stages: `modules` enumerates and parses every filing, `hosts` finds the products citing them, `report` prints the series.

If you run it, read the warnings it prints: how many filings failed to parse, how many modules it could not search, how many results saturated the index cap, and what fraction of host hits it threw out as chronologically impossible. I added every one of those after a bug where a run silently dropped 345 of 632 filings and still exited zero. That is exactly how you end up with a confident blog post about a trend that was never there.
