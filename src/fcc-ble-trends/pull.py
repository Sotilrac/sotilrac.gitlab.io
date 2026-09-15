#!/usr/bin/env python3
"""Pull FCC equipment-authorization data and build a quarterly BLE silicon series.

Stages run in order and each caches to disk, so a re-run is cheap:

    ./pull.py modules          enumerate and parse every module grant
    ./pull.py hosts            find host filings citing those modules
    ./pull.py report           aggregate and print the series

    ./pull.py all              modules + report (hosts is opt-in; it is slow)

Output lands in ./out as CSV.
"""

from __future__ import annotations

import argparse
import csv
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from fccble import analyze, config as cfg, hosts as hostmod, sources
from fccble.net import Cache, Fetcher

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "out"
CACHE = ROOT / ".cache" / "fcc.sqlite"


def build_fetcher(args: argparse.Namespace) -> Fetcher:
    return Fetcher(Cache(CACHE), delay=args.delay, verbose=args.verbose)


# --- Stages ----------------------------------------------------------------


def stage_modules(fetcher: Fetcher, args: argparse.Namespace) -> list[analyze.Design]:
    """Enumerate every grantee's filings and parse them into designs."""
    all_ids: list[tuple[str, str]] = []
    for grantee in cfg.GRANTEES:
        ids = sources.list_grantee_ids(fetcher, grantee.code)
        print(f"  {grantee.code:6s} {grantee.company[:38]:40s} {len(ids):5d} filings", flush=True)
        all_ids.extend((grantee.code, fid) for fid in ids)

    print(f"\nfetching {len(all_ids)} grant records ...", flush=True)
    grants: list[sources.Grant] = []

    def work(item: tuple[str, str]) -> sources.Grant | None:
        return sources.fetch_grant(fetcher, item[1])

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for index, grant in enumerate(pool.map(work, all_ids), 1):
            if grant is not None:
                grants.append(grant)
            if index % 250 == 0:
                print(f"  {index}/{len(all_ids)}", flush=True)

    designs = [d for d in (analyze.to_design(g) for g in grants) if d is not None]
    designs = analyze.dedupe(designs)

    # The full module list ignores the date window; the host stage searches it
    # so that pre-2019 modules still in active design-in are not dropped.
    everything = [d for d in (analyze.to_design(g, window=False) for g in grants) if d is not None]
    analyze.write_csv(analyze.dedupe(everything), OUT / "modules-all.csv")

    analyze.write_csv(designs, OUT / "designs.csv")
    analyze.write_series_csv(designs, OUT / "series.csv")
    print(f"\n{len(grants)}/{len(all_ids)} grants parsed -> {len(designs)} in-band deduplicated designs")

    missing = len(all_ids) - len(grants)
    if missing:
        print(
            f"\nWARNING: {missing} filings did not parse "
            f"({len(fetcher.failures)} fetch failures). The series is incomplete; "
            f"re-run to retry them before trusting the numbers."
        )
    return designs


def load_designs(name: str = "designs.csv") -> list[analyze.Design]:
    path = OUT / name
    if not path.exists():
        sys.exit("no designs.csv; run `./pull.py modules` first")
    with path.open(encoding="utf-8") as handle:
        return [
            analyze.Design(
                fcc_id=r["fcc_id"],
                grantee_code=r["grantee_code"],
                product_code=r["product_code"],
                company=r["company"],
                silicon=r["silicon"],
                confidence=r["confidence"],
                quarter=r["quarter"],
                date=r["date"],
                description=r["description"],
                ble=r.get("ble", "1") == "1",
            )
            for r in csv.DictReader(handle)
        ]


def stage_hosts(fetcher: Fetcher, args: argparse.Namespace) -> None:
    """Search for host filings citing each module (slow, indicative only)."""
    designs = load_designs("modules-all.csv")
    targets = [d for d in designs if d.silicon in cfg.PRIMARY]
    if args.limit:
        targets = targets[: args.limit]
    print(f"searching hosts for {len(targets)} modules ...", flush=True)

    rows: list[tuple[str, hostmod.HostReference]] = []
    capped = 0
    unqueried: list[analyze.Design] = []

    def work(design: analyze.Design):
        return design, hostmod.find_hosts(fetcher, design.fcc_id, design.grantee_code)

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for index, (design, (refs, hit_cap)) in enumerate(pool.map(work, targets), 1):
            capped += 1 if hit_cap else 0
            if refs is None:
                unqueried.append(design)
            else:
                rows.extend((design.silicon, ref) for ref in refs)
            if index % 100 == 0:
                print(f"  {index}/{len(targets)}", flush=True)

    # One host may cite several modules of the same vendor; count it once.
    unique: dict[tuple[str, str], tuple[str, hostmod.HostReference]] = {}
    for silicon, ref in rows:
        key = (silicon, ref.host_fcc_id)
        existing = unique.get(key)
        if existing is None or ref.date < existing[1].date:
            unique[key] = (silicon, ref)

    OUT.mkdir(parents=True, exist_ok=True)
    with (OUT / "hosts.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(["quarter", "silicon", "host_fcc_id", "host_company", "module_fcc_id", "date"])
        for silicon, ref in sorted(unique.values(), key=lambda x: x[1].date):
            if not ref.date:
                continue
            writer.writerow(
                [analyze.quarter_of(ref.date), silicon, ref.host_fcc_id, ref.host_company, ref.module_fcc_id, ref.date]
            )
    if unqueried:
        with (OUT / "hosts-unqueried.csv").open("w", newline="", encoding="utf-8") as handle:
            writer = csv.writer(handle)
            writer.writerow(["fcc_id", "company", "silicon", "reason"])
            for d in unqueried:
                writer.writerow([d.fcc_id, d.company, d.silicon, "search returned 503"])

    print(f"\n{len(unique)} unique host references written")
    if unqueried:
        by_vendor: dict[str, int] = {}
        for d in unqueried:
            by_vendor[d.silicon] = by_vendor.get(d.silicon, 0) + 1
        detail = ", ".join(f"{v}: {n}" for v, n in sorted(by_vendor.items()))
        print(
            f"UNQUERIED: {len(unqueried)}/{len(targets)} modules could not be searched "
            f"({detail}); their hosts are missing from the series entirely"
        )
    if capped:
        print(f"WARNING: {capped}/{len(targets)} module queries hit the index cap; counts are lower bounds")


# --- Reporting -------------------------------------------------------------


def bar(value: int, scale: float, width: int = 28) -> str:
    return "#" * min(width, int(round(value * scale)))


def stage_report(args: argparse.Namespace) -> None:
    designs = load_designs()
    table = analyze.series(designs)
    vendors = [v for v in (cfg.ESPRESSIF, cfg.NORDIC, cfg.TELINK) if any(v in q for q in table.values())]

    print("\n=== New 2.4 GHz module designs per quarter (deduplicated) ===\n")
    header = "quarter  " + "".join(f"{v:>14s}" for v in vendors) + f"{'ESP share':>12s}"
    print(header)
    print("-" * len(header))

    totals = {v: 0 for v in vendors}
    for q in analyze.quarters(cfg.START_YEAR, cfg.END_YEAR):
        counts = table.get(q)
        if not counts:
            continue
        esp = counts.get(cfg.ESPRESSIF, 0)
        nordic = counts.get(cfg.NORDIC, 0)
        row = "".join(f"{counts.get(v, 0):>14d}" for v in vendors)
        share = f"{esp / (esp + nordic) * 100:>11.0f}%" if (esp + nordic) else f"{'-':>12s}"
        print(f"{q:8s}{row}{share}")
        for v in vendors:
            totals[v] += counts.get(v, 0)

    print("-" * len(header))
    print(f"{'total':8s}" + "".join(f"{totals[v]:>14d}" for v in vendors))

    print("\n=== Attribution confidence ===\n")
    by_conf: dict[str, int] = {}
    for d in designs:
        by_conf[d.confidence] = by_conf.get(d.confidence, 0) + 1
    for conf in (cfg.HIGH, cfg.MEDIUM, cfg.LOW):
        count = by_conf.get(conf, 0)
        pct = count / len(designs) * 100 if designs else 0
        print(f"  {conf:7s} {count:5d}  {pct:5.1f}%  {bar(count, 40 / max(len(designs), 1))}")

    print("\n=== Designs by company ===\n")
    by_company: dict[tuple[str, str], int] = {}
    for d in designs:
        by_company[(d.company, d.silicon)] = by_company.get((d.company, d.silicon), 0) + 1
    for (company, silicon), count in sorted(by_company.items(), key=lambda x: -x[1]):
        print(f"  {count:5d}  {silicon:12s} {company}")

    hosts_path = OUT / "hosts.csv"
    if hosts_path.exists():
        print("\n=== Host references (indicative, lower bound) ===\n")
        counts: dict[tuple[str, str], int] = {}
        with hosts_path.open(encoding="utf-8") as handle:
            for r in csv.DictReader(handle):
                counts[(r["quarter"], r["silicon"])] = counts.get((r["quarter"], r["silicon"]), 0) + 1
        print(f"{'quarter':8s}{'Espressif':>14s}{'Nordic':>14s}{'ESP share':>12s}")
        for q in analyze.quarters(cfg.START_YEAR, cfg.END_YEAR):
            esp = counts.get((q, cfg.ESPRESSIF), 0)
            nordic = counts.get((q, cfg.NORDIC), 0)
            if not (esp or nordic):
                continue
            share = f"{esp / (esp + nordic) * 100:>11.0f}%"
            print(f"{q:8s}{esp:>14d}{nordic:>14d}{share}")


# --- Entry point -----------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("stage", choices=["modules", "hosts", "report", "all"])
    parser.add_argument("--delay", type=float, default=0.4, help="seconds between requests per host")
    parser.add_argument("--workers", type=int, default=4, help="parallel fetches")
    parser.add_argument("--limit", type=int, default=0, help="cap modules processed in the hosts stage")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    if args.stage == "report":
        stage_report(args)
        return

    fetcher = build_fetcher(args)
    if args.stage in ("modules", "all"):
        stage_modules(fetcher, args)
    if args.stage == "hosts":
        stage_hosts(fetcher, args)
    if args.stage == "all":
        stage_report(args)
    print(f"\ncache: {fetcher.cache.stats()} pages ({fetcher.hits} hits, {fetcher.misses} fetches)")


if __name__ == "__main__":
    main()
