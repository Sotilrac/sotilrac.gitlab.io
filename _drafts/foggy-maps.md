---
title: Foggy Maps
categories:
  - Projects
tags:
  - android
  - kotlin
  - gps
  - maps
  - f-droid
---

My brother told me he wanted to walk more and explore new places, but that he would need a fully gamified app to make it stick: something that shows where he has been, like the fog of war in a strategy game, so that new streets are the ones still hidden. To which I said "say no more!" and started designing an Android app. He did say one more thing: "call it Foggy Maps."

{% fig "/img/blog/foggy-maps/map.jpg", "Cleared streets under the violet fog, with the explored-area readout" %}

## Fog of War

The world starts under a violet fog. Walk, ride, or drive, and the fog lifts along your path, permanently, with dithered edges like the pixel-art games the idea comes from. Each GPS fix clears a disc sized by the accuracy the receiver reports: a precise fix clears a small disc, a rough one clears a larger one, and a vague fix is thrown away rather than smearing a blob over three blocks. Cleared ground never re-fogs, so the map becomes a lifetime record of where you have been.

The fog is drawn by a GPU shader as a 4×4 Bayer dither, pixel-locked at every zoom, in a violet no terrain colour can reach. That last part is a rule: the map owns blue, green, tan, gold and red, and the fog owns violet, so a half-cleared cell never reads as a lake or a field. It took a while to land on a colour that was recognisably fog and not something on the map.

## Rewarding New Ground

The gamification has one rule: XP comes from newly revealed area only. Walking the same route to the coffee shop adds no XP; the only way up is outward. There are no streaks, no daily reminders, and no congratulations for leaving the house: the app is supposed to notice what is new and stay quiet about the routine. Everything can be hidden if you just want the map.

The level ladder is cumulative cleared area compared with real places, so the numbers mean something. Clear 1.5 km² and you have covered Hyde Park; 3.4 km² is Central Park; 59 km² is Manhattan; 105 km² is Paris. Luxembourg, at 2,586 km², is about as far as a dedicated lifetime user with imported history will get, and the ladder keeps going through Long Island and Kuwait to Sicily at level 36, which will stay empty, and that is fine. Alongside the levels, a passport collects a dated stamp for the first visit to each city, region and country, plus landmark stamps for clearing the fog over named features and badges for themed sets. Landmark and badge packs are plain JSON files loaded at runtime, so a new pack does not need an app update.

## Under the Fog

The data lives in three layers, and the split is the most important design decision in the app. Raw track points are precious: ordered rows in SQLite, exported in every backup, never touched by anything downstream. The fog heatmap is a cache, versioned and disposable, and the app can throw it away and rebuild it from the points whenever the reveal rules change. The fog you see is presentation on top of that. Stamps, photos and landmarks are user-authored events stored with the raw layer, so a rebuild keeps them.

A blank map is a discouraging start, so the app imports GPX and Google Timeline history, and the years of location data Google collected on you become a head start. Replaying a decade of points on a phone is slow, so a desktop tool does the same computation, resolves which city and country each visited tile falls in with one Overpass query per town and a point-in-polygon test for everything after, and writes the result back into the backup. Importing that archive is the ordinary restore.

Everything runs on the device. There is no account, no server of mine, no analytics. The map opens fogged with no permission prompts; each permission is requested the moment you turn on the feature that needs it. Map tiles and terrain come from OpenStreetMap servers by default, which discloses your rough location to them, and that can be switched off, after which the app makes no network requests at all. Backups can go to your own Nextcloud over WebDAV, and to no other server.

## Where to Get It

Foggy Maps is on [F-Droid](https://f-droid.org/packages/ca.asmat.foggymaps/) and the [source is on GitLab](https://gitlab.com/sotilrac/foggy-maps) under the AGPL. Getting through the F-Droid submission process is where the `fdroid-publish` skill from [Mad Skills](/blog/mad-skills/) came from. The next feature is Walk Together: two phones that confirm they are near each other over Bluetooth earn a wider reveal for as long as they stay together, without exchanging a single location, because the app only rewards its own track.

Surprisingly, the app is fun. My brother and I have been using it consistently for months, and the pull outward is real: I now take the street I have not cleared yet, on purpose. The refreshing part is quieter than that, though. It is an app that keeps track of where you have been without selling your data or nagging you about exciting new features, and I had forgotten what that felt like.
