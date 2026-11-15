#!/usr/bin/env python3
"""Conservative official object-video enrichment; no generic museum clips per object.

Call enrich_object_videos(items, V6_ROOT) before serializing collection.js. It
mutates only a matching object's videos and writes data/extra-video-audit.json.
The HTML source is verified; actual playback requires browser/device testing.
"""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urljoin, urlsplit
import argparse
import json
import re
import unicodedata
import urllib.request

BASE = "https://baotanglichsu.vn"
MAX_BYTES = 2 * 1024 * 1024
HOSTS = {"baotanglichsu.vn", "www.baotanglichsu.vn"}
GENERIC = {"bao", "vat", "quoc", "gia", "viet", "nam", "hien", "gom", "dong", "tuong", "binh", "trong", "bo", "suu", "tap", "hinh", "thoi", "ky", "dai", "nen", "van", "hoa"}


def norm(value):
    value = unicodedata.normalize("NFD", unescape(str(value)).lower()).replace("đ", "d")
    return re.sub(r"[^a-z0-9]+", " ", "".join(c for c in value if not unicodedata.combining(c))).strip()


def object_name(value):
    name = norm(value)
    name = re.sub(r"\bbao vat quoc gia(?: viet nam)?\b", "", name)
    return " ".join(name.split())


def matches_object(title, name):
    """Full distinctive title only, not bag-of-words or generic artifact classes."""
    n = object_name(name)
    words = n.split()
    distinctive = [w for w in words if w not in GENERIC and len(w) >= 3]
    return len(words) >= 2 and len(n) >= 9 and bool(distinctive) and (" " + n + " ") in (" " + object_name(title) + " ")


def official_url(value):
    try:
        u = urlsplit(value)
        return u.scheme == "https" and u.hostname in HOSTS and not u.username and not u.password
    except ValueError:
        return False


def media_url(value, page_url):
    value = unescape(value.strip()).replace("\\/", "/")
    url = urljoin(page_url, value)
    try:
        u = urlsplit(url)
    except ValueError:
        return None
    if u.scheme != "https" or u.username or u.password:
        return None
    host = (u.hostname or "").lower()
    if host in {"youtube.com", "www.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com", "youtu.be"}:
        video_id = parse_qs(u.query).get("v", [None])[0]
        if host == "youtu.be":
            video_id = u.path.strip("/").split("/")[0]
        elif u.path.startswith(("/embed/", "/shorts/")):
            video_id = u.path.strip("/").split("/")[1]
        if video_id and re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id):
            return ("https://www.youtube-nocookie.com/embed/" + video_id + "?rel=0", "embed")
        return None
    if (host in HOSTS or host.endswith(".baotanglichsu.vn")) and re.search(r"\.(mp4|webm)$", u.path, re.I):
        return (url.split("#")[0], "mp4" if u.path.lower().endswith(".mp4") else "webm")
    return None


class VideoHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.anchor = None
        self.titles = []
        self.capture = None
        self.media = []
        self.video_depth = 0

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == "a":
            self.anchor = [d.get("href", ""), d.get("title", "")]
        if tag in {"title", "h1", "h2", "h3"}:
            self.capture = [tag, ""]
        if tag == "meta" and d.get("property", "").lower() == "og:title":
            self.titles.append(d.get("content", ""))
        if tag == "video":
            self.video_depth += 1
            if d.get("src"):
                self.media.append(d["src"])
        if tag == "source" and self.video_depth and d.get("src"):
            self.media.append(d["src"])
        if tag == "iframe" and d.get("src"):
            self.media.append(d["src"])

    def handle_data(self, data):
        if self.anchor:
            self.anchor[1] += " " + data
        if self.capture:
            self.capture[1] += " " + data

    def handle_endtag(self, tag):
        if tag == "a" and self.anchor:
            href, title = self.anchor
            self.links.append((href, " ".join(title.split())))
            self.anchor = None
        if self.capture and tag == self.capture[0]:
            self.titles.append(" ".join(self.capture[1].split()))
            self.capture = None
        if tag == "video":
            self.video_depth = max(0, self.video_depth - 1)


def index_links(html, url):
    parsed = VideoHTML()
    parsed.feed(html)
    result = {}
    for href, title in parsed.links:
        full = urljoin(url, href)
        if title and official_url(full) and re.fullmatch(r"/vi/Video/\d+/[^/]+\.html", urlsplit(full).path, re.I):
            if len(title) > len(result.get(full, "")):
                result[full] = title
    return result


def detail_media(html, url):
    parsed = VideoHTML()
    parsed.feed(html)
    candidates = list(parsed.media)
    # JWPlayer/video.js configuration on older official detail pages.
    candidates.extend(re.findall(r"(?:file|src|source)\s*[:=]\s*[\"']([^\"']+)[\"']", html, re.I))
    found = []
    for raw in candidates:
        value = media_url(raw, url)
        if value and value not in found:
            found.append(value)
    return parsed.titles, found


def fetch_page(url):
    request = urllib.request.Request(url, headers={"User-Agent": "MuseumCompanion/6 official-source video audit", "Accept": "text/html"})
    with urllib.request.urlopen(request, timeout=20) as response:
        if not official_url(response.url):
            raise ValueError("Redirect left the official museum host")
        raw = response.read(MAX_BYTES + 1)
        if len(raw) > MAX_BYTES:
            raise ValueError("HTML exceeds 2 MiB")
        if response.status != 200:
            raise ValueError("HTTP " + str(response.status))
        return raw.decode("utf-8", errors="replace")


def enrich_object_videos(items, root, *, fetcher=None, max_pages=8, max_details=8):
    root = Path(root)
    fetcher = fetcher or fetch_page
    audit = {"observedAt": datetime.now(timezone.utc).isoformat(), "institution": "Bảo tàng Lịch sử Quốc gia", "pages": [], "candidates": [], "matchedObjects": [], "failures": [], "playbackTested": False}
    cache = {}
    samples = root / "data/expansion-samples.json"
    if samples.exists():
        for row in json.loads(samples.read_text()):
            if row.get("status") == 200 and official_url(row.get("url", "")) and "html" in row:
                cache[row["url"]] = row["html"]

    def get(url):
        try:
            cached = url in cache
            body = cache[url] if cached else fetcher(url)
            if isinstance(body, dict):
                body = body["html"]
            if not isinstance(body, str) or len(body.encode("utf-8")) > MAX_BYTES:
                raise ValueError("Invalid or oversized HTML")
            return {"url": url, "html": body, "cached": cached}
        except Exception as exc:
            return {"url": url, "error": str(exc)[:240]}

    indexes = [BASE + "/vi/Video" + ("/Page" + str(i) if i > 1 else "") for i in range(1, min(8, max(1, max_pages)) + 1)]
    links = {}
    with ThreadPoolExecutor(max_workers=4) as pool:
        for row in pool.map(get, indexes):
            if row.get("error"):
                audit["failures"].append(row)
                continue
            audit["pages"].append({"url": row["url"], "cached": row["cached"], "stage": "index"})
            links.update(index_links(row["html"], row["url"]))
    eligible = [a for a in items if official_url(a.get("url", a.get("source", "")))]
    matches = []
    for url, title in links.items():
        objects = [a for a in eligible if matches_object(title, a.get("name", ""))]
        if objects:
            matches.append((url, title, objects))
    matches = sorted(matches, key=lambda row: (row[0], row[1]))[:min(8, max(0, max_details))]
    with ThreadPoolExecutor(max_workers=4) as pool:
        rows = list(pool.map(get, [row[0] for row in matches]))
    for (url, title, objects), row in zip(matches, rows):
        entry = {"url": url, "title": title, "objectIds": [a.get("id") for a in objects]}
        if row.get("error"):
            audit["failures"].append(row)
            entry["status"] = "detail-fetch-failed"
        else:
            audit["pages"].append({"url": url, "cached": row["cached"], "stage": "detail"})
            titles, media = detail_media(row["html"], url)
            confirmed = [a for a in objects if any(matches_object(t, a.get("name", "")) for t in titles)]
            # Multiple different players on a page are ambiguous; never attach all.
            if len(media) != 1 or not confirmed:
                entry.update(status="ambiguous-or-missing-player" if len(media) != 1 else "detail-title-mismatch", players=len(media))
            else:
                target, kind = media[0]
                for a in confirmed:
                    video = {"url": target, "title": title, "sourceUrl": url, "verifiedSource": True, "relation": "object", "evidenceTitle": next(t for t in titles if matches_object(t, a.get("name", ""))), "kind": kind, "credit": "Bảo tàng Lịch sử Quốc gia", "verification": "official-detail-html", "playbackVerified": False}
                    a.setdefault("videos", [])
                    if not any(v.get("url") == target and v.get("sourceUrl") == url for v in a["videos"]):
                        a["videos"].append(video)
                    audit["matchedObjects"].append({"id": a.get("id"), "name": a.get("name"), **video})
                entry.update(status="attached", mediaUrl=target)
        audit["candidates"].append(entry)
    audit["indexLinks"] = len(links)
    audit["eligibleObjects"] = len(eligible)
    audit["matchedObjectCount"] = len({row["id"] for row in audit["matchedObjects"]})
    audit["detailLimit"] = min(8, max(0, max_details))
    output = root / "data/extra-video-audit.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n")
    return audit


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("items_json", type=Path, help="JSON array of imported objects; rewritten with verified object videos")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    items = json.loads(args.items_json.read_text())
    if not isinstance(items, list):
        raise ValueError("Expected a JSON array")
    audit = enrich_object_videos(items, args.root)
    args.items_json.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"matchedObjects": audit["matchedObjectCount"], "failures": len(audit["failures"])}, ensure_ascii=False))


if __name__ == "__main__":
    main()
