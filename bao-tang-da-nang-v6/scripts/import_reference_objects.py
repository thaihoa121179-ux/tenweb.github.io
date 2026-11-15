"""Append genuinely sourced National History Museum reference objects.

Preserves the existing Da Nang collection. Does not infer dates, materials,
physical positions, permissions or video associations from a target count.
Unknown metadata is explicit; grouped surveys, multipart articles and news are
rejected. Native HTTPS, validated images and bounded requests only.
"""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from hashlib import sha256
import io
import json
from pathlib import Path
import re
import time
import unicodedata
from urllib.parse import quote, unquote, urljoin, urlsplit, urlunsplit
import urllib.error
import urllib.request

from bs4 import BeautifulSoup
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
HOSTS = {"baotanglichsu.vn", "www.baotanglichsu.vn"}
SITE = "https://baotanglichsu.vn"
MAX_HTML = 5 * 1024 * 1024
MAX_IMAGE = 15 * 1024 * 1024
MAX_CANDIDATES = 400
UNKNOWN = "Chưa có dữ liệu xác minh trong hồ sơ nguồn"
CATEGORIES = [(1001, "bao-vat-quoc-gia", 7), (1002, "hien-vat", 23)]
HEADERS = {"User-Agent": "MuseumCompanion/6.4 official physical-object reference import", "Accept": "text/html,image/*"}
GROUP = re.compile(r"^(?:những|các|một số|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười|sưu tập|bộ sưu tập|vài nét|đôi nét|tổng quan)\b|\b(?:phần|kỳ)\s*(?:\d+|[ivx]+|cuối|đầu)|\b(?:hội thảo|hội nghị|trưng bày chuyên đề|triển lãm|công tác bảo quản|kỹ thuật bảo quản|hoạt động|khai mạc|lễ tiếp nhận|đón nhận|thông báo)\b", re.I)
OBJECT_NOUN = re.compile(r"\b(?:trống|thạp|bình|lọ|tượng|phù điêu|ấn|chuông|sách|cuốn|bản|vở|lược|huy hiệu|đèn|gầu|áo|cờ|kiếm|súng|dao|rìu|bút|bát|đĩa|chén|thư|nhật ký|bia|mộ|thuyền|ván|mũ|dép|chìa khóa|đồng hồ|máy|ống|quạt|lọ|đỉnh|khánh|tấm|cây hương|bức|phim|dây|gậy|bình vôi|tiền|tờ|cặp|hộp|khẩu|ấn tín|đài thờ|bệ thờ|cối|trâm|vòng|khuyên|kính|túi|ba lô|hòn|miếng|mảnh|giấy|bưu thiếp|chậu|thố|chum|thạp|thống|lọ hoa|lư|đàn|đồng tiền|cân)\b", re.I)
VIDEO_HOSTS = {"youtube.com", "www.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com", "vimeo.com", "player.vimeo.com"}


def clean(value):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def norm(value):
    return re.sub(r"[^a-z0-9]+", " ", unicodedata.normalize("NFD", str(value).lower().replace("đ", "d")).encode("ascii", "ignore").decode()).strip()


def safe_url(raw, base=SITE):
    p = urlsplit(urljoin(base, clean(raw)))
    if p.scheme not in {"http", "https"} or p.hostname not in HOSTS or p.username or p.password or p.port not in (None, 80, 443):
        raise ValueError("Source URL is outside the official institutional host")
    if re.search(r"/(?:admin|login|account|logout)(?:/|$)", p.path, re.I): raise ValueError("Non-public path")
    # All requests retain TLS verification, including inherited HTTP source links.
    return urlunsplit(("https", p.hostname, quote(unquote(p.path), safe="/%:@!$&'()*+,;=-._~"), p.query, ""))


class SafeRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return super().redirect_request(req, fp, code, msg, headers, safe_url(newurl))


def request(url, maximum=MAX_HTML):
    url = safe_url(url)
    for attempt in range(2):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.build_opener(SafeRedirect()).open(req, timeout=35) as response:
                safe_url(response.url)
                if response.status != 200: raise ValueError(f"HTTP {response.status}")
                data = response.read(maximum + 1)
                if len(data) > maximum: raise ValueError("Response exceeds importer size bound")
                return data
        except (urllib.error.URLError, TimeoutError, OSError):
            if attempt: raise
            time.sleep(0.6)


def snapshot_cache():
    p = ROOT / "data" / "expansion-samples.json"
    if not p.exists(): return {}
    return {safe_url(r["url"]): r["html"] for r in json.loads(p.read_text()) if r.get("status") == 200 and r.get("html") and urlsplit(r.get("url", "")).hostname in HOSTS}


def load_collection():
    content = (ROOT / "collection.js").read_text()
    prefix = "globalThis.MuseumCollection = "
    if prefix not in content: raise ValueError("Unexpected collection serialization")
    payload = json.loads(content.split(prefix, 1)[1].strip().removesuffix(";"))
    if not isinstance(payload.get("items"), list): raise ValueError("Collection items missing")
    return payload


def object_identity(name):
    text = norm(name)
    text = re.sub(r"^(?:bao vat quoc gia(?: viet nam)?|kham pha|ve|chuyen ke ve|cau chuyen ve|tim hieu ve)\s*", "", text)
    text = re.sub(r"\b(?:luu giu tai|tai bao tang lich su|trong suu tap|bao vat quoc gia tai|nhan dip)\b.*$", "", text)
    text = re.sub(r"\b(?:phan|ky)\s+(?:\d+|[ivx]+|va het).*$", "", text)
    for distinctive in ("hoang ha", "ngoc lu", "dao thinh", "canh thinh", "viet khe", "van ban", "mon ha", "nguyen phuc chu", "lach truong"):
        if distinctive in text:
            noun = next((n for n in ("trong", "thap", "mo thuyen", "chuong", "an", "o cua bien") if n in text), "")
            return clean(noun + " " + distinctive)
    text = re.sub(r"\b(?:chiec|cuon|ban|buc|co|hien vat)\b", " ", text)
    return clean(text)


def title_name(title):
    title = re.sub(r"^Bảo vật quốc gia(?: Việt Nam)?\s*[:–-]?\s*", "", title, flags=re.I)
    return clean(title)


def parse_fields(content):
    text = content.get_text("\n", strip=True)
    lines = [clean(x) for x in text.splitlines() if clean(x)]
    labels = {"chất liệu": "material", "niên đại": "era", "số đăng ký": "accession", "số kiểm kê": "accession", "ký hiệu": "accession", "kích thước": "dimensions", "nguồn gốc": "origin", "xuất xứ": "origin"}
    fields = {}
    evidence = {}
    for i, line in enumerate(lines):
        for label, key in labels.items():
            if re.match(r"^" + re.escape(label) + r"\s*:", line, re.I):
                value = re.sub(r"^" + re.escape(label) + r"\s*:\s*", "", line, flags=re.I)
                if not value and i + 1 < len(lines) and not any(lines[i+1].lower().startswith(k) for k in labels): value = lines[i+1]
                if value and key not in fields:
                    fields[key] = clean(value)[:500]
                    evidence[key] = clean(line + (" " + value if line.endswith(":") else ""))[:650]
    return fields, evidence


def extract_media(content, url, name):
    result = []
    for tag in content.select("iframe[src],video[src],source[src],a[href]"):
        raw = tag.get("src", tag.get("href", ""))
        p = urlsplit(urljoin(url, raw))
        if p.scheme != "https": continue
        if p.hostname not in VIDEO_HOSTS and not (p.hostname in HOSTS and re.search(r"\.(?:mp4|webm)$", p.path, re.I)): continue
        if p.hostname in {"youtube.com", "www.youtube.com"} and p.path == "/iframe_api": continue
        result.append({"url": p.geturl(), "title": clean(tag.get("title", tag.get_text(" ", strip=True))) or name, "sourcePage": url, "association": "embedded-on-object-source", "scope": "source-page", "rights": "source-linked; reuse not inferred"})
    return list({m["url"]: m for m in result}.values())


def parse_record(html, url):
    soup = BeautifulSoup(html, "html.parser")
    title = soup.select_one(".page-header")
    content = soup.select_one(".article-detail")
    abstract = soup.select_one(".article-abstracts")
    if not title or not content: raise ValueError("Missing object title or article content")
    original_title = clean(title.get_text(" ", strip=True))
    name = title_name(original_title)
    if len(name) < 4 or GROUP.search(name) or not OBJECT_NOUN.search(name): raise ValueError("Not a specific physical-object title")
    for bad in content.select("script,style,iframe,form,button"): bad.decompose()
    description = clean(content.get_text(" ", strip=True))
    abstract_text = clean(abstract.get_text(" ", strip=True)) if abstract else ""
    if len(description) < 120: raise ValueError("Insufficient object description")
    fields, evidence = parse_fields(content)
    # Do not count a survey as one object merely because the page is object-themed.
    if re.search(r"^(?:những|các|bộ sưu tập|sưu tập|một số)\s", name, re.I): raise ValueError("Grouped survey")
    hero = None
    for img in content.select("img[src]"):
        raw = img.get("src", "")
        if "/DataFiles/" not in raw or re.search(r"/(?:Avatar|Thumb|Thum)/|logo|banner|icon", raw, re.I): continue
        try: hero = safe_url(raw, url)
        except ValueError: continue
        break
    if not hero: raise ValueError("No source object photograph in article body")
    # Labeled source metadata wins. Fallbacks are literal quotations mentioning
    # the material, never an arbitrary background year or a keyword guess.
    material = fields.get("material", "")
    if not material:
        explicit = re.search(r"\b(?:làm|chế tác|đúc)\s+(?:bằng|từ)\s+((?:đồng|gỗ|đá|sắt|giấy|gốm|sứ|vàng|bạc|ngọc|mo tre|tre|da|vải|lụa|nhôm|thép|thủy tinh|ngà|xương)\b[^.;\n]{0,65})", name + ". " + abstract_text[:900] + " " + description[:1800], re.I)
        if explicit:
            material = clean(explicit.group(1)); evidence["material"] = clean(explicit.group(0))
    era = fields.get("era", "")
    summary = abstract_text if len(abstract_text) > 70 else description
    if len(summary) > 600:
        cut = summary[:600].rfind(". "); summary = summary[:cut+1] if cut > 150 else summary[:597] + "…"
    digest = sha256(url.encode()).hexdigest()[:12]
    accession = fields.get("accession", "")
    media = extract_media(content, url, name)
    # Institution scope is mandatory and never represented as a Da Nang floor.
    return {
        "id": "ref-nh-" + digest, "name": name, "en": name,
        "summary": summary, "enSummary": summary, "description": description[:24000],
        "origin": fields.get("origin", "Hồ sơ tham khảo do Bảo tàng Lịch sử Quốc gia công bố; xem nguồn gốc chi tiết trong bài nguồn."),
        "era": era or UNKNOWN, "material": material or UNKNOWN,
        "dimensions": fields.get("dimensions", ""), "accessionNumber": accession,
        "url": url, "sourceImage": hero, "image": "assets/reference/" + digest + ".webp",
        "sourceLanguage": "vi", "institutionId": "national-history", "institutionName": "Bảo tàng Lịch sử Quốc gia",
        "sourceSite": "national-history", "sourceSiteLabel": "Bảo tàng Lịch sử Quốc gia · Tham khảo ngoài Đà Nẵng",
        "referenceOnly": True, "locationVerified": False, "imported": True, "topic": "co-vat",
        "sourceFields": fields, "metadataEvidence": evidence,
        "metadataUnknown": [key for key, value in (("era", era), ("material", material)) if not value],
        "objectIdentity": object_identity(name), "sourceTitle": original_title,
        "media": media, "imageCredit": "Bảo tàng Lịch sử Quốc gia · ảnh trong hồ sơ nguồn",
    }


def catalogue_links(html, url):
    soup = BeautifulSoup(html, "html.parser")
    found = []
    # Both catalogue and source sidebar may contain valid object links. Only
    # category 1001/1002 URLs qualify; every candidate still passes detail review.
    for anchor in soup.select("a[href]"):
        try: u = safe_url(anchor["href"], url)
        except ValueError: continue
        if re.fullmatch(r"/vi/Articles/(?:1001|1002)/\d+/[^/]+\.html", unquote(urlsplit(u).path), re.I): found.append(u)
    return list(dict.fromkeys(found))


def prepare_candidate(url, cache):
    try:
        html = cache.get(url) or request(url).decode("utf-8", errors="replace")
        record = parse_record(html, url)
        data = request(record["sourceImage"], MAX_IMAGE)
        with Image.open(io.BytesIO(data)) as image:
            image.load()
            if min(image.size) < 160 or image.width * image.height > 80_000_000: raise ValueError("Invalid source image dimensions")
            photo = ImageOps.exif_transpose(image).convert("RGB")
            photo.thumbnail((1400, 1400))
            out = io.BytesIO(); photo.save(out, format="WEBP", quality=86, method=4)
        record["sourceImageSha256"] = sha256(data).hexdigest()
        record["imageWidth"], record["imageHeight"] = photo.size
        return record, out.getvalue(), None
    except Exception as error:
        return None, None, {"url": url, "reason": str(error)}


def main(target=200):
    existing = load_collection()
    original = list(existing["items"])
    legacy_count = int(existing.get("legacyCount", 9))
    old_count = legacy_count + len(original)
    if old_count != int(existing.get("totalCount", old_count)): raise ValueError("Existing collection count mismatch")
    cache = snapshot_cache()
    candidates = []
    skipped = []
    catalog_audit = []
    for category, slug, pages in CATEGORIES:
        base = f"{SITE}/vi/Articles/{category}/{slug}"
        page_urls = [base + (f"/Page{n}" if n > 1 else "") for n in range(1, pages + 1)]
        def get_page(url):
            try: return url, cache.get(url) or request(url).decode("utf-8", errors="replace"), None
            except Exception as error: return url, "", str(error)
        seen_pages = set()
        for url, html, error in ThreadPoolExecutor(max_workers=3).map(get_page, page_urls):
            if error: catalog_audit.append({"url": url, "error": error}); continue
            links = catalogue_links(html, url)
            fingerprint = sha256("\n".join(links).encode()).hexdigest()
            duplicate = fingerprint in seen_pages
            seen_pages.add(fingerprint)
            catalog_audit.append({"url": url, "links": len(links), "duplicatePage": duplicate})
            if not duplicate: candidates.extend(links)
    candidates = list(dict.fromkeys(candidates))
    # Omit URLs already retained, including a repeated invocation after success.
    existing_urls = {r["url"] for r in original}
    candidates = [u for u in candidates if u not in existing_urls][:MAX_CANDIDATES]
    needed = max(0, target - old_count)
    print(f"Existing: {old_count}; target: {target}; requested additions: {needed}; bounded official candidates: {len(candidates)}", flush=True)
    identities = {r.get("objectIdentity") or object_identity(r["name"]) for r in original}
    accessions = {norm(r.get("accessionNumber", "")) for r in original if r.get("accessionNumber")}
    images = {r.get("sourceImageSha256") for r in original if r.get("sourceImageSha256")}
    chosen = []
    # A bounded four-request batch avoids fetching the entire catalogue after the
    # verified target is reached. Native HTTPS official source responses only.
    for start in range(0, len(candidates), 4):
        if len(chosen) >= needed: break
        batch = candidates[start:start+4]
        for record, photo, error in ThreadPoolExecutor(max_workers=4).map(lambda u: prepare_candidate(u, cache), batch):
            if error:
                skipped.append(error); print("SKIP", error["url"], error["reason"], flush=True); continue
            identity = record["objectIdentity"]
            accession = norm(record.get("accessionNumber", ""))
            reason = "Duplicate physical-object identity" if identity in identities else "Duplicate accession" if accession and accession in accessions else "Duplicate original photograph" if record["sourceImageSha256"] in images else None
            if reason:
                skipped.append({"url": record["url"], "name": record["name"], "reason": reason}); continue
            if len(chosen) >= needed: break
            identities.add(identity); images.add(record["sourceImageSha256"])
            if accession: accessions.add(accession)
            chosen.append((record, photo)); print("ACCEPT", old_count + len(chosen), record["name"], "unknown:", record["metadataUnknown"], flush=True)
    for record, photo in chosen:
        p = ROOT / record["image"]; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(photo)
    result = {**existing, "fetchedAt": datetime.now(timezone.utc).isoformat(), "totalCount": old_count + len(chosen), "items": original + [r for r, _ in chosen], "referenceSources": [{"institutionId": "national-history", "name": "Bảo tàng Lịch sử Quốc gia", "url": SITE, "referenceOnly": True}], "referenceCount": sum(bool(r.get("referenceOnly")) for r in original) + len(chosen)}
    serialized = json.dumps(result, ensure_ascii=False, indent=2)
    (ROOT / "collection.js").write_text("/* Official source records; external references are institution-scoped. */\nglobalThis.MuseumCollection = " + serialized + ";\n")
    audit = {"capturedAt": result["fetchedAt"], "target": target, "originalRetained": old_count, "added": len(chosen), "total": result["totalCount"], "shortfall": max(0, target - result["totalCount"]), "candidateUrls": len(candidates), "cataloguePages": catalog_audit, "skipped": skipped, "records": [{"id": r["id"], "name": r["name"], "url": r["url"], "accessionNumber": r["accessionNumber"], "objectIdentity": r["objectIdentity"], "sourceImage": r["sourceImage"], "sourceImageSha256": r["sourceImageSha256"], "metadataUnknown": r["metadataUnknown"]} for r, _ in chosen]}
    (ROOT / "data" / "reference-import-audit.json").write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n")
    version = sha256(serialized.encode()).hexdigest()[:12]
    index = ROOT / "index.html"; index.write_text(re.sub(r"collection\.js(?:\?v=[^\"\s]+)?", "collection.js?v=" + version, index.read_text()))
    print("RESULT", json.dumps({k: audit[k] for k in ("target", "originalRetained", "added", "total", "shortfall")}), flush=True)
    # A quality shortfall is recorded honestly; it is not filled with duplicate
    # articles, news or invented objects. Valid additions remain reviewable.
    return audit


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", type=int, default=200)
    args = parser.parse_args()
    if not 57 <= args.target <= 200: parser.error("Target must be 57–200")
    main(args.target)
