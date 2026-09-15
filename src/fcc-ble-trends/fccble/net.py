"""Cached, rate-limited HTTP.

Every remote source here is someone else's free service, so the fetcher caches
aggressively on disk and serialises requests per host behind a delay. A full
run touches thousands of pages; a second run should touch almost none.
"""

from __future__ import annotations

import gzip
import random
import sqlite3
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

USER_AGENT = "fcc-ble-trends/1.0 (research script; contact via asmat.ca)"

DEFAULT_DELAY = 1.0  # seconds between requests to the same host
MAX_RETRIES = 4


class Cache:
    """SQLite-backed URL cache. Safe for concurrent readers and writers."""

    def __init__(self, path: Path):
        path.parent.mkdir(parents=True, exist_ok=True)
        self._path = path
        self._local = threading.local()
        with self._connect() as db:
            db.execute(
                "CREATE TABLE IF NOT EXISTS pages ("
                " url TEXT PRIMARY KEY,"
                " status INTEGER NOT NULL,"
                " body BLOB NOT NULL,"
                " fetched_at REAL NOT NULL)"
            )

    def _connect(self) -> sqlite3.Connection:
        db = getattr(self._local, "db", None)
        if db is None:
            db = sqlite3.connect(self._path, timeout=30)
            db.execute("PRAGMA journal_mode=WAL")
            self._local.db = db
        return db

    def get(self, url: str) -> tuple[int, str] | None:
        row = self._connect().execute(
            "SELECT status, body FROM pages WHERE url = ?", (url,)
        ).fetchone()
        if row is None:
            return None
        return row[0], gzip.decompress(row[1]).decode("utf-8", "replace")

    def put(self, url: str, status: int, body: str) -> None:
        db = self._connect()
        with db:
            db.execute(
                "INSERT OR REPLACE INTO pages (url, status, body, fetched_at)"
                " VALUES (?, ?, ?, ?)",
                (url, status, gzip.compress(body.encode("utf-8")), time.time()),
            )

    def stats(self) -> int:
        return self._connect().execute("SELECT COUNT(*) FROM pages").fetchone()[0]


class Fetcher:
    """Polite HTTP client: one in-flight request per host, cached results."""

    def __init__(self, cache: Cache, delay: float = DEFAULT_DELAY, verbose: bool = False):
        self.cache = cache
        self.delay = delay
        self.verbose = verbose
        self._host_locks: dict[str, threading.Lock] = {}
        self._last_hit: dict[str, float] = {}
        self._guard = threading.Lock()
        self.hits = 0
        self.misses = 0
        self.failures: list[tuple[str, int]] = []

    def _host_lock(self, host: str) -> threading.Lock:
        with self._guard:
            return self._host_locks.setdefault(host, threading.Lock())

    def get(self, url: str, *, refresh: bool = False) -> tuple[int, str]:
        if not refresh:
            cached = self.cache.get(url)
            if cached is not None:
                with self._guard:
                    self.hits += 1
                return cached

        host = urllib.parse.urlsplit(url).netloc
        with self._host_lock(host):
            gap = time.monotonic() - self._last_hit.get(host, 0.0)
            if gap < self.delay:
                time.sleep(self.delay - gap)
            status, body = self._request(url)
            self._last_hit[host] = time.monotonic()

        # Cache successes and hard 404s; transient failures stay uncached so a
        # re-run retries them.
        if status == 200 or status == 404:
            self.cache.put(url, status, body)
        else:
            # A silently dropped fetch truncates the dataset without changing
            # the exit code, which is how a partial scrape gets mistaken for a
            # complete one. Count it and say so.
            with self._guard:
                self.failures.append((url, status))
            print(f"  ! fetch failed ({status}) {url}", flush=True)
        with self._guard:
            self.misses += 1
        if self.verbose:
            print(f"  fetch {status} {url}", flush=True)
        return status, body

    def _request(self, url: str) -> tuple[int, str]:
        last_error = ""
        for attempt in range(MAX_RETRIES):
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": USER_AGENT,
                    "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
                    "Accept-Encoding": "gzip",
                },
            )
            try:
                with urllib.request.urlopen(req, timeout=60) as resp:
                    raw = resp.read()
                    if resp.headers.get("Content-Encoding") == "gzip":
                        raw = gzip.decompress(raw)
                    return resp.status, raw.decode("utf-8", "replace")
            except urllib.error.HTTPError as exc:
                if exc.code in (404, 410):
                    return exc.code, ""
                last_error = f"HTTP {exc.code}"
                # 403 from an edge/bot filter is usually transient, so it is
                # retried rather than treated as a permanent answer.
                if exc.code not in (403, 429, 500, 502, 503, 504):
                    return exc.code, ""
            except (urllib.error.URLError, TimeoutError, OSError) as exc:
                last_error = str(exc)
            # Exponential backoff with jitter before the next attempt.
            time.sleep((2**attempt) + random.uniform(0, 0.5))
        print(f"  ! giving up on {url}: {last_error}", flush=True)
        return 0, ""
