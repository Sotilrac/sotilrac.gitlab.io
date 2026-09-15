"""Host design-win recovery.

A module grant is not a design win; the design win is the host product that
embeds the module and cites it as "Contains FCC ID: <module>". This stage
searches the mirror's filing-document index for those citations.

Treat the output as indicative, not complete. The index is partial (a query for
a term as common as "test" returns a few hundred filings, not the millions that
truly contain it), it cannot be paginated beyond its own cap, and it offers no
date filter to slice a large result set into smaller ones. Coverage may also
differ by vendor and by year, which is exactly the kind of bias that would
manufacture a trend. The reported numbers are therefore a lower bound of
unknown tightness, and the report says so.
"""

from __future__ import annotations

import re
import urllib.parse
from dataclasses import dataclass

from .net import Fetcher
from .sources import FCCID, _text

# Raising the limit past 100 changes nothing; the index saturates there.
SEARCH_LIMIT = 500


@dataclass
class HostReference:
    host_fcc_id: str
    host_company: str
    module_fcc_id: str
    date: str
    matched_documents: int


_RESULT = re.compile(
    r'<h3 style="margin-top:0;"><a href="/([^"]+)">.*?</a></h3>(.*?)(?=<h3 style="margin-top:0;">|\Z)',
    re.S,
)


def _field(block: str, label: str) -> str:
    match = re.search(rf"<th[^>]*>{label}</th>\s*<td[^>]*>(.*?)</td>", block, re.S)
    return _text(match.group(1)) if match else ""


def find_hosts(
    fetcher: Fetcher, module_fcc_id: str, module_grantee: str
) -> tuple[list[HostReference], bool]:
    """Find host filings citing a module. Returns (references, hit_cap)."""
    query = urllib.parse.urlencode(
        {"q": f"Contains FCC ID {module_fcc_id}", "limit": SEARCH_LIMIT}
    )
    status, body = fetcher.get(f"{FCCID}/search?{query}")
    if status != 200 or not body:
        return [], False

    total_match = re.search(r"Found ([\d,]+) matching", _text(body))
    total = int(total_match.group(1).replace(",", "")) if total_match else 0

    references: list[HostReference] = []
    seen: set[str] = set()
    for fcc_id, block in _RESULT.findall(body):
        # A hit under the module's own grantee code is the module itself or a
        # sibling variant, not a third-party design win.
        if fcc_id.startswith(module_grantee) or fcc_id in seen:
            continue
        seen.add(fcc_id)
        documents = _field(block, "Matched Documents")
        references.append(
            HostReference(
                host_fcc_id=fcc_id,
                host_company=_field(block, "Company"),
                module_fcc_id=module_fcc_id,
                date=_field(block, "Latest Filing"),
                matched_documents=int(documents) if documents.isdigit() else 0,
            )
        )

    # The index caps a response without saying so; a full-looking result set is
    # the signal that the true count is higher than what came back.
    return references, total >= len(references) and len(references) >= 90
