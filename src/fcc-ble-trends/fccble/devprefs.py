"""Developer-preference signals: GitHub repositories and Stack Overflow questions.

These measure something the FCC data cannot. An equipment authorization records
a company shipping a certified product; a GitHub repository records somebody
choosing a chip for a project that may never ship at all. The two answer
different questions and are reported separately rather than combined.

Both sources accept date-bounded queries, so these are real annual series and
not a snapshot. Read the Stack Overflow numbers as ratios rather than levels:
question volume across the whole site fell sharply from 2023 onward, so a
declining tag count says as much about Stack Overflow as about the chip.
"""

from __future__ import annotations

import datetime as dt
import json
import subprocess
import urllib.parse
import urllib.request
from dataclasses import dataclass

from .net import USER_AGENT

STACKEXCHANGE = "https://api.stackexchange.com/2.3/questions"

# One representative search term per vendor. Terms are not summed across
# variants: overlapping queries would double-count repositories that mention
# several part numbers, so each series tracks a single family name.
GITHUB_TERMS = {"Espressif": "esp32", "Nordic": "nrf52"}
STACKOVERFLOW_TAGS = {"Espressif": "esp32", "Nordic": "nrf52"}


@dataclass
class Point:
    year: int
    source: str
    vendor: str
    metric: str
    value: int


def _gh_search(query: str) -> int | None:
    """Count GitHub repositories matching a query, via the authenticated gh CLI."""
    try:
        result = subprocess.run(
            ["gh", "api", "-X", "GET", "search/repositories", "-f", f"q={query}",
             "-f", "per_page=1", "--jq", ".total_count"],
            capture_output=True, text=True, timeout=90,
        )
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return None
    text = result.stdout.strip()
    return int(text) if text.isdigit() else None


def github_repos_created(vendor: str, year: int) -> Point | None:
    term = GITHUB_TERMS[vendor]
    count = _gh_search(f"{term} created:{year}-01-01..{year}-12-31")
    if count is None:
        return None
    return Point(year, "github", vendor, "repos_created", count)


def _epoch(year: int, month: int, day: int) -> int:
    return int(dt.datetime(year, month, day, tzinfo=dt.timezone.utc).timestamp())


def stackoverflow_questions(vendor: str, year: int) -> Point | None:
    tag = STACKOVERFLOW_TAGS[vendor]
    query = urllib.parse.urlencode({
        "site": "stackoverflow",
        "tagged": tag,
        "fromdate": _epoch(year, 1, 1),
        "todate": _epoch(year, 12, 31),
        "filter": "total",
    })
    request = urllib.request.Request(
        f"{STACKEXCHANGE}?{query}",
        headers={"User-Agent": USER_AGENT, "Accept-Encoding": "gzip"},
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            raw = response.read()
            if response.headers.get("Content-Encoding") == "gzip":
                import gzip

                raw = gzip.decompress(raw)
            payload = json.loads(raw)
    except Exception:
        return None
    total = payload.get("total")
    if total is None:
        return None
    return Point(year, "stackoverflow", vendor, "questions_asked", int(total))
