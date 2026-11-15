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
HOSTS = {"baotanglichsu.vn", "www.baotanglichsu.vn", "api.vam.ac.uk", "collections.vam.ac.uk", "framemark.vam.ac.uk", "openaccess-api.clevelandart.org", "images.clevelandart.org", "openaccess-cdn.clevelandart.org", "clevelandart.org", "www.clevelandart.org", "api.artic.edu", "www.artic.edu"}
SITE = "https://baotanglichsu.vn"
MAX_HTML = 5 * 1024 * 1024
MAX_IMAGE = 15 * 1024 * 1024
MAX_CANDIDATES = 400
UNKNOWN = "Chưa có dữ liệu xác minh trong hồ sơ nguồn"
CATEGORIES = [(1001, "bao-vat-quoc-gia", 7), (1002, "hien-vat", 23)]
API_DETAIL_SAMPLES = {}
HEADERS = {"User-Agent": "MuseumCompanion/6.4 official physical-object reference import", "Accept": "text/html,image/*"}
GROUP = re.compile(r"^(?:những|các|một số|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười|sưu tập|bộ sưu tập|vài nét|đôi nét|tổng quan)\b|\b(?:phần|kỳ)\s*(?:\d+|[ivx]+|cuối|đầu)|\b(?:hội thảo|hội nghị|trưng bày chuyên đề|triển lãm|công tác bảo quản|kỹ thuật bảo quản|hoạt động|khai mạc|lễ tiếp nhận|đón nhận|thông báo)\b", re.I)
OBJECT_NOUN = re.compile(r"\b(?:trống|thạp|bình|lọ|tượng|phù điêu|ấn|chuông|sách|cuốn|bản|vở|lược|huy hiệu|đèn|gầu|áo|cờ|kiếm|súng|dao|rìu|bút|bát|đĩa|chén|thư|nhật ký|bia|mộ|thuyền|ván|mũ|dép|chìa khóa|đồng hồ|máy|ống|quạt|lọ|đỉnh|khánh|tấm|cây hương|bức|phim|dây|gậy|bình vôi|tiền|tờ|cặp|hộp|khẩu|ấn tín|đài thờ|bệ thờ|cối|trâm|vòng|khuyên|kính|túi|ba lô|hòn|miếng|mảnh|giấy|bưu thiếp|chậu|thố|chum|thạp|thống|lọ hoa|lư|đàn|đồng tiền|cân)\b", re.I)
VIDEO_HOSTS = {"youtube.com", "www.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com", "vimeo.com", "player.vimeo.com"}


def clean(value):
    return re.sub(r"\s+", " ", unicodedata.normalize("NFC", str(value or ""))).strip()


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
    # Distinctive historical objects occur in older and newer articles with
    # different photos and narrative prefixes. They remain one physical record.
    aliases = {
        "duong kach menh": "sach duong kach menh", "nguc trung nhat ky": "sach nguc trung nhat ky",
        "nhat ky trong tu": "sach nguc trung nhat ky", "viet khe": "mo thuyen viet khe",
        "hoang ha": "trong hoang ha", "ngoc lu": "trong ngoc lu", "dao thinh": "thap dao thinh",
        "canh thinh": "trong canh thinh", "van ban": "chuong van ban", "mon ha": "an mon ha",
        "vo canh": "bia vo canh", "nam giao": "bia nam giao", "cong nhau thoi khen": "tuong nguoi cong nhau thoi khen",
        "den hinh nguoi quy": "den hinh nguoi quy", "nguyen phuc chu": "an nguyen phuc chu",
        "lach truong": "o cua bien lach truong",
    }
    if "binh" in text and "thien nga" in text: return "binh ve thien nga"
    for phrase, key in aliases.items():
        if phrase in text: return key
    text = re.sub(r"^(?:gioi thieu )?(?:bao vat quoc gia(?: viet nam)?[ .\d]*|kham pha|ve|chuyen ke ve|cau chuyen ve|tim hieu ve)\s*", "", text)
    text = re.sub(r"\b(?:luu giu tai|tai bao tang lich su|trong suu tap|bao vat quoc gia tai|nhan dip)\b.*$", "", text)
    text = re.sub(r"\b(?:phan|ky)\s+(?:\d+|[ivx]+|va het).*$", "", text)
    text = re.sub(r"\b(?:chiec|cuon|ban|buc|hien vat)\b", " ", text)
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
    soup = BeautifulSoup(unicodedata.normalize("NFC", html), "html.parser")
    title = soup.select_one(".page-header")
    content = soup.select_one(".article-detail")
    abstract = soup.select_one(".article-abstracts")
    if not title or not content: raise ValueError("Missing object title or article content")
    original_title = clean(title.get_text(" ", strip=True))
    name = title_name(original_title)
    if re.search(r"^(?:anh hùng|liệt sĩ|chủ tịch|đồng chí|danh nhân)\b", name, re.I): raise ValueError("Person biography, not object record")
    if re.search(r",\s*(?:nghiên|quả cân|đấu đong|thước|hộp|tượng|trống|bình)\b", name, re.I): raise ValueError("Combined unrelated object survey")
    if len(name) < 4 or GROUP.search(name) or not OBJECT_NOUN.search(name): raise ValueError("Not a specific physical-object title")
    embedded_media = extract_media(content, url, name)
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
        if not raw or re.search(r"/(?:Avatar|Thumb|Thum)/|logo|banner|icon", raw, re.I): continue
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
    if not era or not material: raise ValueError("Missing literal artifact date or material; no invented metadata")
    summary = abstract_text if len(abstract_text) > 70 else description
    if len(summary) > 600:
        cut = summary[:600].rfind(". "); summary = summary[:cut+1] if cut > 150 else summary[:597] + "…"
    digest = sha256(url.encode()).hexdigest()[:12]
    accession = fields.get("accession", "")
    media = embedded_media
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


def literal(value):
    if isinstance(value, str): return clean(BeautifulSoup(value, "html.parser").get_text(" ", strip=True))
    if isinstance(value, dict):
        for key in ("text", "title", "value", "label", "name"):
            if value.get(key): return literal(value[key])
        return ""
    if isinstance(value, list): return "; ".join(filter(None, (literal(v) for v in value)))
    return ""


def read_json(url):
    return json.loads(request(url).decode("utf-8"))


def is_vietnam(place):
    return bool(re.search(r"\b(?:vietnam|viet nam)\b", norm(place)))


def validate_api_photo(record):
    data = request(record["sourceImage"], MAX_IMAGE)
    with Image.open(io.BytesIO(data)) as image:
        image.load()
        if min(image.size) < 160 or image.width * image.height > 80_000_000: raise ValueError("Invalid API object image dimensions")
        photo = ImageOps.exif_transpose(image).convert("RGB"); photo.thumbnail((1400, 1400))
        out = io.BytesIO(); photo.save(out, format="WEBP", quality=86, method=4)
    record["sourceImageSha256"] = sha256(data).hexdigest()
    record["imageWidth"], record["imageHeight"] = photo.size
    return record, out.getvalue()


def api_base_record(*, institution_id, institution_name, identifier, accession, name, era, material, place, description, url, image, credit, source_api):
    if not name or not era or not material or not is_vietnam(place): raise ValueError("Missing date/material or verified Vietnamese origin")
    source_title = name
    name = name + " · " + (accession or identifier)
    digest = sha256(url.encode()).hexdigest()[:12]
    facts = f"{name}. {place}. {era}. {material}."
    description = description or facts
    return {"id": "ref-" + institution_id + "-" + digest, "name": name, "en": name, "summary": description[:600], "enSummary": description[:600], "description": description[:24000], "origin": place, "era": era, "material": material, "dimensions": "", "accessionNumber": accession or identifier, "url": url, "sourceImage": image, "image": "assets/reference/" + digest + ".webp", "sourceLanguage": "en", "institutionId": institution_id, "institutionName": institution_name, "sourceSite": institution_id, "sourceSiteLabel": institution_name + " · Tham khảo hiện vật liên quan Việt Nam", "referenceOnly": True, "locationVerified": False, "imported": True, "topic": "co-vat", "sourceFields": {"name": name, "date": era, "material": material, "placeOfOrigin": place, "accession": accession}, "metadataEvidence": {"origin": place, "era": era, "material": material}, "metadataUnknown": [], "objectIdentity": institution_id + ":" + (accession or identifier), "sourceTitle": source_title, "sourceApi": source_api, "media": [], "imageCredit": credit}


def vam_candidate(hit):
    identifier = clean(hit.get("systemNumber"))
    if not re.fullmatch(r"O\d+", identifier): raise ValueError("Missing V&A object ID")
    # Search is not authority for origin; require the actual object's origin field.
    api = "https://api.vam.ac.uk/v2/museumobject/" + identifier
    payload = read_json(api); API_DETAIL_SAMPLES.setdefault("vam", payload); obj = payload.get("record", payload)
    places = obj.get("placesOfOrigin", [])
    place = "; ".join(filter(None, (literal(p.get("place", p)) + (" (" + literal(p.get("association")) + ")" if literal(p.get("association")) else "") for p in places if isinstance(p, dict))))
    if not is_vietnam(place): raise ValueError("V&A object has no structured place association with Vietnam")
    name = literal(hit.get("_primaryTitle")) or literal(obj.get("titles")) or literal(obj.get("objectType"))
    object_type = literal(obj.get("objectType")) or literal(hit.get("objectType"))
    if object_type and object_type.lower() not in name.lower(): name = object_type + ": " + name
    dates = obj.get("productionDates", [])
    era = "; ".join(filter(None, (literal(v.get("date", v)) for v in dates if isinstance(v, dict)))) or literal(hit.get("_primaryDate"))
    material = literal(obj.get("materialsAndTechniques")) or literal(obj.get("materials"))
    image_info = hit.get("_images", {})
    base = image_info.get("_iiif_image_base_url", "")
    if base and "/full/" not in base: image = base.rstrip("/") + "/full/!1200,1200/0/default.jpg"
    elif base: image = base
    elif hit.get("_primaryImageId"): image = "https://framemark.vam.ac.uk/collections/" + clean(hit["_primaryImageId"]) + "/full/!1200,1200/0/default.jpg"
    else: raise ValueError("No V&A official primary photograph")
    description = literal(obj.get("summaryDescription")) or literal(obj.get("briefDescription")) or literal(obj.get("physicalDescription"))
    result = api_base_record(institution_id="vam", institution_name="Victoria and Albert Museum", identifier=identifier, accession=literal(obj.get("accessionNumber")), name=name, era=era, material=material, place=place, description=description, url="https://collections.vam.ac.uk/item/" + identifier + "/", image=safe_url(image), credit="Victoria and Albert Museum · " + literal(obj.get("creditLine")), source_api=api)
    result["dimensions"] = "; ".join(clean(" ".join(filter(None, (literal(d.get("dimension")), literal(d.get("value")), literal(d.get("unit")), literal(d.get("qualifier")))))) for d in obj.get("dimensions", []) if isinstance(d, dict))
    result["sourceFields"]["dimensions"] = result["dimensions"]
    result["originAssociations"] = [{"place": literal(p.get("place")), "association": literal(p.get("association")), "note": literal(p.get("note"))} for p in places if isinstance(p, dict)]
    result["imageRights"] = "; ".join(filter(None, (literal(p.get("copyright")) for p in payload.get("meta", {}).get("images", {}).get("_images_meta", []) if isinstance(p, dict))))
    if result["imageRights"]: result["imageCredit"] += " · " + result["imageRights"]
    public_link = payload.get("meta", {}).get("_links", {}).get("collection_page", {}).get("href")
    if public_link and urlsplit(public_link).hostname == "collections.vam.ac.uk": result["url"] = safe_url(public_link)
    return result


def cleveland_candidate(obj):
    identifier = str(obj.get("id", "")); place = literal(obj.get("culture"))
    if not is_vietnam(place): raise ValueError("Cleveland search result lacks Vietnamese culture/origin")
    if obj.get("share_license_status") not in ("CC0", "CC0 1.0"): raise ValueError("Cleveland photo does not carry a CC0 record")
    image = obj.get("images", {}).get("web", {}).get("url", "")
    if not image: raise ValueError("No official Cleveland object photo")
    description = literal(obj.get("description")) or literal(obj.get("tombstone"))
    result = api_base_record(institution_id="cleveland", institution_name="Cleveland Museum of Art", identifier=identifier, accession=literal(obj.get("accession_number")), name=literal(obj.get("title")), era=literal(obj.get("creation_date")), material=literal(obj.get("technique")), place=place, description=description, url=safe_url(obj.get("url") or "https://www.clevelandart.org/art/" + literal(obj.get("accession_number"))), image=safe_url(image), credit="Cleveland Museum of Art · CC0 · " + literal(obj.get("creditline")), source_api="https://openaccess-api.clevelandart.org/api/artworks/" + identifier)
    result["dimensions"] = literal(obj.get("measurements"))
    result["imageRights"] = "CC0"
    return result


def supplement_references(needed, identities, accessions, images, skipped):
    chosen = []; api_audit = []
    # Search queries are only candidate discovery. Each accepted record requires
    # object-level origin/date/material plus an actual decoded local photograph.
    for provider in ("vam", "cleveland"):
        if len(chosen) >= needed: break
        for page in range(1, 7):
            if len(chosen) >= needed: break
            api = (f"https://api.vam.ac.uk/v2/objects/search?q=Vietnam&page_size=100&images_exist=1&page={page}" if provider == "vam" else f"https://openaccess-api.clevelandart.org/api/artworks/?q=Vietnam&has_image=1&limit=100&skip={(page-1)*100}")
            try:
                payload = read_json(api)
                hits = payload.get("records", []) if provider == "vam" else payload.get("data", [])
                if not isinstance(hits, list): raise ValueError("Unexpected official API record schema")
                api_audit.append({"url": api, "responseKeys": list(payload)[:20], "candidates": len(hits), "sample": hits[:1]})
                print("API", provider, "page", page, "candidates", len(hits), flush=True)
            except Exception as error:
                api_audit.append({"url": api, "error": str(error)}); print("API ERROR", api, str(error), flush=True); break
            if not hits: break
            def prepare(hit):
                try:
                    record = vam_candidate(hit) if provider == "vam" else cleveland_candidate(hit)
                    record, photo = validate_api_photo(record)
                    return record, photo, None
                except Exception as error: return None, None, {"provider": provider, "identifier": str(hit.get("systemNumber", hit.get("id", ""))), "reason": str(error)}
            for start in range(0, len(hits), 4):
                if len(chosen) >= needed: break
                for record, photo, error in ThreadPoolExecutor(max_workers=4).map(prepare, hits[start:start+4]):
                    if error: skipped.append(error); print("API SKIP", error, flush=True); continue
                    if record["objectIdentity"] in identities or record["sourceImageSha256"] in images:
                        skipped.append({"url": record["url"], "reason": "Duplicate API physical object or photograph"}); continue
                    if len(chosen) >= needed: break
                    identities.add(record["objectIdentity"]); images.add(record["sourceImageSha256"])
                    chosen.append((record, photo)); print("API ACCEPT", len(chosen), record["name"], record["era"], flush=True)
            if len(hits) < 100: break
    return chosen, api_audit


def main(target=200):
    existing = load_collection()
    previous_references = [r for r in existing["items"] if r.get("referenceOnly")]
    # Always re-review the entire external selection under the current rules.
    # The original 48 Da Nang additions + 9 legacy records remain unchanged.
    original = [r for r in existing["items"] if not r.get("referenceOnly")]
    legacy_count = int(existing.get("legacyCount", 9))
    old_count = legacy_count + len(original)
    if old_count != 57: raise ValueError("Expected the original 57 Da Nang objects; refusing to overwrite another base")
    cache = snapshot_cache()
    candidates = []; skipped = []; catalog_audit = []
    needed = max(0, target - old_count)
    identities = {r.get("objectIdentity") or object_identity(r["name"]) for r in original}
    accessions = {norm(r.get("accessionNumber", "")) for r in original if r.get("accessionNumber")}
    images = {r.get("sourceImageSha256") for r in original if r.get("sourceImageSha256")}
    chosen = []
    for old in previous_references:
        name = clean(old["name"])
        identity = object_identity(name)
        if old.get("institutionId") != "national-history": continue
        if GROUP.search(name) or re.search(r"^(?:anh hùng|liệt sĩ|chủ tịch|đồng chí|danh nhân)\b|,\s*(?:nghiên|quả cân|đấu đong|thước|hộp)\b", name, re.I): continue
        if old.get("metadataUnknown") or UNKNOWN in old.get("era", "") or UNKNOWN in old.get("material", ""): continue
        if identity in identities or old.get("sourceImageSha256") in images: continue
        file = ROOT / old["image"]
        try:
            data = file.read_bytes()
            with Image.open(io.BytesIO(data)) as photo: photo.load(); assert min(photo.size) >= 128
        except Exception: continue
        old = dict(old); old["name"] = name; old["objectIdentity"] = identity
        identities.add(identity); images.add(old["sourceImageSha256"])
        chosen.append((old, data))
    print("Re-reviewed complete National records:", len(chosen), flush=True)
    supplemental, api_audit = supplement_references(max(0, needed - len(chosen)), identities, accessions, images, skipped)
    chosen.extend(supplemental)
    # Prefer structured complete object records. Only revisit the National HTML
    # catalogue when the official API holdings leave a genuine shortfall.
    if len(chosen) < needed:
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
    existing_urls = {r["url"] for r in original + [r for r, _ in chosen]}
    candidates = [u for u in candidates if u not in existing_urls][:MAX_CANDIDATES]
    print(f"Existing: {old_count}; selected references: {len(chosen)}; remaining HTML candidates: {len(candidates)}", flush=True)
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
    # Remove obsolete photos only when no retained record references that path.
    retained_paths = {r["image"] for r in original + [r for r, _ in chosen]}
    removed = []
    for old in previous_references:
        removed.append({"id": old["id"], "name": old["name"], "url": old["url"], "reason": "Re-reviewed under current identity and literal metadata rules", "replaced": any(r["url"] == old["url"] for r, _ in chosen)})
        old_path = ROOT / old.get("image", "")
        if old.get("image", "").startswith("assets/reference/") and old.get("image") not in retained_paths and old_path.is_file(): old_path.unlink()
    for record, photo in chosen:
        p = ROOT / record["image"]; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(photo)
    from enrich_object_videos import enrich_object_videos
    try:
        video_audit = enrich_object_videos(original + [r for r, _ in chosen], ROOT)
        print("VERIFIED OBJECT VIDEOS", video_audit["matchedObjectCount"], flush=True)
    except Exception as error:
        print("VIDEO DISCOVERY UNAVAILABLE", str(error), flush=True)
        (ROOT / "data" / "extra-video-audit.json").write_text(json.dumps({"error":str(error),"matchedObjectCount":0})+"\n")
    result = {**existing, "fetchedAt": datetime.now(timezone.utc).isoformat(), "totalCount": old_count + len(chosen), "items": original + [r for r, _ in chosen], "referenceSources": [{"institutionId": key, "name": next(r["institutionName"] for r, _ in chosen if r["institutionId"] == key), "referenceOnly": True} for key in sorted({r["institutionId"] for r, _ in chosen})], "referenceCount": sum(bool(r.get("referenceOnly")) for r in original) + len(chosen)}
    serialized = json.dumps(result, ensure_ascii=False, indent=2)
    (ROOT / "collection.js").write_text("/* Official source records; external references are institution-scoped. */\nglobalThis.MuseumCollection = " + serialized + ";\n")
    audit = {"capturedAt": result["fetchedAt"], "target": target, "originalRetained": old_count, "added": len(chosen), "total": result["totalCount"], "shortfall": max(0, target - result["totalCount"]), "candidateUrls": len(candidates), "cataloguePages": catalog_audit, "apiSources": api_audit, "apiObjectSchemaSamples": API_DETAIL_SAMPLES, "reReviewedPreviousReferences": removed, "skipped": skipped, "records": [{"id": r["id"], "name": r["name"], "url": r["url"], "accessionNumber": r["accessionNumber"], "objectIdentity": r["objectIdentity"], "sourceImage": r["sourceImage"], "sourceImageSha256": r["sourceImageSha256"], "metadataUnknown": r["metadataUnknown"]} for r, _ in chosen]}
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
