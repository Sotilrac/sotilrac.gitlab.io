---
author: Carlos
title: Who Owns Massachusetts
categories:
  - Software
tags:
  - gis
  - sqlite
  - web
  - data
  - massachusetts
---

Massachusetts publishes who owns every parcel of land in the state. It publishes it 351 times, once per municipality, each through its own assessor portal with its own search box and a hard stop at the town line. If someone owns three triple-deckers in Quincy, a strip mall in Brockton, and a lot on the Cape, no portal will tell you, because none of them can see past its own border.

So I stitched them together. [MassParcels](https://massparcels.asmat.ca) loads the [MassGIS statewide parcel layer](https://www.mass.gov/info-details/massgis-data-property-tax-parcels), about 2.56 million parcels, into one database and searches across all of it. Type a name and you get everything that person holds anywhere in the state, with the totals already summed: parcel count, assessed value, land and building, and the towns they hold in. Click a parcel and you get the assessor record, the last sale with book and page, a link to the deed, the FEMA flood zone, and the Census statistics for the tract. The [source is on GitLab](https://gitlab.com/sotilrac/mass-parcels) under the AGPL.

<!-- TODO: screenshot of an owner's holdings page or the Insights view -->

## The Hard Part

Assessor records store owner names as free text. The same person shows up as `SMITH JOHN`, `SMITH JOHN M` and `SMITH JOHN & MARY`, while two unrelated people in two towns share one spelling exactly, so grouping by name gets both cases wrong. MassParcels clusters on name plus mailing address, which collapses one person's parcels across town lines and keeps strangers apart. The snapshot has 1.97 million distinct name strings and resolves them into 2.19 million owners, and that is the right direction: disambiguation should produce more owners than names, because most shared names are shared by strangers. The cases no rule can reach (a family trust and the couple behind it, a holding company and its parent) get curated by hand and baked into the published data.

## Perspective

The part I keep coming back to is the Insights page, which needs no account. The state's parcels are assessed at $2.12 trillion in total. Individuals hold 1.96 million of them, trusts 269 thousand, companies and institutions 215 thousand, and government 86 thousand. The largest single owner by both count and value is the Commonwealth itself, followed by value by Harvard, MIT, the City of Boston, and Boston University, which tells you something about who the landlords of Greater Boston are. Out-of-state mailing addresses cover 117 thousand parcels. Boston accounts for 180 thousand of them, more than Worcester, Springfield, Plymouth and Newton put together, and the median year built statewide is 1960.

None of this is secret; every number comes from records a municipality is required to publish. What changes when you put it all in one place is that ownership becomes a list of names with sums next to them, and the distribution of wealth in the state becomes something you can click into, down to the parcel, instead of a chart in a report. That is a different experience from reading that the top one percent own some fraction of something.

## How It Runs for Free

No server does the searching. The published snapshot is a 2.6 GB SQLite file in Cloudflare R2, and the browser queries it over HTTP range requests with sql.js-httpvfs, pulling in only the pages a query touches, so a statewide owner search reads a few dozen kilobytes. Making that fast was most of the engineering: parcels are physically ordered by owner so a portfolio is one contiguous read, the full-text indexes are built without stored content or column sizes so they page in small, and two covering indexes include the displayed columns so a result list never chases scattered rows. That last one took a map-area search from 411 range requests down to 7, which on a phone is the difference between minutes and under a second. The only server-side code is a small Worker that checks the session on each range read and stores saved parcels. Hosting costs $0.

## Why You Need an Invitation

I meant to publish it open. Then I showed it to people, and nearly every one of them said some version of the same thing: this is a powerful tool, please don't put it on the internet for anyone to use. Type a name, get a home address and everything that person owns, statewide, in a second, on your phone. The information is public, but the public has never had it this conveniently, and convenience is the difference between a records request and a stalking aid.

So the tool is split. Insights are open to anyone, because an aggregate names no one. Searching owners and addresses needs an account, and accounts are by invitation: only addresses I have authorized can sign in, there are no passwords (passkeys, or a one-time code by email), and an address I have not authorized gets an application form instead of an error. If you want it, you have two options. Build it yourself from the repo (the sync pulls the statewide layer in a few minutes and the workbench runs on a laptop), or [ask me for access](https://massparcels.asmat.ca) and tell me what you want it for.
