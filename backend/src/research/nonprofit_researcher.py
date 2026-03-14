"""
Nonprofit (IRS 990) data researcher.

Uses ProPublica's Nonprofit Explorer API to discover 501(c)(3) and 501(c)(4)
organizations and their financial data.
"""

import logging
from typing import Optional

import httpx

from backend.config.settings import settings

logger = logging.getLogger(__name__)

PROPUBLICA_BASE_URL = "https://projects.propublica.org/nonprofits/api/v2"

# Well-known conservative nonprofits to seed and track
SEED_ORGANIZATIONS = [
    "Heritage Foundation",
    "American Enterprise Institute",
    "Cato Institute",
    "Manhattan Institute",
    "Federalist Society",
    "Americans for Prosperity Foundation",
    "Charles Koch Foundation",
    "Judicial Watch",
    "Freedom Works",
    "Club for Growth",
    "American Legislative Exchange Council",
    "Claremont Institute",
    "Hillsdale College",
    "Intercollegiate Studies Institute",
    "Media Research Center",
    "National Rifle Association",
    "Susan B Anthony Pro-Life America",
    "Faith and Freedom Coalition",
    "Family Research Council",
    "American Center for Law and Justice",
    "Alliance Defending Freedom",
    "Pacific Legal Foundation",
    "Institute for Justice",
    "Competitive Enterprise Institute",
    "Discovery Institute",
    "Hudson Institute",
    "Hoover Institution",
    "American Conservative Union",
    "Young Americas Foundation",
    "Leadership Institute",
    "Turning Point USA",
    "PragerU",
    "Daily Wire",
    "Breitbart News Network",
    "Salem Communications",
    "Sinclair Broadcast Group",
]


class NonprofitResearcher:
    """Fetches nonprofit financial data from ProPublica."""

    def __init__(self):
        self.client = httpx.AsyncClient(
            base_url=PROPUBLICA_BASE_URL,
            timeout=30.0,
        )

    async def close(self):
        await self.client.aclose()

    async def search_organizations(
        self, query: str, page: int = 0
    ) -> list[dict]:
        """Search for nonprofit organizations by name."""
        try:
            response = await self.client.get(
                "/search.json", params={"q": query, "page": page}
            )
            response.raise_for_status()
            data = response.json()
            return self._normalize_results(data.get("organizations", []))
        except Exception as e:
            logger.error(f"ProPublica search for '{query}' failed: {e}")
            return []

    async def get_organization_details(self, ein: str) -> Optional[dict]:
        """Get detailed info for a specific nonprofit by EIN."""
        try:
            response = await self.client.get(f"/organizations/{ein}.json")
            response.raise_for_status()
            data = response.json()
            org = data.get("organization", {})
            filings = data.get("filings_with_data", [])

            result = {
                "Name": org.get("name", ""),
                "EIN": ein,
                "State": org.get("state", ""),
                "City": org.get("city", ""),
                "Category": self._categorize(org),
                "Description": org.get("ntee_code", ""),
                "Data Source": "ProPublica Nonprofit Explorer",
            }

            # Get latest financial data
            if filings:
                latest = filings[0]
                result["Annual Revenue"] = latest.get("totrevenue", 0)
                result["financials"] = {
                    "revenue": latest.get("totrevenue", 0),
                    "expenses": latest.get("totfuncexpns", 0),
                    "assets": latest.get("totassetsend", 0),
                    "tax_period": latest.get("tax_prd_yr", ""),
                }

            return result
        except Exception as e:
            logger.error(f"Failed to get details for EIN {ein}: {e}")
            return None

    async def discover_conservative_nonprofits(self) -> list[dict]:
        """Search for known conservative nonprofits and return their data."""
        results = []
        for org_name in SEED_ORGANIZATIONS:
            try:
                search_results = await self.search_organizations(org_name)
                if search_results:
                    # Take the top result (best match)
                    best = search_results[0]
                    ein = best.get("EIN", "")
                    if ein:
                        details = await self.get_organization_details(ein)
                        if details:
                            results.append(details)
                            logger.info(
                                f"Found nonprofit: {details['Name']} "
                                f"(Revenue: ${details.get('Annual Revenue', 0):,.0f})"
                            )
            except Exception as e:
                logger.error(f"Failed to research '{org_name}': {e}")
        return results

    @staticmethod
    def _normalize_results(results: list[dict]) -> list[dict]:
        normalized = []
        for r in results:
            normalized.append(
                {
                    "Name": r.get("name", ""),
                    "EIN": str(r.get("ein", "")),
                    "State": r.get("state", ""),
                    "City": r.get("city", ""),
                    "Annual Revenue": r.get("income_amount", 0),
                    "Data Source": "ProPublica Nonprofit Explorer",
                }
            )
        return normalized

    @staticmethod
    def _categorize(org: dict) -> str:
        """Categorize a nonprofit based on its subsection code."""
        subsection = str(org.get("subsection_code", ""))
        if subsection == "3":
            return "501(c)(3) Nonprofit"
        elif subsection == "4":
            return "501(c)(4) Nonprofit"
        elif subsection == "6":
            return "Trade Association"
        elif subsection == "7":
            return "527 Organization"
        return "501(c)(3) Nonprofit"
