"""
FEC (Federal Election Commission) data researcher.

Fetches PAC, committee, and candidate data from the FEC API
to discover entities and track financial activity.
"""

import logging
from typing import Optional

import httpx

from backend.config.settings import settings

logger = logging.getLogger(__name__)

FEC_BASE_URL = "https://api.open.fec.gov/v1"


class FECResearcher:
    """Fetches data from the FEC API."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.fec_api_key
        self.client = httpx.AsyncClient(
            base_url=FEC_BASE_URL,
            timeout=30.0,
        )

    async def close(self):
        await self.client.aclose()

    async def _get(self, endpoint: str, params: Optional[dict] = None) -> dict:
        params = params or {}
        params["api_key"] = self.api_key
        response = await self.client.get(endpoint, params=params)
        response.raise_for_status()
        return response.json()

    async def search_committees(
        self,
        query: str = "",
        committee_type: Optional[str] = None,
        party: str = "REP",
        per_page: int = 50,
    ) -> list[dict]:
        """Search for PACs, party committees, etc.

        committee_type: N=PAC, Q=PAC-Qualified, O=Super PAC, U=Single-candidate,
                       V=PAC with non-contribution account, W=PAC with non-contribution
                       account - Qualified, X=Party-nonqualified, Y=Party-qualified
        """
        params = {
            "party": party,
            "per_page": per_page,
            "sort": "-receipts",
        }
        if query:
            params["q"] = query
        if committee_type:
            params["committee_type"] = committee_type

        data = await self._get("/committees/", params)
        return self._normalize_committees(data.get("results", []))

    async def get_committee_financials(self, committee_id: str) -> dict:
        """Get financial summary for a committee."""
        data = await self._get(
            f"/committee/{committee_id}/totals/",
            {"per_page": 1, "sort": "-cycle"},
        )
        results = data.get("results", [])
        return results[0] if results else {}

    async def search_candidates(
        self,
        query: str = "",
        office: Optional[str] = None,
        state: Optional[str] = None,
        party: str = "REP",
        election_year: Optional[int] = None,
        per_page: int = 50,
    ) -> list[dict]:
        """Search for Republican candidates.

        office: H=House, S=Senate, P=President
        """
        params = {
            "party": party,
            "per_page": per_page,
            "sort": "-receipts",
        }
        if query:
            params["q"] = query
        if office:
            params["office"] = office
        if state:
            params["state"] = state
        if election_year:
            params["election_year"] = election_year

        data = await self._get("/candidates/search/", params)
        return self._normalize_candidates(data.get("results", []))

    async def get_independent_expenditures(
        self,
        committee_id: Optional[str] = None,
        candidate_id: Optional[str] = None,
        per_page: int = 50,
    ) -> list[dict]:
        """Get independent expenditures (Super PAC spending)."""
        params = {"per_page": per_page, "sort": "-expenditure_amount"}
        if committee_id:
            params["committee_id"] = committee_id
        if candidate_id:
            params["candidate_id"] = candidate_id

        data = await self._get("/schedules/schedule_e/", params)
        return data.get("results", [])

    async def get_top_pac_donors(
        self, committee_id: str, per_page: int = 20
    ) -> list[dict]:
        """Get top donors to a PAC/committee."""
        data = await self._get(
            f"/schedules/schedule_a/",
            {
                "committee_id": committee_id,
                "per_page": per_page,
                "sort": "-contribution_receipt_amount",
            },
        )
        return data.get("results", [])

    async def discover_new_republican_entities(self) -> dict:
        """Run a broad discovery sweep for Republican ecosystem entities.

        Returns dict with 'committees' and 'candidates' lists.
        """
        logger.info("Starting FEC entity discovery sweep")

        # Fetch various types of Republican committees
        committee_types = {
            "PACs": "N",
            "Super PACs": "O",
            "Party Committees": "Y",
            "Leadership PACs": "D",
        }

        all_committees = []
        for label, ctype in committee_types.items():
            try:
                committees = await self.search_committees(
                    committee_type=ctype, per_page=100
                )
                all_committees.extend(committees)
                logger.info(f"Found {len(committees)} {label}")
            except Exception as e:
                logger.error(f"Failed to fetch {label}: {e}")

        # Fetch candidates for current cycle
        all_candidates = []
        for office in ["P", "S", "H"]:
            try:
                candidates = await self.search_candidates(
                    office=office, per_page=100
                )
                all_candidates.extend(candidates)
                logger.info(
                    f"Found {len(candidates)} Republican {office} candidates"
                )
            except Exception as e:
                logger.error(f"Failed to fetch {office} candidates: {e}")

        return {"committees": all_committees, "candidates": all_candidates}

    @staticmethod
    def _normalize_committees(results: list[dict]) -> list[dict]:
        """Normalize FEC committee data to our schema."""
        normalized = []
        for r in results:
            committee_type = r.get("committee_type_full", "")
            category = "PAC"
            if "super" in committee_type.lower():
                category = "Super PAC"
            elif "party" in committee_type.lower():
                category = "National Party Committee"
            elif "leadership" in committee_type.lower():
                category = "Leadership PAC"

            normalized.append(
                {
                    "Name": r.get("name", ""),
                    "Category": category,
                    "FEC ID": r.get("committee_id", ""),
                    "State": r.get("state", ""),
                    "City": r.get("city", ""),
                    "Description": f"{committee_type}. Treasurer: {r.get('treasurer_name', 'N/A')}",
                    "Website": r.get("website", ""),
                    "Data Source": "FEC API",
                }
            )
        return normalized

    @staticmethod
    def _normalize_candidates(results: list[dict]) -> list[dict]:
        """Normalize FEC candidate data to our schema."""
        normalized = []
        office_map = {"H": "U.S. House", "S": "U.S. Senate", "P": "President"}
        for r in results:
            office = office_map.get(r.get("office", ""), r.get("office_full", ""))
            state = r.get("state", "")
            district = r.get("district", "")
            if district and office == "U.S. House":
                office = f"{office} ({state}-{district})"

            normalized.append(
                {
                    "Name": r.get("name", ""),
                    "Role": "Candidate",
                    "Title": office,
                    "State": state,
                    "Party": "Republican",
                    "Office": office,
                    "FEC ID": r.get("candidate_id", ""),
                    "Data Source": "FEC API",
                }
            )
        return normalized
