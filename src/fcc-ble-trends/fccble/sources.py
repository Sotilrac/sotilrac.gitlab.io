"""Source adapters: FCC Socrata registry and the fccid.io mirror.

Why a mirror at all: the FCC's own equipment-authorization search
(apps.fcc.gov/oetcf/eas/reports/GenericSearch.cfm) is behind an Akamai edge
rule that returns 403 to scripted clients, and the FCC's Socrata catalogue
publishes the grantee registry but no grants table. fccid.io mirrors the grant
records and, unlike the FCC, paginates predictably.
"""

from __future__ import annotations

import html
import json
import re
import urllib.parse
from dataclasses import dataclass

from .net import Fetcher

SOCRATA_GRANTEES = "https://opendata.fcc.gov/resource/3b3k-34jp.json"
FCCID = "https://fccid.io"

_TAG = re.compile(r"<[^>]+>")
_WS = re.compile(r"\s+")


def _text(fragment: str) -> str:
    return _WS.sub(" ", html.unescape(_TAG.sub(" ", fragment))).strip()


def _panel(page: str, title: str) -> str:
    """Return the HTML of the panel whose heading matches `title`."""
    start = page.find(f">{title}</h2>")
    if start < 0:
        return ""
    end = page.find('<div class="panel panel-default"', start)
    return page[start : end if end > 0 else len(page)]


def _rows(panel: str) -> dict[str, str]:
    """Parse a `<tr><th>key</th><td>value</td></tr>` metadata table."""
    out: dict[str, str] = {}
    for key, value in re.findall(r"<th>(.*?)</th>\s*<td[^>]*>(.*?)</td>", panel, re.S):
        out[_text(key)] = _text(value)
    return out


# --- Grantee registry ------------------------------------------------------


def lookup_grantee(fetcher: Fetcher, code: str) -> dict[str, str] | None:
    """Fetch one grantee registration record from the FCC Socrata dataset."""
    query = urllib.parse.urlencode(
        {"grantee_code": code, "$limit": 1},
        quote_via=urllib.parse.quote,
    )
    status, body = fetcher.get(f"{SOCRATA_GRANTEES}?{query}")
    if status != 200:
        return None
    try:
        records = json.loads(body)
    except json.JSONDecodeError:
        return None
    return records[0] if records else None


# --- Grant records ---------------------------------------------------------


@dataclass
class FrequencyRow:
    low_mhz: float | None
    high_mhz: float | None
    purpose: str
    date: str  # ISO yyyy-mm-dd


@dataclass
class Grant:
    fcc_id: str
    grantee_code: str
    product_code: str
    description: str
    equipment_class: str  # three-letter code, e.g. DTS
    frequencies: list[FrequencyRow]

    @property
    def earliest_date(self) -> str | None:
        dates = [f.date for f in self.frequencies if f.date]
        return min(dates) if dates else None

    @property
    def original_date(self) -> str | None:
        """Date of the original authorization, ignoring later permissive changes."""
        dates = [
            f.date
            for f in self.frequencies
            if f.date and "original" in f.purpose.lower()
        ]
        return min(dates) if dates else self.earliest_date


_FREQ = re.compile(r"([\d.]+)\s*(?:-\s*([\d.]+))?\s*MHz", re.I)


def _parse_freq(cell: str) -> tuple[float | None, float | None]:
    match = _FREQ.search(cell)
    if not match:
        return None, None
    low = float(match.group(1))
    high = float(match.group(2)) if match.group(2) else low
    return low, high


def list_grantee_ids(fetcher: Fetcher, code: str) -> list[str]:
    """Enumerate every FCC ID filed under a grantee code, following pagination."""
    ids: list[str] = []
    seen: set[str] = set()
    page = 1
    while True:
        url = f"{FCCID}/{code}" if page == 1 else f"{FCCID}/{code}/page/{page}"
        status, body = fetcher.get(url)
        if status != 200 or not body:
            break

        found = [
            fid
            for fid in re.findall(rf'href="/({re.escape(code)}[A-Za-z0-9\-_]+)"', body)
            if fid not in seen
        ]
        for fid in found:
            seen.add(fid)
            ids.append(fid)

        total = re.search(r"Page\s+(\d+)\s+of\s+(\d+)", _text(body))
        if not total or page >= int(total.group(2)):
            break
        page += 1
    return ids


def fetch_grant(fetcher: Fetcher, fcc_id: str) -> Grant | None:
    """Fetch and parse one FCC ID's grant record."""
    status, body = fetcher.get(f"{FCCID}/{fcc_id}")
    if status != 200 or not body:
        return None

    application = _rows(_panel(body, "Application Information"))
    details = _rows(_panel(body, "FCC ID Device Details"))

    # In the application panel "Equipment Class" is the FCC class code
    # ("DTS - Digital Transmission System"); in the details panel the same
    # label holds a free-text device description. Only the former is wanted.
    raw_class = application.get("Equipment Class", "")
    class_match = re.match(r"\s*([A-Z]{3})\b", raw_class)
    equipment_class = class_match.group(1) if class_match else ""

    frequencies: list[FrequencyRow] = []
    freq_panel = _panel(body, "Operating Frequencies")
    for row in re.findall(r"<tr>(.*?)</tr>", freq_panel, re.S):
        cells = [_text(c) for c in re.findall(r"<td[^>]*>(.*?)</td>", row, re.S)]
        if len(cells) < 3:
            continue
        low, high = _parse_freq(cells[0])
        frequencies.append(FrequencyRow(low, high, cells[1], cells[2]))

    if not frequencies and application.get("Final Action Date"):
        low, high = _parse_freq(application.get("Frequency Range", ""))
        frequencies = [
            FrequencyRow(
                low,
                high,
                application.get("Application Purpose", ""),
                application["Final Action Date"],
            )
        ]

    grantee_code = details.get("Grantee Code", "")
    product_code = details.get("Product Code", "")
    if not grantee_code:
        return None

    return Grant(
        fcc_id=fcc_id,
        grantee_code=grantee_code,
        product_code=product_code,
        description=details.get("Equipment Class", "") or application.get("Device Description", ""),
        equipment_class=equipment_class,
        frequencies=frequencies,
    )
