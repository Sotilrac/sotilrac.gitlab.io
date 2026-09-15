"""Filtering, deduplication, and quarterly aggregation."""

from __future__ import annotations

import csv
import re
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path

from . import config as cfg
from .sources import Grant


@dataclass
class Design:
    """One deduplicated product, attributed to a silicon vendor."""

    fcc_id: str
    grantee_code: str
    product_code: str
    company: str
    silicon: str
    confidence: str
    quarter: str
    date: str
    description: str
    ble: bool = True


# A 2.4 GHz grant is not necessarily a Bluetooth grant, and Espressif's own
# line is not uniform: ESP8266/8285 and ESP32-S2 are Wi-Fi only with no
# Bluetooth radio at all, while ESP32-H2 is BLE and 802.15.4 with no Wi-Fi.
# Counting the Wi-Fi-only parts as BLE designs overstates Espressif's Bluetooth
# position, so they are excluded. The same test runs against every vendor.
_ESP_WIFI_ONLY = re.compile(
    r"(8266|8285|8089)"           # ESP8266 / ESP8285 / ESP8089
    r"|ESP-?WROOM-?0"             # ESP-WROOM-02 family, all ESP8266
    r"|(ESP|WT)-?32-?S2"          # ESP32-S2 has no Bluetooth
    r"|ESP-?WROOM-?S2|ESP-?WROVER-?S2|WT32S2",
    re.I,
)
_ESP_BLE = re.compile(
    r"ESP-?32|ESPWROOM32|ESPWROVER|WT32"          # ESP32 classic
    r"|(ESP|WT)-?32?-?[CHS][0-9]"                 # C2/C3/C5/C6, S3, H2 series
    r"|ESP-?C[0-9]|ESP-?H[0-9]|ESP-?S3",
    re.I,
)
_OTHER_BLE_PART = re.compile(
    r"NRF5[0-9]|NRF21|MDBT|BMD-?[0-9]|NINA-?B|ANNA-?B|TLSR|EFR32|DA1[45]",
    re.I,
)
_BLE_TEXT = re.compile(r"bluetooth|\bble\b|\bbt\b", re.I)
_WIFI_TEXT = re.compile(r"wi-?fi|wlan|802\.11", re.I)


def is_ble(grant: Grant) -> bool:
    """True if the filing plausibly carries a Bluetooth radio.

    Part number first, because it is unambiguous where it matches: an ESP32-C3
    is BLE-capable however casually its filing describes it as a "WIFI Module",
    and an ESP8266 is not however the filing is worded. Only when the part is
    unrecognised does the description decide.
    """
    part = grant.product_code or ""
    if _ESP_WIFI_ONLY.search(part):
        return False
    if _ESP_BLE.search(part) or _OTHER_BLE_PART.search(part):
        return True

    text = grant.description or ""
    if _BLE_TEXT.search(text):
        return True
    # An unrecognised part whose filing claims only Wi-Fi is taken at its word.
    return not _WIFI_TEXT.search(text)


def in_band(grant: Grant) -> bool:
    """True if any frequency row falls inside the 2.4 GHz ISM band."""
    for row in grant.frequencies:
        if row.low_mhz is None or row.high_mhz is None:
            continue
        if row.high_mhz >= cfg.BAND_LOW_MHZ and row.low_mhz <= cfg.BAND_HIGH_MHZ:
            return True
    return False


def quarter_of(date: str) -> str:
    year, month = int(date[:4]), int(date[5:7])
    return f"{year}Q{(month - 1) // 3 + 1}"


def to_design(grant: Grant, *, window: bool = True) -> Design | None:
    """Apply Step 1 filters and attribute the grant, or return None.

    With `window=False` the analysis date range is not applied. The host stage
    needs that: a module certified in 2016 is still being designed into new
    products today, so restricting the module list to the window would drop
    Raytac's entire MDBT4x/5x line and undercount Nordic host designs.
    """
    if grant.equipment_class not in cfg.EQUIPMENT_CLASSES:
        return None
    if not in_band(grant):
        return None

    date = grant.original_date
    if not date:
        return None
    if window:
        year = int(date[:4])
        if not (cfg.START_YEAR <= year <= cfg.END_YEAR):
            return None

    grantee = cfg.GRANTEE_BY_CODE.get(grant.grantee_code)
    if grantee is None:
        return None
    silicon, confidence, _ = grantee.attribute(grant.product_code)

    return Design(
        ble=is_ble(grant),
        fcc_id=grant.fcc_id,
        grantee_code=grant.grantee_code,
        product_code=grant.product_code,
        company=grantee.company,
        silicon=silicon or cfg.UNKNOWN,
        confidence=confidence,
        quarter=quarter_of(date),
        date=date,
        description=grant.description,
    )


def dedupe(designs: list[Design]) -> list[Design]:
    """Step 4: collapse retests and permissive changes onto one product.

    Keyed on grantee code plus product code, keeping the earliest date, so a
    product that is recertified three times still counts as one design.
    """
    best: dict[tuple[str, str], Design] = {}
    for design in designs:
        key = (design.grantee_code, design.product_code)
        current = best.get(key)
        if current is None or design.date < current.date:
            best[key] = design
    return sorted(best.values(), key=lambda d: (d.date, d.fcc_id))


def quarters(start: int, end: int) -> list[str]:
    return [f"{y}Q{q}" for y in range(start, end + 1) for q in range(1, 5)]


def series(designs: list[Design]) -> dict[str, dict[str, int]]:
    """Counts per quarter per silicon vendor."""
    table: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for design in designs:
        table[design.quarter][design.silicon] += 1
    return table


def write_csv(designs: list[Design], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            [
                "quarter",
                "date",
                "fcc_id",
                "grantee_code",
                "company",
                "product_code",
                "silicon",
                "confidence",
                "ble",
                "description",
            ]
        )
        for d in designs:
            writer.writerow(
                [
                    d.quarter,
                    d.date,
                    d.fcc_id,
                    d.grantee_code,
                    d.company,
                    d.product_code,
                    d.silicon,
                    d.confidence,
                    int(d.ble),
                    d.description,
                ]
            )


def write_series_csv(designs: list[Design], path: Path) -> None:
    table = series(designs)
    vendors = sorted({d.silicon for d in designs})
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(["quarter", *vendors, "total"])
        for q in quarters(cfg.START_YEAR, cfg.END_YEAR):
            row = [table.get(q, {}).get(v, 0) for v in vendors]
            if sum(row) == 0 and q not in table:
                continue
            writer.writerow([q, *row, sum(row)])
