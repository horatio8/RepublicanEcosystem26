"""
FastAPI routes for the Republican Ecosystem API.

Serves data to the frontend visualization and provides
endpoints for triggering research/scraping jobs.
"""

import logging
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query

from backend.src.airtable.client import EcosystemDB

logger = logging.getLogger(__name__)
router = APIRouter()


def get_db() -> EcosystemDB:
    return EcosystemDB()


# ── Graph Data ─────────────────────────────────────────────────────

@router.get("/api/graph")
async def get_graph(
    category: Optional[str] = Query(None, description="Filter by org category"),
    state: Optional[str] = Query(None, description="Filter by state"),
    min_prominence: float = Query(0, description="Minimum prominence score"),
):
    """Get the full network graph for visualization."""
    db = get_db()
    graph = db.get_full_graph()

    # Apply filters
    if category:
        graph["nodes"] = [
            n for n in graph["nodes"] if n["category"] == category
        ]
    if state:
        graph["nodes"] = [n for n in graph["nodes"] if n["state"] == state]
    if min_prominence > 0:
        graph["nodes"] = [
            n for n in graph["nodes"] if n["prominence"] >= min_prominence
        ]

    # Filter edges to only include visible nodes
    visible_names = {n["name"] for n in graph["nodes"]}
    graph["edges"] = [
        e
        for e in graph["edges"]
        if e["source"] in visible_names and e["target"] in visible_names
    ]

    return graph


# ── Organizations ──────────────────────────────────────────────────

@router.get("/api/organizations")
async def list_organizations(
    category: Optional[str] = Query(None),
):
    db = get_db()
    orgs = db.list_organizations(category=category)
    return {"organizations": [r["fields"] | {"id": r["id"]} for r in orgs]}


@router.get("/api/organizations/{record_id}")
async def get_organization(record_id: str):
    db = get_db()
    try:
        org = db.get_organization(record_id)
        return org["fields"] | {"id": org["id"]}
    except Exception:
        raise HTTPException(404, "Organization not found")


# ── People ─────────────────────────────────────────────────────────

@router.get("/api/people")
async def list_people(role: Optional[str] = Query(None)):
    db = get_db()
    people = db.list_people(role=role)
    return {"people": [r["fields"] | {"id": r["id"]} for r in people]}


# ── Relationships ──────────────────────────────────────────────────

@router.get("/api/relationships")
async def list_relationships(entity: Optional[str] = Query(None)):
    db = get_db()
    rels = db.list_relationships(entity_name=entity)
    return {"relationships": [r["fields"] | {"id": r["id"]} for r in rels]}


# ── Events ─────────────────────────────────────────────────────────

@router.get("/api/events")
async def list_events(upcoming: bool = Query(False)):
    db = get_db()
    events = db.list_events(upcoming_only=upcoming, sent_only=True)
    return {"events": [r["fields"] | {"id": r["id"]} for r in events]}


# ── Research Log ───────────────────────────────────────────────────

@router.get("/api/research")
async def list_research(status: Optional[str] = Query(None)):
    db = get_db()
    findings = db.list_research_findings(status=status)
    return {"findings": [r["fields"] | {"id": r["id"]} for r in findings]}


# ── Prominence ─────────────────────────────────────────────────────

@router.get("/api/prominence")
async def list_prominence(entity: Optional[str] = Query(None)):
    db = get_db()
    scores = db.list_prominence_scores(entity_name=entity)
    return {"scores": [r["fields"] | {"id": r["id"]} for r in scores]}


# ── Jobs (manual triggers) ────────────────────────────────────────

@router.post("/api/jobs/scrape-events")
async def trigger_event_scrape(background_tasks: BackgroundTasks):
    """Manually trigger an event scraping job."""
    from backend.src.scraper.event_scraper import EventScraper

    async def _run():
        scraper = EventScraper()
        try:
            events = await scraper.scrape_all()
            db = get_db()
            created = 0
            for event in events:
                name = event.get("Name", "")
                start = event.get("Start Date", "")
                if name and not db.find_event_by_name_and_date(name, start):
                    db.create_event(event)
                    created += 1
            logger.info(f"Event scrape complete: {created} new events")
        finally:
            await scraper.close()

    background_tasks.add_task(_run)
    return {"status": "Event scraping job started"}


@router.post("/api/jobs/research-fec")
async def trigger_fec_research(background_tasks: BackgroundTasks):
    """Manually trigger FEC research job."""
    from backend.src.research.fec_researcher import FECResearcher

    async def _run():
        researcher = FECResearcher()
        try:
            results = await researcher.discover_new_republican_entities()
            db = get_db()
            for committee in results["committees"]:
                name = committee.get("Name", "")
                if name and not db.find_organization_by_name(name):
                    db.create_organization(committee)
            for candidate in results["candidates"]:
                name = candidate.get("Name", "")
                if name and not db.find_person_by_name(name):
                    db.create_person(candidate)
            logger.info("FEC research sweep complete")
        finally:
            await researcher.close()

    background_tasks.add_task(_run)
    return {"status": "FEC research job started"}


@router.post("/api/jobs/send-invites")
async def trigger_send_invites(background_tasks: BackgroundTasks):
    """Send calendar invites for unsent events."""
    from backend.src.calendar.invite_sender import CalendarInviteSender

    async def _run():
        db = get_db()
        sender = CalendarInviteSender()
        unsent = db.list_events(upcoming_only=True, sent_only=False)
        sent_count = 0
        for event_record in unsent:
            try:
                sender.send_via_google_calendar(event_record["fields"])
                db.update_event(
                    event_record["id"], {"Calendar Invite Sent": True}
                )
                sent_count += 1
            except Exception as e:
                logger.error(
                    f"Failed to send invite for {event_record['fields'].get('Name')}: {e}"
                )
        logger.info(f"Sent {sent_count} calendar invites")

    background_tasks.add_task(_run)
    return {"status": "Calendar invite job started"}


# ── Stats ──────────────────────────────────────────────────────────

@router.get("/api/stats")
async def get_stats():
    """Get overall ecosystem statistics."""
    db = get_db()
    orgs = db.list_organizations()
    people = db.list_people()
    rels = db.list_relationships()
    events = db.list_events(sent_only=True)

    # Category breakdown
    categories = {}
    for org in orgs:
        cat = org["fields"].get("Category", "Unknown")
        categories[cat] = categories.get(cat, 0) + 1

    # Total revenue
    total_revenue = sum(
        org["fields"].get("Annual Revenue", 0) or 0 for org in orgs
    )

    return {
        "total_organizations": len(orgs),
        "total_people": len(people),
        "total_relationships": len(rels),
        "total_events": len(events),
        "total_revenue": total_revenue,
        "categories": categories,
    }
