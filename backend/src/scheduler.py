"""
Scheduler for recurring research and scraping jobs.

Runs on startup and schedules periodic jobs using APScheduler.
"""

import asyncio
import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from backend.config.settings import settings
from backend.src.airtable.client import EcosystemDB

logger = logging.getLogger(__name__)


async def scrape_events_job():
    """Periodic job: scrape events from all sources."""
    from backend.src.scraper.event_scraper import EventScraper

    logger.info("Starting scheduled event scrape")
    scraper = EventScraper()
    try:
        events = await scraper.scrape_all()
        db = EcosystemDB()
        created = 0
        for event in events:
            name = event.get("Name", "")
            start = event.get("Start Date", "")
            if name and not db.find_event_by_name_and_date(name, start):
                db.create_event(event)
                created += 1
        logger.info(f"Scheduled event scrape complete: {created} new events")
    except Exception as e:
        logger.error(f"Scheduled event scrape failed: {e}")
    finally:
        await scraper.close()


async def send_calendar_invites_job():
    """Periodic job: send calendar invites for new events."""
    from backend.src.calendar.invite_sender import CalendarInviteSender

    logger.info("Starting scheduled calendar invite send")
    db = EcosystemDB()
    sender = CalendarInviteSender()
    unsent = db.list_events(upcoming_only=True, sent_only=False)
    sent_count = 0
    for event_record in unsent:
        try:
            sender.send_via_google_calendar(event_record["fields"])
            db.update_event(event_record["id"], {"Calendar Invite Sent": True})
            sent_count += 1
        except Exception as e:
            logger.error(
                f"Failed to send invite for "
                f"{event_record['fields'].get('Name')}: {e}"
            )
    logger.info(f"Sent {sent_count} calendar invites")


async def fec_research_job():
    """Periodic job: discover new entities from FEC data."""
    from backend.src.research.fec_researcher import FECResearcher

    logger.info("Starting scheduled FEC research")
    researcher = FECResearcher()
    try:
        results = await researcher.discover_new_republican_entities()
        db = EcosystemDB()
        new_orgs = 0
        new_people = 0
        for committee in results["committees"]:
            name = committee.get("Name", "")
            if name and not db.find_organization_by_name(name):
                db.create_organization(committee)
                new_orgs += 1
        for candidate in results["candidates"]:
            name = candidate.get("Name", "")
            if name and not db.find_person_by_name(name):
                db.create_person(candidate)
                new_people += 1
        logger.info(
            f"FEC research complete: {new_orgs} new orgs, {new_people} new people"
        )
    except Exception as e:
        logger.error(f"FEC research failed: {e}")
    finally:
        await researcher.close()


async def nonprofit_research_job():
    """Periodic job: update nonprofit financial data."""
    from backend.src.research.nonprofit_researcher import NonprofitResearcher

    logger.info("Starting scheduled nonprofit research")
    researcher = NonprofitResearcher()
    try:
        results = await researcher.discover_conservative_nonprofits()
        db = EcosystemDB()
        updated = 0
        for org_data in results:
            name = org_data.get("Name", "")
            existing = db.find_organization_by_name(name)
            if existing:
                db.update_organization(
                    existing["id"],
                    {
                        "Annual Revenue": org_data.get("Annual Revenue", 0),
                        "EIN": org_data.get("EIN", ""),
                    },
                )
                updated += 1
            else:
                db.create_organization(org_data)
                updated += 1
        logger.info(f"Nonprofit research complete: {updated} orgs updated")
    except Exception as e:
        logger.error(f"Nonprofit research failed: {e}")
    finally:
        await researcher.close()


async def prominence_scoring_job():
    """Periodic job: recalculate prominence scores for all entities."""
    from backend.src.research.news_tracker import NewsTracker

    logger.info("Starting scheduled prominence scoring")
    tracker = NewsTracker()
    db = EcosystemDB()
    try:
        orgs = db.list_organizations()
        people = db.list_people()

        for org in orgs[:50]:  # Limit to top 50 to stay within API limits
            fields = org["fields"]
            name = fields.get("Name", "")
            if not name:
                continue
            score = await tracker.calculate_prominence_score(
                entity_name=name,
                current_revenue=fields.get("Annual Revenue", 0) or 0,
            )
            db.create_prominence_score(score)

            # Update the org's prominence score
            prev = fields.get("Prominence Score", 0) or 0
            new_score = score["Composite Score"]
            trend = (
                "Rising"
                if new_score > prev + 2
                else "Declining"
                if new_score < prev - 2
                else "Stable"
            )
            db.update_organization(
                org["id"],
                {
                    "Prominence Score": new_score,
                    "Prominence Trend": trend,
                },
            )

        logger.info("Prominence scoring complete")
    except Exception as e:
        logger.error(f"Prominence scoring failed: {e}")
    finally:
        await tracker.close()


def create_scheduler() -> AsyncIOScheduler:
    """Create and configure the job scheduler."""
    scheduler = AsyncIOScheduler()

    # Event scraping — every 6 hours
    scheduler.add_job(
        scrape_events_job,
        IntervalTrigger(hours=settings.scrape_interval_hours),
        id="scrape_events",
        name="Scrape events from conservative organizations",
        replace_existing=True,
    )

    # Calendar invites — every 2 hours
    scheduler.add_job(
        send_calendar_invites_job,
        IntervalTrigger(hours=2),
        id="send_invites",
        name="Send calendar invites for new events",
        replace_existing=True,
    )

    # FEC research — daily
    scheduler.add_job(
        fec_research_job,
        IntervalTrigger(hours=settings.research_interval_hours),
        id="fec_research",
        name="Discover new entities from FEC data",
        replace_existing=True,
    )

    # Nonprofit research — weekly
    scheduler.add_job(
        nonprofit_research_job,
        IntervalTrigger(days=7),
        id="nonprofit_research",
        name="Update nonprofit financial data",
        replace_existing=True,
    )

    # Prominence scoring — daily
    scheduler.add_job(
        prominence_scoring_job,
        IntervalTrigger(hours=24),
        id="prominence_scoring",
        name="Recalculate prominence scores",
        replace_existing=True,
    )

    return scheduler
