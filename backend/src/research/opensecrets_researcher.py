"""
OpenSecrets (Center for Responsive Politics) data researcher.

Fetches lobbying, PAC contribution, and donor data to map
money flows in the Republican ecosystem.
"""

import logging
from typing import Optional

import httpx

from backend.config.settings import settings

logger = logging.getLogger(__name__)

OPENSECRETS_BASE_URL = "https://www.opensecrets.org/api/"


class OpenSecretsResearcher:
    """Fetches data from the OpenSecrets API."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.opensecrets_api_key
        self.client = httpx.AsyncClient(timeout=30.0)

    async def close(self):
        await self.client.aclose()

    async def _get(self, method: str, params: Optional[dict] = None) -> dict:
        params = params or {}
        params.update(
            {
                "method": method,
                "apikey": self.api_key,
                "output": "json",
            }
        )
        response = await self.client.get(OPENSECRETS_BASE_URL, params=params)
        response.raise_for_status()
        return response.json()

    async def get_candidate_summary(self, cid: str, cycle: str = "2024") -> dict:
        """Get financial summary for a candidate."""
        data = await self._get(
            "candSummary", {"cid": cid, "cycle": cycle}
        )
        return data.get("response", {}).get("summary", {}).get("@attributes", {})

    async def get_candidate_contributors(
        self, cid: str, cycle: str = "2024"
    ) -> list[dict]:
        """Get top contributors to a candidate."""
        data = await self._get(
            "candContrib", {"cid": cid, "cycle": cycle}
        )
        contributors = data.get("response", {}).get("contributors", {})
        return contributors.get("contributor", [])

    async def get_candidate_industries(
        self, cid: str, cycle: str = "2024"
    ) -> list[dict]:
        """Get top contributing industries to a candidate."""
        data = await self._get(
            "candIndustry", {"cid": cid, "cycle": cycle}
        )
        industries = data.get("response", {}).get("industries", {})
        return industries.get("industry", [])

    async def get_org_summary(self, org_name: str) -> dict:
        """Get summary data for an organization."""
        data = await self._get("getOrgs", {"org": org_name})
        return data.get("response", {}).get("organization", {})

    async def get_lobbying_data(
        self, registrant_name: str, year: str = "2024"
    ) -> list[dict]:
        """Get lobbying filings for an organization."""
        # Note: OpenSecrets lobbying data requires their bulk data or scraping
        # This method searches for the org and returns available data
        org_data = await self.get_org_summary(registrant_name)
        if isinstance(org_data, list):
            return org_data
        return [org_data] if org_data else []

    async def discover_top_republican_donors(
        self, cycle: str = "2024"
    ) -> list[dict]:
        """Discover top individual/org donors to Republican causes."""
        # Use well-known Republican candidate CIDs to find their top donors
        # These would be populated from FEC data in practice
        logger.info("OpenSecrets donor discovery requires candidate CIDs from FEC data")
        return []

    async def map_org_relationships(self, org_name: str) -> dict:
        """Map an organization's political relationships through contributions."""
        org = await self.get_org_summary(org_name)
        return {
            "organization": org_name,
            "data": org,
        }
