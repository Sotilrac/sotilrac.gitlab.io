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

Every embedded forum I read has decided that Nordic is yesterday's BLE chip and the ESP32 ate its lunch. I believed it too, enough to go looking for evidence, and the FCC seemed like the obvious place to find it: anything with a radio sold in the US has to be authorized, the filings are public, and an equipment authorization database has no marketing to do. So I wrote a program to pull a decade of it and count.

I got an answer. I also got a long lesson in how a dataset can hand you a confident number that means nothing at all, which turned out to be the more useful result.

## The data is not where you would expect

The FCC's own equipment authorization search lives at `apps.fcc.gov/oetcf/eas/reports/GenericSearch.cfm`, and it returns 403 to anything that isn't a browser, courtesy of an Akamai edge rule. The FCC also runs a Socrata open-data portal, which publishes exactly eight equipment-authorization datasets: the grantee registry, the accredited test firms, and the certification bodies. Grants themselves are absent. The one table I wanted was the one table missing.

What does work is enumerating by grantee code. Every company that certifies equipment has one (Espressif is `2AC7Z`, Raytac is `SH6`), the grantee registry maps codes to company names, and the mirrors paginate properly. So the shape of the whole project was forced by what the sources allow: you cannot ask "show me every BLE filing in 2024", but you can ask "show me everything Raytac has filed" and repeat that for every module house you can name. That gave me 807 filings across 22 grantee codes, all of which parsed.

## Counting modules measures the wrong thing

My first cut counted new module certifications per vendor per quarter. It produced a tidy table, and the table was close to meaningless.

Raytac is the clearest example. They are one of the largest Nordic module houses, their MDBT42 and MDBT50 parts are in an enormous number of products, and across my 2019 to 2026 window they contributed seven designs. The reason is that MDBT40 was certified in 2014, MDBT42 in 2016, and MDBT50 in 2018. A module gets certified once. It then keeps being designed into new products for a decade without generating another filing, so a date-windowed count of certifications measures how often a vendor releases new part numbers. That is a fact about their product roadmap.

Sorting out which parts even belong in the count took more care than I expected. Espressif's line is not uniform: the ESP8266 and ESP8285 have no Bluetooth radio at all, the ESP32-S2 dropped it, the ESP32-S3 and the C and H series have it, and filings describe all of them with equal carelessness (an ESP32-C3 module is routinely filed as a "WIFI Module"). The part number has to overrule the description, and the same test has to run against every vendor or the comparison tilts.

Here is that series, new BLE-capable module part numbers per year:

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

## The measurement I wanted, and could not have

The number that would settle the argument is the host product. When you put a certified module inside your gadget, your filing has to include a line saying `Contains FCC ID: XPYNINAW13`, pointing at the module. Every one of those is a real design win: a company that chose that silicon and paid to ship it.

The mirror indexes the text of filing documents, so I searched it for each of 439 BLE modules and collected the products citing them. The result was a clean series showing Espressif climbing from 8% of US BLE host designs in 2019 to 36% in 2025. I nearly published it.

Then I noticed the search was returning Espressif design wins dated 1998, which is impressive for a chip that launched in 2016 and a company founded in 2008. The index does not match an FCC ID as a unit. It splits on hyphens and matches the pieces, so a query for the Minew module `2ABU6-S2` matches any filing anywhere that says "S2".

The obvious repair is to drop modules with short, noisy part numbers. I tried it and Espressif's share jumped to 68%, which would have made a much better headline and is entirely an artifact: that filter discards 23% of Nordic modules against 1% of Espressif's, because Nordic part numbers are hyphenated and short (`BMD-340`, `2ABU6-S2`, `NINA-B31`) while ESP32 part numbers are long and distinctive (`ESP32-WROOM-32UE`). I had built a filter that deleted my opposition.

So I went and checked. The declaration lives in the filing's exhibits, which the mirror publishes as scanned PDFs, so the program now downloads them, rasterises the pages, runs OCR, and looks for the module's ID. On a random sample of 40 references, split evenly between the two vendors:

| Module part number    | Confirmed |
| --------------------- | --------- |
| 4 characters or fewer | 0 / 18    |
| 5 to 8 characters     | 0 / 12    |
| 9 characters or more  | 3 / 10    |

Fifteen percent for Espressif, zero for Nordic. The three that checked out were `XPYNINAW13`, `2AC7Z-ESPWROOM32UE` and `2AC7Z-ESPS3WROOM1U`, all long and unmistakable. Where I could read a host's label and see what it actually declared, it usually named some other module entirely, or named none at all.

This is the part I would keep. The search only works for distinctive part numbers, and part-number conventions are a house style: 23% of the Nordic-side modules have product codes of four characters or fewer, against 1% of Espressif's. Every filter that makes the data trustworthy also makes it biased, in Espressif's favour, because Nordic's suppliers name their parts in a way this index cannot handle. Two reasonable analysts could have finished with 33% or 68% off the same corpus, and neither would have measured anything.

I cannot tell you the design-win split from FCC data, and neither can anyone else working from this index.

## What the vendor's own books say

Nordic publishes Bluetooth SIG design-win numbers every quarter. It counts a different population (global, all Nordic designs, not US filings), so the levels are not comparable to anything above, but it has the one property my pipeline lacks: the designs were counted directly. In Q1 2026 they reported a 32% share of new BLE product certifications. In Q2 2026, 115 designs and 28% for the quarter, with a trailing-twelve-month share of 31% that they note is three times their nearest competitor.

Three times the nearest competitor is not a company being displaced. Whatever is happening to Nordic, it is not the collapse the forums describe, and I would rather learn that from their investor relations page than from my own pipeline agreeing with me.

## Where the hypothesis is completely right

The forums are measuring something real. It is developer attention, and on that the numbers are not close.

New GitHub repositories created each year:

| Year | Espressif | Nordic | Ratio |
| ---- | --------- | ------ | ----- |
| 2016 | 224       | 87     | 3:1   |
| 2018 | 3,380     | 260    | 13:1  |
| 2020 | 7,908     | 420    | 19:1  |
| 2022 | 12,740    | 263    | 48:1  |
| 2024 | 23,249    | 284    | 82:1  |
| 2025 | 48,001    | 392    | 122:1 |

Over the same decade Stack Overflow questions moved from 3:1 to roughly 39:1 before the site's overall volume collapsed and made the absolute counts useless. ESP32 repository creation grew by a factor of 360. Nordic's grew by six.

Both things are true at once. If you are asking which chip the next hobby project, dev board or crowdfunded gadget will use, the ESP32 won that years ago by a wide margin. If you are asking which chip is inside shipping, certified, commercially supported BLE products, the only trustworthy number I have puts Nordic at three times its closest rival. A $4 module with Wi-Fi, a huge community and an Arduino core wins prototypes. A part with a mature Zephyr integration, a decade of certified module options and single-digit microamp sleep current wins products.

The hypothesis I started with was that developers are switching from Nordic to ESP32. The closer answer is that an enormous number of new developers showed up, they all started on ESP32, and Nordic's business did not notice because it was never selling to them.

## The program

It lives in [`src/fcc-ble-trends/`](https://gitlab.com/sotilrac/sotilrac.gitlab.io/-/tree/master/src/fcc-ble-trends), it is stdlib Python with no dependencies, and it caches every fetched page in SQLite so a second run is almost free. Five stages: `modules` enumerates and parses every filing, `hosts` finds products citing them, `verify` OCR-checks a sample of those claims, `devprefs` pulls the GitHub and Stack Overflow series, and `report` prints everything.

If you run it, read the warnings. It tells you how many filings failed to parse, how many modules it could not search, how many results saturated the index cap, what fraction of host hits it threw out as chronologically impossible, and what the OCR made of a sample. I added every one of those after a bug where a run silently dropped 345 of 632 filings and still exited zero. That is exactly how you end up with a confident blog post about a trend that was never there.
