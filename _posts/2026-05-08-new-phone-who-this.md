---
layout: layouts/post.njk
author: Carlos
title: "New phone. Who this?"
status: public
categories:
  - Software
tags:
  - android
  - privacy
  - linux
date: 2026-05-08T12:00:00-04:00
---

New phone day! I keep choosing OnePlus because the hardware is powerful, the macro camera is the best I have used on a phone, and out of the box ColorOS feels closer to stock Android than what Samsung ships. Of the mainstream Android options, it is one of the cleaner experiences. Oh, and it doesn't cost $1M.

"Relatively clean" still leaves a lot of room for improvement. My new OnePlus 15 ships with ColorOS V16 on Android 16, and ColorOS arrives sporting a thick coat of preinstalled ~~crap~~ telemetry, AI assistants, behavioural-prediction services, HeyTap account plumbing (yes, they really called it "Tap"... like "wire tap"... at least they're honest), a silent Facebook stack, and a Microsoft cross-device broker for good measure. None of that needs to be running, and only a few of these _features_ can be uninstalled through the launcher.

What you can do, without rooting or unlocking the bootloader (either of which would lock you out of every banking app), is this:

```bash
adb shell pm disable-user --user 0 <package>
```

This disables the target package but keeps it on disk, OTA updates still apply, and you can re-enable any of it with one command if something breaks:

```bash
adb shell pm enable --user 0 <package>
```

The trick is knowing what to disable and committing the list to a script so the next phone takes ten minutes instead of an evening. Some of these hidden packages are intimately related to how the phone works, and disabling them may result in performance issues or dreaded boot loops.

I keep my list as a GitLab snippet: <https://gitlab.com/-/snippets/5990599>. It is verified against CPH2749 (OnePlus 15) on Android 16 / ColorOS V16, with legacy entries from my OnePlus 11 / OxygenOS 13 list left in case it is useful to someone else.

## The script

This is just the shape, with most of the package list elided. Grab the full version from [the snippet](https://gitlab.com/-/snippets/5990599) before running it.

```bash
#!/usr/bin/env bash
set -euo pipefail

PKGS=(
  # --- Oplus telemetry / diagnostics / analytics ---
  com.oplus.statistics.rom
  com.oplus.stdid
  com.oplus.stdsp
  com.oplus.metis

#######################
# 50 lines later...
#######################

  # --- OnePlus account / cloud ---
  com.oneplus.account
  com.oneplus.oshare
  com.oneplus.colorx

  # --- Facebook silent preinstall stack ---
  com.facebook.appmanager
  com.facebook.services
  com.facebook.system

  # --- Google bits ---
  com.google.android.gms.location.history
  com.google.android.gms.supervision
  com.google.android.apps.bard
  com.google.android.youtube
  com.google.android.devicelockcontroller
  com.google.android.adservices.api
  com.google.android.federatedcompute
  com.google.android.ondevicepersonalization.services

  # --- Microsoft cross-device ---
  com.microsoft.deviceintegrationservice
  com.microsoftsdk.crossdeviceservicebroker
)

if ! adb get-state >/dev/null 2>&1; then
  echo "No device connected or adb unauthorised." >&2
  exit 1
fi

for pkg in "${PKGS[@]}"; do
  if ! adb shell "pm list packages $pkg" 2>/dev/null | grep -qx "package:$pkg"; then
    echo "  [-] not installed: $pkg"
    continue
  fi
  if adb shell "pm disable-user --user 0 $pkg" >/dev/null 2>&1; then
    echo "  [x] disabled:      $pkg"
  else
    echo "  [!] failed:        $pkg"
  fi
done
```

## What it does on a (semi) fresh OnePlus 15

The list below is the proverbial _junk_ that will.i.am was asking Fergie about. This is the junk I found inside my trunk.

```text
List of devices attached
32GS135Y4S16G145    device

  [x] disabled:      com.oplus.statistics.rom
  [x] disabled:      com.oplus.stdid
  [x] disabled:      com.oplus.stdsp
  [x] disabled:      com.oplus.metis
  [x] disabled:      com.oplus.atlas
  [x] disabled:      com.oplus.dmp
  [x] disabled:      com.oplus.crashbox
  [x] disabled:      com.oplus.onetrace
  [x] disabled:      com.oplus.qualityprotect
  [x] disabled:      com.oplus.olc
  [x] disabled:      com.oplus.logkit
  [x] disabled:      com.oplus.nhs
  [x] disabled:      com.oplus.trafficmonitor
  [x] disabled:      com.oplus.powermonitor
  [x] disabled:      com.oplus.notificationmanager
  [x] disabled:      com.oplus.deepthinker
  [-] not installed: com.oplus.appbooster
  [x] disabled:      com.oplus.smartengine
  [x] disabled:      com.oplus.mediaturbo
  [x] disabled:      com.oplus.aimemory
  [x] disabled:      com.oplus.appplatform
  [x] disabled:      com.oplus.obrain
  [x] disabled:      com.oplus.appsense
  [x] disabled:      com.oplus.pantanal.ums
  [x] disabled:      com.oplus.aicall
  [x] disabled:      com.oplus.aiwriter
  [x] disabled:      com.oplus.omoji
  [x] disabled:      com.oplus.location
  [x] disabled:      com.oplus.locationproxy
  [x] disabled:      com.oplus.cell.map
  [x] disabled:      com.oplus.beaconlink
  [x] disabled:      com.oplus.networksense
  [x] disabled:      com.oplus.sense.netprediction
  [x] disabled:      com.oplus.sense.netscore
  [x] disabled:      com.oplus.cellularqoe
  [x] disabled:      com.oplus.tai.wifiqoe
  [x] disabled:      com.oplus.tai.borderpresearch
  [x] disabled:      com.oplus.nwestimate
  [x] disabled:      com.heytap.mcs
  [x] disabled:      com.heytap.htms
  [-] not installed: com.heytap.browser
  [x] disabled:      com.heytap.market.overlay
  [x] disabled:      com.heytap.accessory
  [x] disabled:      com.heytap.mydevices
  [x] disabled:      com.coloros.colordirectservice
  [x] disabled:      com.coloros.ocs.opencapabilityservice
  [x] disabled:      com.coloros.bootreg
  [x] disabled:      com.coloros.activation
  [x] disabled:      com.oneplus.account
  [x] disabled:      com.oneplus.membership
  [x] disabled:      net.oneplus.weather
  [x] disabled:      com.oneplus.oshare
  [x] disabled:      com.oneplus.colorx
  [x] disabled:      com.facebook.appmanager
  [x] disabled:      com.facebook.services
  [x] disabled:      com.facebook.system
  [x] disabled:      com.google.android.gms.location.history
  [!] failed:        com.google.android.gms.supervision
  [x] disabled:      com.google.android.apps.bard
  [-] not installed: com.google.android.apps.googleassistant
  [x] disabled:      com.google.android.youtube
  [x] disabled:      com.google.android.apps.walletnfcrel
  [x] disabled:      com.google.android.apps.nbu.files
  [x] disabled:      com.google.android.devicelockcontroller
  [x] disabled:      com.google.android.adservices.api
  [x] disabled:      com.google.android.federatedcompute
  [x] disabled:      com.google.android.ondevicepersonalization.services
  [x] disabled:      com.microsoft.deviceintegrationservice
  [x] disabled:      com.microsoftsdk.crossdeviceservicebroker

Done. disabled=65 absent=3 failed=1
```

Sixty-five processes I never asked for, silently running on a phone that follows me everywhere, every day. Truly scary.

For the keen observer, the three absent are legacy packages that were never installed on this device (`com.oplus.appbooster`, `com.heytap.browser`, `com.google.android.apps.googleassistant`, the latter superseded by Gemini). The one failure is `com.google.android.gms.supervision`, which is locked down by Play Services and not worth fighting.

Disabling these has some minor caveats:

- `com.oplus.cell.map` removes cell-based location estimates, so first GPS fix can be a touch slower.
- `com.heytap.accessory` can break OnePlus Buds seamless pairing; manual Bluetooth pairing still works.
- `com.oneplus.oshare` kills O-Share. I use [KDE Connect](https://kdeconnect.kde.org/) anyway.
- `com.heytap.mcs` cuts HeyTap push, which apparently matters for a handful of Chinese-market apps.
- `com.google.android.youtube` removes the YouTube app. When I need YouTube, I open [Firefox](https://www.mozilla.org/firefox/) behind [uBlock Origin](https://ublockorigin.com/); the only viable way to watch YouTube since they decided they mostly want you to watch ads between a few videos.
- The Google APEX entries (`adservices.api`, `federatedcompute`, `ondevicepersonalization.services`) are kernel-managed and probably don't actually end up disabled.

I hope that one day we can buy useful mobile devices that serve a utilitarian purpose for the user: not addictive tracking machines that exploit our human vulnerabilities, and that we sadly need for everyday life.
