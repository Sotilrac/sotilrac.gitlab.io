"""Static configuration: analysis window, RF filters, and silicon attribution rules.

The attribution table is the analytical core of this pipeline and the part most
likely to be wrong. Every rule carries a confidence level so the report can show
how much of the series rests on guesswork.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

# --- Analysis window -------------------------------------------------------

START_YEAR = 2019
END_YEAR = 2026

# --- Step 1 filters: 2.4 GHz short-range -----------------------------------

# FCC equipment classes for 2.4 GHz unlicensed transmitters.
#   DTS - digital transmission system (most BLE/Wi-Fi filings)
#   DSS - spread spectrum / frequency hopping
#   DXX - part 15 low power transmitter, used by some BLE-only filings
EQUIPMENT_CLASSES = {"DTS", "DSS", "DXX"}

BAND_LOW_MHZ = 2400.0
BAND_HIGH_MHZ = 2483.5

# A filing qualifies if any of its frequency rows sits inside the ISM band.
# Some filings report a single centre frequency, so the check is inclusive.

# --- Confidence levels -----------------------------------------------------

HIGH = "high"  # vendor sells the silicon, or module line is unambiguous
MEDIUM = "medium"  # module house is single-silicon in practice
LOW = "low"  # mixed-silicon vendor, attributed by product-code pattern


@dataclass(frozen=True)
class SiliconRule:
    """Maps a product code pattern within a grantee to a silicon vendor."""

    pattern: re.Pattern[str]
    silicon: str
    confidence: str
    note: str = ""


@dataclass(frozen=True)
class Grantee:
    """A grantee code and how to attribute its filings to silicon."""

    code: str
    company: str
    default_silicon: str | None
    confidence: str
    note: str = ""
    rules: tuple[SiliconRule, ...] = field(default_factory=tuple)

    def attribute(self, product_code: str) -> tuple[str | None, str, str]:
        """Return (silicon, confidence, note) for one product code."""
        for rule in self.rules:
            if rule.pattern.search(product_code.upper()):
                return rule.silicon, rule.confidence, rule.note
        return self.default_silicon, self.confidence, self.note


def _rx(pattern: str) -> re.Pattern[str]:
    return re.compile(pattern, re.IGNORECASE)


# --- Silicon vendor labels -------------------------------------------------

ESPRESSIF = "Espressif"
NORDIC = "Nordic"
TELINK = "Telink"
SILABS = "Silicon Labs"
REALTEK = "Realtek"
UNKNOWN = "unresolved"

# Vendors the report treats as the two hypotheses under test.
PRIMARY = (ESPRESSIF, NORDIC)


# --- Grantee table ---------------------------------------------------------
#
# Codes were resolved from the FCC EAS grantee registration dataset (3b3k-34jp)
# by company name. Nordic sells no modules of its own, so its volume shows up
# under third-party module houses; that asymmetry is the central bias in this
# pipeline and is reported explicitly rather than smoothed over.

GRANTEES: tuple[Grantee, ...] = (
    # --- Espressif: own silicon, one grantee code ---------------------------
    Grantee(
        code="2AC7Z",
        company="Espressif Systems (Shanghai)",
        default_silicon=ESPRESSIF,
        confidence=HIGH,
        note="vendor's own silicon",
    ),
    # --- Nordic direct ------------------------------------------------------
    Grantee(
        code="2ANPO",
        company="Nordic Semiconductor ASA",
        default_silicon=NORDIC,
        confidence=HIGH,
        note="vendor's own silicon; mostly cellular and dev kits, not volume modules",
    ),
    # --- Nordic-based module houses ----------------------------------------
    Grantee(
        code="SH6",
        company="Raytac Corp.",
        default_silicon=NORDIC,
        confidence=HIGH,
        note="Raytac's entire BLE line is Nordic nRF5x/nRF54",
    ),
    Grantee(
        code="X8W",
        company="Fanstel Corporation",
        default_silicon=NORDIC,
        confidence=MEDIUM,
        note="predominantly Nordic; some cellular and Wi-Fi parts",
    ),
    Grantee(
        code="2AAQS",
        company="Insight SiP",
        default_silicon=NORDIC,
        confidence=MEDIUM,
        note="SiP modules, predominantly Nordic",
    ),
    Grantee(
        code="PI4",
        company="Ezurio Ltd",
        default_silicon=NORDIC,
        confidence=MEDIUM,
        note="ex-Laird Connectivity; Nordic plus some Silabs and Qualcomm",
    ),
    Grantee(
        code="KQL",
        company="Laird Connectivity",
        default_silicon=NORDIC,
        confidence=LOW,
        note="mixed portfolio, pre-Ezurio rename",
    ),
    Grantee(
        code="SQG",
        company="Laird Connectivity",
        default_silicon=NORDIC,
        confidence=LOW,
        note="mixed portfolio, pre-Ezurio rename",
    ),
    Grantee(
        code="TFB",
        company="Laird Connectivity",
        default_silicon=NORDIC,
        confidence=LOW,
        note="mixed portfolio, pre-Ezurio rename",
    ),
    Grantee(
        code="2ABU6",
        company="Shenzhen Minew Technologies",
        default_silicon=NORDIC,
        confidence=MEDIUM,
        note="Nordic-based beacons and modules; some Telink low-end",
        rules=(
            SiliconRule(_rx(r"TLSR|TB0[0-9]"), TELINK, LOW, "Telink part number pattern"),
        ),
    ),
    Grantee(
        code="2ALGY",
        company="Shenzhen Holyiot Technology",
        default_silicon=NORDIC,
        confidence=MEDIUM,
        note="Nordic-based modules; product codes often name the chip",
        rules=(
            SiliconRule(_rx(r"TLSR|TELINK"), TELINK, MEDIUM, "chip named in product code"),
            SiliconRule(_rx(r"ESP|WROOM"), ESPRESSIF, MEDIUM, "chip named in product code"),
        ),
    ),
    # --- u-blox: genuinely mixed, split by product line ---------------------
    # NINA-B is Nordic; NINA-W is Espressif ESP32. Attributing the whole
    # grantee to either vendor would be wrong, so the line prefix decides.
    *(
        Grantee(
            code=code,
            company="u-blox",
            default_silicon=None,
            confidence=LOW,
            note="mixed silicon; only recognised product lines are attributed",
            rules=(
                SiliconRule(_rx(r"NINA-?W|NINAW"), ESPRESSIF, HIGH, "NINA-W is ESP32-based"),
                SiliconRule(_rx(r"NINA-?B|NINAB"), NORDIC, HIGH, "NINA-B is Nordic-based"),
                SiliconRule(_rx(r"ANNA-?B|ANNAB"), NORDIC, HIGH, "ANNA-B is Nordic-based"),
                SiliconRule(_rx(r"BMD-?3|BMD-?5|BMD3|BMD5"), NORDIC, HIGH, "BMD series is Nordic-based"),
            ),
        )
        for code in ("2AA9B", "PV7", "PVH", "R5Q", "XPY")
    ),
    # --- Context vendors ----------------------------------------------------
    Grantee(
        code="OEO",
        company="Telink Semiconductor (Shanghai)",
        default_silicon=TELINK,
        confidence=HIGH,
        note="vendor's own silicon",
    ),
)

GRANTEE_BY_CODE = {g.code: g for g in GRANTEES}
