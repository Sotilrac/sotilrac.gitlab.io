# FCC BLE silicon trends

Builds a quarterly time series of US 2.4 GHz module authorizations by radio silicon vendor, from FCC equipment-authorization records. It exists to test one claim: that designers are moving from Nordic to Espressif.

Stdlib Python 3.12, no dependencies.

## Running it

```bash
cd src/fcc-ble-trends
./pull.py modules     # enumerate + parse every module grant (slow first run, cached after)
./pull.py hosts       # optional: find host filings citing those modules
./pull.py report      # aggregate and print
```

Results land in `out/` as CSV and the HTTP cache in `.cache/fcc.sqlite`; both are gitignored. A second run is nearly free because every fetched page is cached, so iterate on the analysis without re-scraping.

Useful flags: `--delay` (seconds between requests to a host, default 0.4), `--workers` (parallel fetches, default 4), `--limit` (cap the hosts stage), `--verbose`.

## Where the data comes from

| Source                   | Used for                            | State                                   |
| ------------------------ | ----------------------------------- | --------------------------------------- |
| FCC Socrata `3b3k-34jp`  | grantee code to company name        | official, complete                      |
| fccid.io grantee pages   | enumerating a grantee's filings     | mirror, paginated, complete per grantee |
| fccid.io filing pages    | equipment class, frequencies, dates | mirror, matches the FCC record          |
| fccid.io document search | host filings citing a module        | mirror, partial index, no pagination    |

The FCC's own search at `apps.fcc.gov/oetcf/eas/reports/GenericSearch.cfm` returns 403 to scripted clients behind its Akamai edge, and the FCC Socrata catalogue publishes the grantee registry but no grants table, so the grant records come from a mirror.

## What it measures, and what it does not

The solid output is **module grants per vendor per quarter**: complete for any grantee code in `config.py`, because grantee enumeration paginates properly.

That is not the same as design wins, and the gap runs in one direction. Espressif sells its own silicon under a single grantee code, `2AC7Z`. Nordic sells no modules at all, so Nordic-based designs scatter across third-party module houses (Raytac, u-blox, Ezurio, Fanstel, Insight SiP, Minew, Holyiot) and across chip-down filings that never name the chip in any machine-readable field. **Counting grants by grantee therefore undercounts Nordic and flatters Espressif**, which is precisely the direction of the hypothesis under test. Any conclusion drawn from the module series alone is arguing with a loaded deck.

The `hosts` stage exists to push back against that bias by counting the host products that cite a module as "Contains FCC ID". Those are real design wins. But the mirror's document index is partial: a query for a term as common as "test" returns a few hundred filings rather than the millions that contain it, the result set cannot be paginated past its own cap, and there is no date filter to slice a large query into smaller ones. Coverage may vary by vendor and by year, which is exactly the failure mode that manufactures a trend out of nothing. Host counts are a lower bound of unknown tightness. The report labels them as such and prints a warning when a query saturates.

Other known biases, all unfixable from this data:

1. Products authorized under Supplier's Declaration of Conformity are never filed with the FCC and never appear.
2. US market only. It misses Chinese domestic volume entirely.
3. An Espressif module grant covers Wi-Fi-only products too, so a raw module count overstates Espressif's BLE position specifically.
4. Chip-down designs are invisible without OCR of internal-photo exhibits, and those can be withheld under a confidentiality request.
5. The series counts designs, not units shipped and not revenue.

## Attribution

`config.py` maps grantee codes to silicon, with a confidence level on every rule, and the report prints the split so you can see how much of the series rests on inference. Mixed-silicon vendors are resolved by product-code pattern rather than assigned wholesale: u-blox NINA-B is Nordic, u-blox NINA-W is ESP32, and a u-blox part matching neither is left unattributed instead of guessed.

Adding a vendor means adding a `Grantee` entry. Resolve its code by company name against the Socrata registry first, and expect several codes per company and inconsistent name spellings.

## Validating the shape

Nordic publishes Bluetooth SIG design-win numbers in its quarterly reports. They count a different population (global, all Nordic designs, not US filings), so the levels are not comparable, but the direction should be. If this pipeline shows Nordic falling off a cliff while Nordic's own SIG share sits flat in the high twenties, the pipeline is wrong before the conclusion is interesting.
