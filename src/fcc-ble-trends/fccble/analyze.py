"""Filtering, deduplication, and quarterly aggregation."""

from __future__ import annotations

import csv
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


def to_design(grant: Grant) -> Design | None:
    """Apply Step 1 filters and attribute the grant, or return None."""
    if grant.equipment_class not in cfg.EQUIPMENT_CLASSES:
        return None
    if not in_band(grant):
        return None

    date = grant.original_date
    if not date:
        return None
    year = int(date[:4])
    if not (cfg.START_YEAR <= year <= cfg.END_YEAR):
        return None

    grantee = cfg.GRANTEE_BY_CODE.get(grant.grantee_code)
    if grantee is None:
        return None
    silicon, confidence, _ = grantee.attribute(grant.product_code)

    return Design(
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
