"""
Event scraper that discovers conservative/Republican political events
from multiple sources and stores them in AirTable.
"""

import logging
import re
from datetime import datetime, timezone
from typing import Optional
from urllib.parse import urljoin

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

# Conservative / Republican event sources
SCRAPE_TARGETS = [
    {
        "name": "Heritage Foundation",
        "url": "https://www.heritage.org/events",
        "parser": "heritage",
    },
    {
        "name": "American Enterprise Institute",
        "url": "https://www.aei.org/events/",
        "parser": "aei",
    },
    {
        "name": "Cato Institute",
        "url": "https://www.cato.org/events",
        "parser": "cato",
    },
    {
        "name": "Manhattan Institute",
        "url": "https://www.manhattan-institute.org/events",
        "parser": "generic",
    },
    {
        "name": "Federalist Society",
        "url": "https://fedsoc.org/events",
        "parser": "generic",
    },
    {
        "name": "Americans for Prosperity",
        "url": "https://americansforprosperity.org/events/",
        "parser": "generic",
    },
    {
        "name": "Turning Point USA",
        "url": "https://www.tpusa.com/events",
        "parser": "generic",
    },
    {
        "name": "RNC",
        "url": "https://www.gop.com/events/",
        "parser": "generic",
    },
    {
        "name": "CPAC",
        "url": "https://cpac.conservative.org/events/",
        "parser": "generic",
    },
    {
        "name": "Club for Growth",
        "url": "https://www.clubforgrowth.org/events/",
        "parser": "generic",
    },
    {
        "name": "Susan B. Anthony Pro-Life America",
        "url": "https://sbaprolife.org/events",
        "parser": "generic",
    },
    {
        "name": "NRA",
        "url": "https://www.nra.org/events",
        "parser": "generic",
    },
    {
        "name": "Faith & Freedom Coalition",
        "url": "https://www.ffcoalition.com/events/",
        "parser": "generic",
    },
    {
        "name": "Young America's Foundation",
        "url": "https://www.yaf.org/events/",
        "parser": "generic",
    },
]

# Keywords to identify conservative/Republican events on general platforms
CONSERVATIVE_KEYWORDS = [
    "republican",
    "conservative",
    "gop",
    "maga",
    "trump",
    "right wing",
    "pro-life",
    "second amendment",
    "2a",
    "liberty",
    "freedom caucus",
    "tea party",
    "patriot",
    "america first",
    "federalist",
    "heritage foundation",
    "turning point",
    "cpac",
    "faith and freedom",
    "evangelical",
    "pro-gun",
    "limited government",
    "free market",
]


class EventScraper:
    """Scrapes events from conservative organization websites."""

    def __init__(self):
        self.client = httpx.AsyncClient(
            timeout=30.0,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; EcosystemResearchBot/1.0)"
            },
            follow_redirects=True,
        )

    async def close(self):
        await self.client.aclose()

    async def scrape_all(self) -> list[dict]:
        """Scrape all configured targets and return normalized events."""
        all_events = []
        for target in SCRAPE_TARGETS:
            try:
                events = await self._scrape_target(target)
                all_events.extend(events)
                logger.info(
                    f"Scraped {len(events)} events from {target['name']}"
                )
            except Exception as e:
                logger.error(f"Failed to scrape {target['name']}: {e}")
        return all_events

    async def _scrape_target(self, target: dict) -> list[dict]:
        """Scrape a single target and return normalized events."""
        response = await self.client.get(target["url"])
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "lxml")

        parser = getattr(self, f"_parse_{target['parser']}", self._parse_generic)
        events = parser(soup, target)
        return events

    def _parse_heritage(self, soup: BeautifulSoup, target: dict) -> list[dict]:
        """Parse Heritage Foundation events page."""
        events = []
        for item in soup.select(".event-item, .event-card, article.event"):
            event = self._extract_event_common(item, target)
            if event:
                events.append(event)
        if not events:
            events = self._parse_generic(soup, target)
        return events

    def _parse_aei(self, soup: BeautifulSoup, target: dict) -> list[dict]:
        """Parse AEI events page."""
        events = []
        for item in soup.select(".event-listing, .event-card, .post-listing"):
            event = self._extract_event_common(item, target)
            if event:
                events.append(event)
        if not events:
            events = self._parse_generic(soup, target)
        return events

    def _parse_cato(self, soup: BeautifulSoup, target: dict) -> list[dict]:
        """Parse Cato Institute events page."""
        events = []
        for item in soup.select(".event-listing, .event, article"):
            event = self._extract_event_common(item, target)
            if event:
                events.append(event)
        if not events:
            events = self._parse_generic(soup, target)
        return events

    def _parse_generic(self, soup: BeautifulSoup, target: dict) -> list[dict]:
        """Generic parser that looks for common event patterns in HTML."""
        events = []

        # Look for structured data (JSON-LD)
        for script in soup.select('script[type="application/ld+json"]'):
            try:
                import json

                data = json.loads(script.string)
                if isinstance(data, list):
                    for item in data:
                        event = self._parse_jsonld_event(item, target)
                        if event:
                            events.append(event)
                elif isinstance(data, dict):
                    if data.get("@type") == "Event":
                        event = self._parse_jsonld_event(data, target)
                        if event:
                            events.append(event)
                    elif data.get("@type") == "ItemList":
                        for item in data.get("itemListElement", []):
                            event = self._parse_jsonld_event(
                                item.get("item", item), target
                            )
                            if event:
                                events.append(event)
            except (ValueError, KeyError):
                continue

        # Fall back to common CSS selectors for event cards
        if not events:
            selectors = [
                ".event-card",
                ".event-item",
                ".event-listing",
                ".events-list li",
                'article[class*="event"]',
                '[class*="event-"]',
                ".tribe-events-calendar-list__event",
            ]
            for selector in selectors:
                items = soup.select(selector)
                if items:
                    for item in items:
                        event = self._extract_event_common(item, target)
                        if event:
                            events.append(event)
                    break

        return events

    def _parse_jsonld_event(self, data: dict, target: dict) -> Optional[dict]:
        """Parse a JSON-LD Event object."""
        if not isinstance(data, dict):
            return None
        if data.get("@type") not in ("Event", "SocialEvent", "BusinessEvent"):
            return None

        location_data = data.get("location", {})
        if isinstance(location_data, dict):
            location_name = location_data.get("name", "")
            address = location_data.get("address", {})
            if isinstance(address, dict):
                city = address.get("addressLocality", "")
                state = address.get("addressRegion", "")
                full_address = address.get("streetAddress", "")
            else:
                city, state, full_address = "", "", str(address)
        else:
            location_name = str(location_data)
            city, state, full_address = "", "", ""

        return {
            "Name": data.get("name", ""),
            "Description": data.get("description", ""),
            "Organizer": target["name"],
            "Start Date": data.get("startDate", ""),
            "End Date": data.get("endDate", ""),
            "Location": location_name,
            "City": city,
            "State": state,
            "Address": full_address,
            "Registration URL": data.get("url", ""),
            "Source URL": target["url"],
        }

    def _extract_event_common(
        self, element: BeautifulSoup, target: dict
    ) -> Optional[dict]:
        """Extract event data from an HTML element using common patterns."""
        # Try to find title
        title_el = element.select_one(
            "h2, h3, h4, .event-title, .title, [class*='title']"
        )
        if not title_el:
            return None
        title = title_el.get_text(strip=True)
        if not title:
            return None

        # Try to find link
        link_el = element.select_one("a[href]")
        link = ""
        if link_el:
            link = urljoin(target["url"], link_el.get("href", ""))

        # Try to find date
        date_el = element.select_one(
            "time, .date, .event-date, [class*='date'], [datetime]"
        )
        date_str = ""
        if date_el:
            date_str = date_el.get("datetime", "") or date_el.get_text(strip=True)

        # Try to find location
        loc_el = element.select_one(
            ".location, .venue, .event-location, [class*='location']"
        )
        location = ""
        if loc_el:
            location = loc_el.get_text(strip=True)

        # Try to find description
        desc_el = element.select_one(
            ".description, .summary, .excerpt, p"
        )
        description = ""
        if desc_el:
            description = desc_el.get_text(strip=True)[:500]

        # Parse city/state from location string
        city, state = self._parse_location(location)

        return {
            "Name": title,
            "Description": description,
            "Organizer": target["name"],
            "Start Date": self._normalize_date(date_str),
            "Location": location,
            "City": city,
            "State": state,
            "Registration URL": link,
            "Source URL": target["url"],
        }

    @staticmethod
    def _parse_location(location: str) -> tuple[str, str]:
        """Try to extract city and state from a location string."""
        if not location:
            return "", ""
        # Match "City, ST" or "City, State"
        match = re.search(
            r"([A-Za-z\s]+),\s*([A-Z]{2})\b", location
        )
        if match:
            return match.group(1).strip(), match.group(2)
        return "", ""

    @staticmethod
    def _normalize_date(date_str: str) -> str:
        """Try to parse various date formats into ISO format."""
        if not date_str:
            return ""
        # Already ISO format
        if re.match(r"\d{4}-\d{2}-\d{2}", date_str):
            return date_str
        # Common date formats
        formats = [
            "%B %d, %Y",
            "%b %d, %Y",
            "%m/%d/%Y",
            "%B %d, %Y %I:%M %p",
            "%b %d, %Y %I:%M %p",
            "%A, %B %d, %Y",
        ]
        for fmt in formats:
            try:
                dt = datetime.strptime(date_str.strip(), fmt)
                return dt.strftime("%Y-%m-%dT%H:%M:%S.000Z")
            except ValueError:
                continue
        return date_str


async def scrape_eventbrite_conservative(
    client: httpx.AsyncClient,
) -> list[dict]:
    """Search Eventbrite for conservative political events."""
    events = []
    search_terms = [
        "republican party event",
        "conservative conference",
        "GOP fundraiser",
        "MAGA rally",
        "Republican women",
        "Young Republicans",
    ]
    for term in search_terms:
        try:
            response = await client.get(
                "https://www.eventbrite.com/d/united-states/political-events/",
                params={"q": term, "page": 1},
            )
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, "lxml")
                for card in soup.select(
                    '[class*="event-card"], [data-testid*="event"]'
                ):
                    title_el = card.select_one("h2, h3, [class*='title']")
                    if title_el:
                        title = title_el.get_text(strip=True)
                        # Check if it's actually conservative
                        text_lower = (title + " " + card.get_text()).lower()
                        if any(kw in text_lower for kw in CONSERVATIVE_KEYWORDS):
                            link_el = card.select_one("a[href]")
                            events.append(
                                {
                                    "Name": title,
                                    "Organizer": "Eventbrite",
                                    "Source URL": link_el.get("href", "")
                                    if link_el
                                    else "",
                                }
                            )
        except Exception as e:
            logger.error(f"Eventbrite search for '{term}' failed: {e}")
    return events
