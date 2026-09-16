"""Sampled precision check for host references, by reading the filing's exhibits.

The host search matches hyphen-split tokens of an FCC ID rather than the ID as
a unit, so an unknown fraction of its hits are wrong. The citation itself lives
in the filing's exhibit documents, as the line the FCC requires on the label:

    Contains FCC ID: XPYNINAW13

This module downloads those exhibits and looks for that string. The mirror
renders only the first page of each exhibit as a preview image, so the preview
is useless here and the full PDF is fetched instead, from the `.pdf` URL beside
each exhibit page. Most are scans with no text layer, so pages are rasterised
and passed through OCR when `pdftotext` comes back empty.

It is a sample by design. Verifying every reference would mean OCR-ing tens of
thousands of pages; a few dozen puts a number on the error rate.
"""

from __future__ import annotations

import re
import subprocess
import urllib.request
from dataclasses import dataclass
from pathlib import Path

from .net import USER_AGENT, Fetcher
from .sources import FCCID

# Ordered by where the "Contains FCC ID" declaration actually appears. The
# label carries it because the FCC requires it there; cover letters usually
# restate it; manuals are last and are the longest documents to read.
EXHIBIT_ORDER = ("Label", "Letter", "User-Manual", "Users-Manual")
MAX_EXHIBITS = 4
MAX_PAGES_PER_EXHIBIT = 6
RASTER_DPI = 200

_NON_ALNUM = re.compile(r"[^A-Z0-9]")
_CONTAINS = re.compile(r"CONTAINS(?:FCC)?ID")


@dataclass
class Verdict:
    host_fcc_id: str
    module_fcc_id: str
    silicon: str
    pages_read: int
    found: bool
    note: str = ""


def _normalise(text: str) -> str:
    return _NON_ALNUM.sub("", text.upper())


def _exhibit_paths(fetcher: Fetcher, host_fcc_id: str) -> list[str]:
    """Exhibit page paths for a host, ordered by where the citation tends to be."""
    status, body = fetcher.get(f"{FCCID}/{host_fcc_id}")
    if status != 200 or not body:
        return []
    found = list(dict.fromkeys(re.findall(r'href="(/[^"]+/[^/"]+/[^"]+)"', body)))
    ordered: list[str] = []
    for kind in EXHIBIT_ORDER:
        ordered.extend(p for p in found if f"/{kind}/" in p and p not in ordered)
    return ordered[:MAX_EXHIBITS]


def _download_pdf(path: str, destination: Path) -> bool:
    request = urllib.request.Request(
        f"{FCCID}{path}.pdf", headers={"User-Agent": USER_AGENT}
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            if "pdf" not in response.headers.get("Content-Type", ""):
                return False
            destination.write_bytes(response.read())
    except Exception:
        return False
    return destination.stat().st_size > 0


def _run(command: list[str], tessdata: Path | None = None) -> str:
    env = {"PATH": "/usr/bin:/bin:/snap/bin"}
    if tessdata is not None:
        env["TESSDATA_PREFIX"] = str(tessdata)
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=300, env=env)
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return ""
    return result.stdout


def _exhibit_text(pdf: Path, workdir: Path, tessdata: Path) -> tuple[str, int]:
    """Text of an exhibit, and how many pages were read to get it."""
    text = _run(["pdftotext", str(pdf), "-"])
    if len(text.strip()) > 40:
        return text, 1

    # No text layer: rasterise and OCR. Tesseract is packaged as a snap here
    # and cannot read outside $HOME, so pages are written beside the cache.
    for stale in workdir.glob("pg-*.png"):
        stale.unlink()
    _run(["pdftoppm", "-r", str(RASTER_DPI), "-png", "-l", str(MAX_PAGES_PER_EXHIBIT),
          str(pdf), str(workdir / "pg")])

    collected: list[str] = []
    pages = sorted(workdir.glob("pg-*.png"))
    for page in pages:
        collected.append(_run(["tesseract", str(page), "-"], tessdata))
        page.unlink()
    return "\n".join(collected), len(pages)


def verify_reference(
    fetcher: Fetcher,
    host_fcc_id: str,
    module_fcc_id: str,
    silicon: str,
    workdir: Path,
    tessdata: Path,
) -> Verdict:
    """Read a host's exhibits and report whether they cite the module."""
    workdir.mkdir(parents=True, exist_ok=True)
    target = _normalise(module_fcc_id)
    pdf = workdir / "exhibit.pdf"
    pages_read = 0
    saw_declaration = False

    for path in _exhibit_paths(fetcher, host_fcc_id):
        if not _download_pdf(path, pdf):
            continue
        text, pages = _exhibit_text(pdf, workdir, tessdata)
        pages_read += pages
        flat = _normalise(text)
        if _CONTAINS.search(flat):
            saw_declaration = True
        if target in flat:
            pdf.unlink(missing_ok=True)
            return Verdict(host_fcc_id, module_fcc_id, silicon, pages_read, True)

    pdf.unlink(missing_ok=True)
    if pages_read == 0:
        note = "no readable exhibit"
    elif saw_declaration:
        # The filing declares a contained module, and it is not this one.
        note = "cites a different module"
    else:
        note = "no declaration found"
    return Verdict(host_fcc_id, module_fcc_id, silicon, pages_read, False, note)
