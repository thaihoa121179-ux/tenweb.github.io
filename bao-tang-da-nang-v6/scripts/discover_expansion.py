"""Bounded public-source discovery; candidates are not accepted collection records.

Native HTTPS only, max 15 public pages and 5 MiB per response. No credentials,
API calls, video downloads, redirects to unlisted hosts, or arbitrary crawling.
Outputs auditable institutional scopes, links, media references and HTML samples.
"""
from __future__ import annotations

import argparse
from collections import deque
from datetime import datetime, timezone
from hashlib import sha256
from html import unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

MAX_PAGES = 15
MAX_BYTES = 5 * 1024 * 1024
MAX_LINKS = 3000
MAX_SAMPLE = 180_000
SOURCES = {
    "danang": {"name": "Bảo tàng Đà Nẵng", "hosts": ["baotangdanang.vn", "www.baotangdanang.vn"], "root": "https://baotangdanang.vn/"},
    "cham": {"name": "Bảo tàng Điêu khắc Chăm Đà Nẵng", "hosts": ["chammuseum.vn", "www.chammuseum.vn"], "root": "https://chammuseum.vn/"},
    "met-vietnam-reference": {"name": "The Metropolitan Museum of Art · Vietnam search · external reference only", "hosts": ["collectionapi.metmuseum.org", "www.metmuseum.org", "metmuseum.org"], "root": "https://collectionapi.metmuseum.org/"},
    "national-history": {"name": "Bảo tàng Lịch sử quốc gia · nguồn tham khảo ngoài Đà Nẵng", "hosts": ["baotanglichsu.vn", "www.baotanglichsu.vn"], "root": "https://baotanglichsu.vn/"},
}
ALL_HOSTS = {host for source in SOURCES.values() for host in source["hosts"]}
BLOCKED = re.compile(r"(?:^|/)(?:admin\w*|login|logout|signin|sign-in|wp-admin|wp-login|cart|checkout|account)(?:[/.?]|$)", re.I)
OBJECT = re.compile(r"(?:hien[-_]?vat|co[-_]?vat|artifact|object|antiquit|treasure|bao[-_]?vat|collection|bo[-_]?suu[-_]?tap|tac[-_]?pham|sculpture|cham[-_]?khac)", re.I)
CATALOG = re.compile(r"(?:hien[-_]?vat|artifact|collection|bo[-_]?suu[-_]?tap|trung[-_]?bay|video|phim[-_]?tu[-_]?lieu|sitemap|wp-json)", re.I)
EDITORIAL = re.compile(r"(?:tin[-_]?tuc|su[-_]?kien|news|event|thong[-_]?bao|hoat[-_]?dong)", re.I)
VIDEO_HOSTS = {"youtube.com", "www.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com", "youtu.be", "vimeo.com", "player.vimeo.com"}


def normalize_url(raw: str, base: str) -> str | None:
    value = unescape(str(raw)).strip()
    if not value or value.startswith(("#", "javascript:", "mailto:", "tel:", "data:", "blob:")):
        return None
    try:
        parsed = urllib.parse.urlsplit(urllib.parse.urljoin(base, value))
        if parsed.scheme not in {"https", "http"} or parsed.username or parsed.password:
            return None
        # Preserve public HTTP references as evidence but never fetch them.
        return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path or "/", parsed.query, ""))
    except ValueError:
        return None


def allowed(url: str, hosts: list[str] | set[str] = ALL_HOSTS) -> bool:
    try:
        parsed = urllib.parse.urlsplit(url)
        return parsed.scheme == "https" and parsed.hostname in hosts and parsed.port in (None, 443) and not parsed.username and not parsed.password and not BLOCKED.search(parsed.path)
    except ValueError:
        return False


class PublicRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not allowed(newurl):
            raise ValueError("Redirect outside public official HTTPS allowlist")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


class SourceHTML(HTMLParser):
    def __init__(self, base):
        super().__init__(convert_charrefs=True)
        self.base = base
        self.links = []
        self.images = []
        self.media = []
        self.scripts = []
        self.forms = []
        self.headings = []
        self.title = ""
        self.meta = {}
        self._anchor = None
        self._heading = None
        self._title = False
        self._script = None
        self._video_text = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title": self._title = True
        if tag in ("h1", "h2", "h3"): self._heading = {"tag": tag, "text": ""}
        if tag == "meta":
            key = a.get("property", a.get("name", ""))
            if key and len(self.meta) < 40: self.meta[key] = a.get("content", "")[:2000]
        if tag == "a":
            u = normalize_url(a.get("href", ""), self.base)
            self._anchor = {"url": u, "text": ""} if u else None
            if u: self.add_media(u, "anchor")
        if tag == "img" and len(self.images) < 150:
            u = normalize_url(a.get("src", a.get("data-src", "")), self.base)
            if u: self.images.append({"url": u, "alt": a.get("alt", "")[:400]})
        if tag in ("iframe", "video", "source", "embed"):
            for key in ("src", "data-src"):
                u = normalize_url(a.get(key, ""), self.base)
                if u: self.add_media(u, tag)
        if tag == "script":
            src = normalize_url(a.get("src", ""), self.base)
            if src and len(self.scripts) < 80: self.scripts.append({"src": src})
            if a.get("type") in ("application/ld+json", "application/json"):
                self._script = {"type": a.get("type"), "id": a.get("id", ""), "text": ""}
        if tag == "form" and len(self.forms) < 30:
            self.forms.append({"action": normalize_url(a.get("action", ""), self.base), "method": a.get("method", "get")})

    def add_media(self, url, tag):
        p = urllib.parse.urlsplit(url)
        if p.hostname in VIDEO_HOSTS or re.search(r"\.(?:mp4|webm|m3u8)(?:$|\?)", url, re.I):
            if len(self.media) < 200 and not any(x["url"] == url for x in self.media):
                self.media.append({"url": url, "element": tag, "official_page": self.base, "rights": "unconfirmed", "kind": "source-linked-video"})

    def handle_data(self, data):
        if self._title: self.title = (self.title + data)[:1000]
        if self._anchor: self._anchor["text"] = (self._anchor["text"] + data)[:500]
        if self._heading: self._heading["text"] = (self._heading["text"] + data)[:1000]
        if self._script: self._script["text"] = (self._script["text"] + data)[:100_000]

    def handle_endtag(self, tag):
        if tag == "title": self._title = False
        if tag == "a" and self._anchor:
            if len(self.links) < MAX_LINKS:
                self._anchor["text"] = " ".join(self._anchor["text"].split())
                self.links.append(self._anchor)
            self._anchor = None
        if tag in ("h1", "h2", "h3") and self._heading:
            if len(self.headings) < 100: self.headings.append(self._heading)
            self._heading = None
        if tag == "script" and self._script:
            if len(self.scripts) < 100: self.scripts.append(self._script)
            self._script = None


def classify(url, text=""):
    parsed = urllib.parse.urlsplit(url)
    hay = urllib.parse.unquote(parsed.path) + " " + text
    hay = "".join(c for c in unicodedata.normalize("NFD", hay.lower().replace("đ", "d")) if not unicodedata.combining(c)).replace(" ", "-")
    # An index is not an object record, nor is a news article automatically one.
    if EDITORIAL.search(hay): return "editorial-review-required"
    if OBJECT.search(hay): return "collection-or-object-candidate"
    if CATALOG.search(hay): return "catalog-or-media-index"
    return "other-public-page"


def sample_html(body):
    main = re.search(r"<(?:main|article)\b[^>]*>(.*?)</(?:main|article)>", body, re.I | re.S)
    content = main.group(0) if main else body
    return content[:MAX_SAMPLE], len(content) > MAX_SAMPLE


def inspect_response(source_id, url):
    item = {"institution_id": source_id, "institution_name": SOURCES[source_id]["name"], "requested_url": url, "fetched_at": datetime.now(timezone.utc).isoformat()}
    try:
        if not allowed(url, SOURCES[source_id]["hosts"]): raise ValueError("URL outside institutional scope")
        request = urllib.request.Request(url, headers={"User-Agent": "MuseumCompanion/6.4 public official-source discovery", "Accept": "text/html,application/xml,text/xml,text/plain,application/json"})
        with urllib.request.build_opener(PublicRedirect()).open(request, timeout=25) as response:
            body_bytes = response.read(MAX_BYTES + 1)
            item.update(status=response.status, final_url=response.url, content_type=response.headers.get("Content-Type", ""), bytes=len(body_bytes))
            if len(body_bytes) > MAX_BYTES: raise ValueError("Response exceeds 5 MiB bound")
            # Even cross-institution redirects must never alter this record's scope.
            if not allowed(response.url, SOURCES[source_id]["hosts"]): raise ValueError("Redirect crossed institutional scope")
            charset = response.headers.get_content_charset() or "utf-8"
            try: body = body_bytes.decode(charset, errors="replace")
            except LookupError: body = body_bytes.decode("utf-8", errors="replace")
        item["sha256"] = sha256(body_bytes).hexdigest()
        item["anchors"] = []
        item["media"] = []
        item["sitemap_urls"] = []
        item["sitemap_index"] = False
        if "xml" in item["content_type"] or body.lstrip().startswith("<?xml") or "<urlset" in body or "<sitemapindex" in body:
            if "<!DOCTYPE" in body.upper() or "<!ENTITY" in body.upper(): raise ValueError("Unexpected XML declarations")
            try:
                root = ET.fromstring(body)
                item["sitemap_index"] = root.tag.split("}")[-1] == "sitemapindex"
                for el in root.iter():
                    if el.tag.split("}")[-1] == "loc" and el.text and len(item["sitemap_urls"]) < MAX_LINKS:
                        u = normalize_url(el.text, response.url)
                        if u and allowed(u, SOURCES[source_id]["hosts"]): item["sitemap_urls"].append(u)
                item["sitemap_truncated"] = sum(1 for el in root.iter() if el.tag.split("}")[-1] == "loc") > MAX_LINKS
            except ET.ParseError as error: item["xml_error"] = str(error)
        if "html" in item["content_type"] or "<html" in body[:2000].lower():
            parser = SourceHTML(response.url)
            parser.feed(body)
            item.update(title=parser.title.strip(), headings=parser.headings, metadata=parser.meta, scripts=parser.scripts, forms=parser.forms, images=parser.images, media=parser.media)
            seen = set()
            for link in parser.links:
                if allowed(link["url"], SOURCES[source_id]["hosts"]) and link["url"] not in seen:
                    seen.add(link["url"]); item["anchors"].append({**link, "classification": classify(link["url"], link["text"])})
            item["html_sample"], item["html_sample_truncated"] = sample_html(body)
            item["public_api_hints"] = []
            for raw_hint in re.findall(r'''["']((?:https://[^/"']+)?/(?:api|wp-json|ajax)[^"'\s<>]{0,200})["']''', body, re.I):
                hint = normalize_url(raw_hint, response.url)
                if hint and allowed(hint, SOURCES[source_id]["hosts"]):
                    parts = urllib.parse.urlsplit(hint)
                    safe_hint = {"url": urllib.parse.urlunsplit((parts.scheme, parts.netloc, parts.path, "", "")), "query_parameter_names": sorted(urllib.parse.parse_qs(parts.query))}
                    if safe_hint not in item["public_api_hints"]: item["public_api_hints"].append(safe_hint)
                if len(item["public_api_hints"]) >= 30: break
            # Media URLs embedded in public page data, not external pages to visit.
            for match in re.finditer(r"https?:(?:\\/|/){2}(?:www\.)?(?:youtube(?:-nocookie)?\.com|youtu\.be|player\.vimeo\.com)[^\s\"'<>\\]+", body):
                parser.add_media(match.group(0).replace("\\/", "/"), "page-data")
            item["media"] = parser.media
        if "json" in item["content_type"]:
            try:
                structured = json.loads(body)
                if isinstance(structured, dict):
                    item["json_keys"] = list(structured)[:100]
                    item["json_sample"] = structured if len(body) <= MAX_SAMPLE else {"sample": body[:MAX_SAMPLE], "truncated": True}
                    if source_id == "met-vietnam-reference" and isinstance(structured.get("objectIDs"), list):
                        item["collection_api_total"] = structured.get("total")
                        item["collection_api_object_ids"] = [n for n in structured["objectIDs"][:1000] if isinstance(n, int) and n > 0]
            except json.JSONDecodeError as error: item["json_error"] = str(error)
        if urllib.parse.urlsplit(url).path == "/robots.txt":
            item["robots_sample"] = body[:30_000]
            item["robots_sitemaps"] = [u for raw in re.findall(r"^Sitemap:\s*(\S+)", body, re.I | re.M) if (u := normalize_url(raw, url)) and allowed(u, SOURCES[source_id]["hosts"])]
    except (urllib.error.URLError, TimeoutError, ValueError, OSError) as error:
        item["error"] = str(error)
        if isinstance(error, urllib.error.HTTPError): item["status"] = error.code
    return item


def discover(output: Path, max_pages: int = MAX_PAGES):
    max_pages = min(MAX_PAGES, max(1, max_pages))
    # Three explicit public entrypoints per institution; adaptive followups share
    # the remaining six-page budget and remain within each institutional host.
    queue = deque((source_id, source["root"] + path) for source_id, source in SOURCES.items() if source_id != "met-vietnam-reference" for path in ("", "sitemap.xml", "robots.txt"))
    queue.extend([
        ("danang", "https://baotangdanang.vn/bao-tang-da-nang/hien-vat-va-phim-tu-lieu/phim-tu-lieu"),
        ("danang", "https://baotangdanang.vn/bao-tang-da-nang-co-so-2/hien-vat-va-phim-tu-lieu/phim-tu-lieu"),
        ("met-vietnam-reference", "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=Vietnam"),
    ])
    queued = {url for _, url in queue}
    records = []
    while queue and len(records) < max_pages:
        source_id, url = queue.popleft()
        record = inspect_response(source_id, url)
        records.append(record)
        print(f"{len(records):02}/{max_pages} {source_id}: {url} -> {record.get('status', 'ERROR')} {record.get('error', '')}", flush=True)
        if record.get("status") != 200 or record.get("error"): continue
        followups = []
        if source_id == "met-vietnam-reference" and record.get("collection_api_object_ids"):
            object_id = record["collection_api_object_ids"][0]
            followups.append((0, f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{object_id}"))
        followups += [(0, u) for u in record.get("robots_sitemaps", [])]
        if record.get("sitemap_index"):
            followups += [(1, u) for u in record.get("sitemap_urls", []) if re.search(r"(?:post|page|hien|vat|collection|art|sitemap)", u, re.I)]
        followups += [(2, a["url"]) for a in record.get("anchors", []) if a["classification"] == "catalog-or-media-index"]
        followups += [(3, a["url"]) for a in record.get("anchors", []) if a["classification"] == "collection-or-object-candidate"]
        # One sample object per loaded sitemap is enough to inspect importer schema.
        object_urls = [u for u in record.get("sitemap_urls", []) if classify(u) == "collection-or-object-candidate"]
        if object_urls: followups.append((4, object_urls[0]))
        for _, follow in sorted(set(followups))[:4]:
            if follow not in queued and allowed(follow, SOURCES[source_id]["hosts"]):
                queued.add(follow); queue.append((source_id, follow))
    candidate_map = {}
    media_map = {}
    for record in records:
        source_id = record["institution_id"]
        for link in record.get("anchors", []) + [{"url": u, "text": "", "classification": classify(u)} for u in record.get("sitemap_urls", [])]:
            if link["classification"] not in ("collection-or-object-candidate", "catalog-or-media-index"): continue
            key = (source_id, link["url"])
            entry = candidate_map.setdefault(key, {"institution_id": source_id, **link, "evidence_pages": [], "accepted_record": False})
            if record.get("final_url", record["requested_url"]) not in entry["evidence_pages"]: entry["evidence_pages"].append(record.get("final_url", record["requested_url"]))
        for media in record.get("media", []):
            media_map.setdefault((source_id, media["url"]), {"institution_id": source_id, **media})
    snapshot = {
        "schema_version": 1,
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "limits": {"max_pages": max_pages, "max_response_bytes": MAX_BYTES, "max_links_per_response": MAX_LINKS, "max_html_sample_chars": MAX_SAMPLE},
        "scope_notice": "Discovery only. Distinct institutions remain separate. Candidate URLs are not verified object records and do not count toward a 200-object goal. No video embedding or image-use permission is inferred.",
        "sources": SOURCES,
        "responses": records,
        "candidates": sorted(candidate_map.values(), key=lambda c: (c["institution_id"], c["url"])),
        "media_references": sorted(media_map.values(), key=lambda c: (c["institution_id"], c["url"])),
        "pending_pages_not_fetched": [{"institution_id": sid, "url": url} for sid, url in list(queue)[:100]],
        "summary": {"requests": len(records), "successful_responses": sum(r.get("status") == 200 and not r.get("error") for r in records), "candidate_urls": len(candidate_map), "video_references": len(media_map)},
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(snapshot["summary"], ensure_ascii=False), flush=True)
    print(f"Snapshot: {output}", flush=True)
    return snapshot


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "data" / "expansion-discovery.json")
    parser.add_argument("--max-pages", type=int, default=MAX_PAGES, help="Bounded to 1–15 public HTTP requests")
    args = parser.parse_args()
    discover(args.output, args.max_pages)
