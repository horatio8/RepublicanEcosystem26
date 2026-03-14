"""
AirTable client for reading/writing ecosystem data.

Wraps pyairtable to provide typed access to all tables.
"""

import logging
from datetime import datetime, timezone
from typing import Optional

from pyairtable import Api, Table
from pyairtable.formulas import match

from backend.config.settings import settings
from backend.src.airtable.schema import (
    EVENTS,
    FINANCIAL_RECORDS,
    ORGANIZATIONS,
    PEOPLE,
    PROMINENCE_SCORES,
    RELATIONSHIPS,
    RESEARCH_LOG,
)

logger = logging.getLogger(__name__)


class EcosystemDB:
    """Client for the Republican Ecosystem AirTable base."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_id: Optional[str] = None,
    ):
        self.api_key = api_key or settings.airtable_api_key
        self.base_id = base_id or settings.airtable_base_id
        self.api = Api(self.api_key)
        self.base = self.api.base(self.base_id)

    def _table(self, name: str) -> Table:
        return self.base.table(name)

    # ── Organizations ──────────────────────────────────────────────

    def list_organizations(self, category: Optional[str] = None) -> list[dict]:
        table = self._table(ORGANIZATIONS)
        if category:
            return table.all(formula=match({"Category": category}))
        return table.all()

    def get_organization(self, record_id: str) -> dict:
        return self._table(ORGANIZATIONS).get(record_id)

    def create_organization(self, fields: dict) -> dict:
        fields.setdefault("Last Updated", datetime.now(timezone.utc).isoformat())
        fields.setdefault("Verified", False)
        return self._table(ORGANIZATIONS).create(fields)

    def update_organization(self, record_id: str, fields: dict) -> dict:
        fields["Last Updated"] = datetime.now(timezone.utc).isoformat()
        return self._table(ORGANIZATIONS).update(record_id, fields)

    def find_organization_by_name(self, name: str) -> Optional[dict]:
        results = self._table(ORGANIZATIONS).all(formula=match({"Name": name}))
        return results[0] if results else None

    # ── People ─────────────────────────────────────────────────────

    def list_people(self, role: Optional[str] = None) -> list[dict]:
        table = self._table(PEOPLE)
        if role:
            return table.all(formula=match({"Role": role}))
        return table.all()

    def get_person(self, record_id: str) -> dict:
        return self._table(PEOPLE).get(record_id)

    def create_person(self, fields: dict) -> dict:
        fields.setdefault("Last Updated", datetime.now(timezone.utc).isoformat())
        fields.setdefault("Verified", False)
        return self._table(PEOPLE).create(fields)

    def update_person(self, record_id: str, fields: dict) -> dict:
        fields["Last Updated"] = datetime.now(timezone.utc).isoformat()
        return self._table(PEOPLE).update(record_id, fields)

    def find_person_by_name(self, name: str) -> Optional[dict]:
        results = self._table(PEOPLE).all(formula=match({"Name": name}))
        return results[0] if results else None

    # ── Relationships ──────────────────────────────────────────────

    def list_relationships(self, entity_name: Optional[str] = None) -> list[dict]:
        table = self._table(RELATIONSHIPS)
        if entity_name:
            records = table.all()
            return [
                r
                for r in records
                if r["fields"].get("Entity A Name") == entity_name
                or r["fields"].get("Entity B Name") == entity_name
            ]
        return table.all()

    def create_relationship(self, fields: dict) -> dict:
        fields.setdefault("Active", True)
        return self._table(RELATIONSHIPS).create(fields)

    def find_relationship(
        self, entity_a: str, entity_b: str, rel_type: str
    ) -> Optional[dict]:
        records = self._table(RELATIONSHIPS).all()
        for r in records:
            f = r["fields"]
            names_match = (
                f.get("Entity A Name") == entity_a
                and f.get("Entity B Name") == entity_b
            ) or (
                f.get("Entity A Name") == entity_b
                and f.get("Entity B Name") == entity_a
            )
            if names_match and f.get("Relationship Type") == rel_type:
                return r
        return None

    # ── Events ─────────────────────────────────────────────────────

    def list_events(
        self, upcoming_only: bool = False, sent_only: bool = False
    ) -> list[dict]:
        table = self._table(EVENTS)
        records = table.all()
        if upcoming_only:
            now = datetime.now(timezone.utc).isoformat()
            records = [
                r
                for r in records
                if r["fields"].get("Start Date", "") >= now
            ]
        if sent_only is False:
            records = [
                r
                for r in records
                if not r["fields"].get("Calendar Invite Sent", False)
            ]
        return records

    def create_event(self, fields: dict) -> dict:
        fields.setdefault("Calendar Invite Sent", False)
        return self._table(EVENTS).create(fields)

    def update_event(self, record_id: str, fields: dict) -> dict:
        return self._table(EVENTS).update(record_id, fields)

    def find_event_by_name_and_date(
        self, name: str, start_date: str
    ) -> Optional[dict]:
        records = self._table(EVENTS).all(formula=match({"Name": name}))
        for r in records:
            if r["fields"].get("Start Date", "")[:10] == start_date[:10]:
                return r
        return None

    # ── Financial Records ──────────────────────────────────────────

    def create_financial_record(self, fields: dict) -> dict:
        return self._table(FINANCIAL_RECORDS).create(fields)

    def list_financial_records(
        self, entity_name: Optional[str] = None
    ) -> list[dict]:
        table = self._table(FINANCIAL_RECORDS)
        if entity_name:
            return table.all(formula=match({"Entity Name": entity_name}))
        return table.all()

    # ── Research Log ───────────────────────────────────────────────

    def create_research_finding(self, fields: dict) -> dict:
        fields.setdefault("Discovered Date", datetime.now(timezone.utc).isoformat())
        fields.setdefault("Status", "Pending Review")
        return self._table(RESEARCH_LOG).create(fields)

    def list_research_findings(self, status: Optional[str] = None) -> list[dict]:
        table = self._table(RESEARCH_LOG)
        if status:
            return table.all(formula=match({"Status": status}))
        return table.all()

    def update_research_finding(self, record_id: str, fields: dict) -> dict:
        return self._table(RESEARCH_LOG).update(record_id, fields)

    # ── Prominence Scores ──────────────────────────────────────────

    def create_prominence_score(self, fields: dict) -> dict:
        return self._table(PROMINENCE_SCORES).create(fields)

    def list_prominence_scores(
        self, entity_name: Optional[str] = None
    ) -> list[dict]:
        table = self._table(PROMINENCE_SCORES)
        if entity_name:
            return table.all(formula=match({"Entity Name": entity_name}))
        return table.all()

    # ── Bulk Operations ────────────────────────────────────────────

    def get_full_graph(self) -> dict:
        """Fetch all data needed for network visualization."""
        logger.info("Fetching full ecosystem graph from AirTable")
        orgs = self.list_organizations()
        people = self.list_people()
        relationships = self.list_relationships()

        nodes = []
        for org in orgs:
            f = org["fields"]
            nodes.append(
                {
                    "id": org["id"],
                    "name": f.get("Name", ""),
                    "type": "organization",
                    "category": f.get("Category", ""),
                    "revenue": f.get("Annual Revenue", 0) or 0,
                    "prominence": f.get("Prominence Score", 0) or 0,
                    "trend": f.get("Prominence Trend", "Stable"),
                    "state": f.get("State", ""),
                    "description": f.get("Description", ""),
                    "website": f.get("Website", ""),
                    "verified": f.get("Verified", False),
                }
            )
        for person in people:
            f = person["fields"]
            nodes.append(
                {
                    "id": person["id"],
                    "name": f.get("Name", ""),
                    "type": "person",
                    "category": f.get("Role", ""),
                    "revenue": 0,
                    "prominence": f.get("Prominence Score", 0) or 0,
                    "trend": f.get("Prominence Trend", "Stable"),
                    "state": f.get("State", ""),
                    "description": f.get("Description", ""),
                    "website": f.get("Website", ""),
                    "verified": f.get("Verified", False),
                }
            )

        edges = []
        node_names = {n["name"] for n in nodes}
        for rel in relationships:
            f = rel["fields"]
            a_name = f.get("Entity A Name", "")
            b_name = f.get("Entity B Name", "")
            if a_name in node_names and b_name in node_names:
                edges.append(
                    {
                        "id": rel["id"],
                        "source": a_name,
                        "target": b_name,
                        "type": f.get("Relationship Type", ""),
                        "active": f.get("Active", True),
                        "amount": f.get("Financial Amount", 0) or 0,
                        "description": f.get("Description", ""),
                    }
                )

        return {"nodes": nodes, "edges": edges}
