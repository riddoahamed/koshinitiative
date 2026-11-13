#!/usr/bin/env python3
"""Read-only live cutover checks. No accounts, emails or visitor records created."""
import json
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class CanonicalParser(HTMLParser):
    canonical = None

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "link" and values.get("rel") == "canonical":
            self.canonical = values.get("href")


opener = urllib.request.build_opener(NoRedirect())
results = []


def check(url, status=200, location=None, canonical=None, content_type=None,
          method="GET", headers=None, sitemap=False, expected_headers=None):
    try:
        request = urllib.request.Request(url, method=method, headers={
            "User-Agent": "Kosh-domain-cutover-monitor/1.0", **(headers or {})})
        try:
            response = opener.open(request, timeout=20)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            actual_status = response.code
            response_headers = response.headers
            body = response.read()
        problems = []
        if actual_status != status:
            problems.append(f"HTTP {actual_status}, expected {status}")
        if location and response_headers.get("Location") != location:
            problems.append(f"redirect is {response_headers.get('Location')!r}")
        if content_type and not response_headers.get("Content-Type", "").startswith(content_type):
            problems.append(f"content type is {response_headers.get('Content-Type')!r}")
        for name, expected in (expected_headers or {}).items():
            if response_headers.get(name) != expected:
                problems.append(f"{name} is {response_headers.get(name)!r}, expected {expected!r}")
        if canonical:
            parser = CanonicalParser()
            parser.feed(body.decode("utf-8"))
            if (parser.canonical or "").rstrip("/") != canonical.rstrip("/"):
                problems.append(f"canonical is {parser.canonical!r}")
        if sitemap:
            root = ET.fromstring(body)
            locations = [node.text for node in root.findall(".//{*}loc")]
            if not locations or any(not x.startswith("https://koshfinance.com/") for x in locations):
                problems.append("sitemap contains missing or non-canonical URLs")
        results.append({"url": url, "ok": not problems, "problems": problems})
    except Exception as error:
        results.append({"url": url, "ok": False, "problems": [str(error)]})


for path in ("/", "/bd", "/global", "/learn", "/blog", "/bd/fdr-rates", "/bd/bn/fdr-rates"):
    check("https://koshfinance.com" + path, canonical="https://koshfinance.com" + path)
for old, new in (
    ("https://koshbd.com/", "https://koshfinance.com/bd"),
    ("https://www.koshbd.com/", "https://koshfinance.com/bd"),
    ("https://www.koshbd.com/fdr-rates?utm_source=cutover-monitor", "https://koshfinance.com/bd/fdr-rates?utm_source=cutover-monitor"),
    ("https://koshbd.com/rsvp?event=nsu-learn-investing", "https://koshfinance.com/bd/rsvp?event=nsu-learn-investing"),
    ("https://koshbd.com/learn", "https://koshfinance.com/learn"),
    ("https://www.koshfinance.com/", "https://koshfinance.com/"),
):
    check(old, status=301, location=new)
check("https://koshfinance.com/sitemap.xml", sitemap=True)
check("https://app.koshfinance.com/auth", content_type="text/html")
check("https://app.koshfinance.com/auth", canonical="https://app.koshfinance.com/auth",
      headers={"User-Agent": "facebookexternalhit/1.1"})
check("https://app.koshfinance.com/manifest.webmanifest", content_type="application/manifest+json")
check("https://app.koshfinance.com/.well-known/assetlinks.json", content_type="application/json")
check("https://app.koshfinance.com/api/og", content_type="image/png")
check("https://koshfinance.com/bd/rsvp?event=nsu-learn-investing", canonical="https://koshfinance.com/bd/rsvp")
check("https://koshfinance.com/bd/tv/", canonical="https://koshfinance.com/bd/tv/")
check("https://koshfinance.com/bd/tv/newsroom.css", content_type="text/css")
check("https://uitdqikuodlrhrfjcnsz.supabase.co/functions/v1/event-rsvp", status=204,
      method="OPTIONS", headers={"Origin": "https://koshfinance.com"},
      expected_headers={"Access-Control-Allow-Origin": "https://koshfinance.com"})
check("https://uitdqikuodlrhrfjcnsz.supabase.co/functions/v1/event-rsvp", status=403,
      method="OPTIONS", headers={"Origin": "https://unrelated.invalid"})

failed = [item for item in results if not item["ok"]]
print(json.dumps({"passed": len(results) - len(failed), "total": len(results), "failures": failed}, indent=2))
sys.exit(bool(failed))
