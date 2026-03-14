"""
Calendar invite sender.

Takes events from AirTable and sends calendar invites (ICS format)
to the configured email address using Google Calendar API or SMTP.
"""

import logging
import smtplib
from datetime import datetime
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from icalendar import Calendar, Event, vText
from icalendar import Timezone

from backend.config.settings import settings

logger = logging.getLogger(__name__)


def create_ics_event(
    name: str,
    description: str,
    location: str,
    start_date: str,
    end_date: Optional[str] = None,
    organizer: str = "",
    url: str = "",
) -> bytes:
    """Create an ICS calendar event file."""
    cal = Calendar()
    cal.add("prodid", "-//Republican Ecosystem Mapper//EN")
    cal.add("version", "2.0")
    cal.add("method", "REQUEST")

    event = Event()
    event.add("summary", name)
    event.add("description", _build_description(description, organizer, url))

    if location:
        event["location"] = vText(location)

    # Parse dates
    start_dt = _parse_date(start_date)
    event.add("dtstart", start_dt)

    if end_date:
        end_dt = _parse_date(end_date)
        event.add("dtend", end_dt)
    else:
        # Default to 2 hours if no end date
        from datetime import timedelta
        event.add("dtend", start_dt + timedelta(hours=2))

    event.add("dtstamp", datetime.utcnow())

    # Generate a unique UID
    uid = f"{name.replace(' ', '-')[:30]}-{start_date[:10]}@ecosystem.teller.consulting"
    event["uid"] = uid

    if url:
        event.add("url", url)

    # Set organizer display
    if organizer:
        event.add("organizer", f"MAILTO:events@{organizer.lower().replace(' ', '')}.org")

    cal.add_component(event)
    return cal.to_ical()


def _build_description(description: str, organizer: str, url: str) -> str:
    """Build a rich event description."""
    parts = []
    if description:
        parts.append(description)
    if organizer:
        parts.append(f"\nOrganized by: {organizer}")
    if url:
        parts.append(f"\nMore info / Register: {url}")
    parts.append("\n\n---\nSent by Republican Ecosystem Mapper")
    return "\n".join(parts)


def _parse_date(date_str: str) -> datetime:
    """Parse various date string formats."""
    formats = [
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
    ]
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    raise ValueError(f"Cannot parse date: {date_str}")


class CalendarInviteSender:
    """Sends calendar invites via Google Calendar API."""

    def __init__(self):
        self.recipient = settings.calendar_recipient_email
        self._service = None

    def _get_google_service(self):
        """Initialize Google Calendar API service."""
        if self._service:
            return self._service

        import json
        from google.oauth2 import service_account
        from googleapiclient.discovery import build

        creds_data = settings.google_credentials_json
        if creds_data.endswith(".json"):
            # It's a file path
            creds = service_account.Credentials.from_service_account_file(
                creds_data,
                scopes=["https://www.googleapis.com/auth/calendar"],
            )
        else:
            # Inline JSON
            info = json.loads(creds_data)
            creds = service_account.Credentials.from_service_account_info(
                info,
                scopes=["https://www.googleapis.com/auth/calendar"],
            )

        # Delegate to the target user
        delegated_creds = creds.with_subject(self.recipient)
        self._service = build("calendar", "v3", credentials=delegated_creds)
        return self._service

    def send_via_google_calendar(self, event_data: dict) -> dict:
        """Create a Google Calendar event with invite."""
        service = self._get_google_service()

        start_dt = _parse_date(event_data.get("Start Date", ""))
        end_date = event_data.get("End Date")
        end_dt = _parse_date(end_date) if end_date else None

        body = {
            "summary": event_data.get("Name", ""),
            "description": _build_description(
                event_data.get("Description", ""),
                event_data.get("Organizer", ""),
                event_data.get("Registration URL", ""),
            ),
            "location": event_data.get("Location", ""),
            "start": {
                "dateTime": start_dt.isoformat(),
                "timeZone": "America/New_York",
            },
            "end": {
                "dateTime": (
                    end_dt
                    or start_dt.replace(hour=start_dt.hour + 2)
                ).isoformat(),
                "timeZone": "America/New_York",
            },
            "attendees": [{"email": self.recipient}],
            "reminders": {
                "useDefault": False,
                "overrides": [
                    {"method": "email", "minutes": 24 * 60},
                    {"method": "popup", "minutes": 60},
                ],
            },
            "source": {
                "title": event_data.get("Organizer", ""),
                "url": event_data.get("Registration URL", ""),
            },
        }

        result = service.events().insert(
            calendarId="primary",
            body=body,
            sendUpdates="all",  # Sends invite emails
        ).execute()

        logger.info(
            f"Calendar invite sent for '{event_data.get('Name')}' "
            f"to {self.recipient}"
        )
        return result

    def send_via_ics_email(
        self,
        event_data: dict,
        smtp_host: str = "smtp.gmail.com",
        smtp_port: int = 587,
        smtp_user: str = "",
        smtp_pass: str = "",
    ) -> None:
        """Fallback: send ICS file via SMTP email."""
        ics_data = create_ics_event(
            name=event_data.get("Name", ""),
            description=event_data.get("Description", ""),
            location=event_data.get("Location", ""),
            start_date=event_data.get("Start Date", ""),
            end_date=event_data.get("End Date"),
            organizer=event_data.get("Organizer", ""),
            url=event_data.get("Registration URL", ""),
        )

        msg = MIMEMultipart("mixed")
        msg["Subject"] = f"Event: {event_data.get('Name', '')}"
        msg["From"] = smtp_user
        msg["To"] = self.recipient

        # HTML body
        html = f"""
        <h2>{event_data.get('Name', '')}</h2>
        <p><strong>Organizer:</strong> {event_data.get('Organizer', '')}</p>
        <p><strong>Date:</strong> {event_data.get('Start Date', '')}</p>
        <p><strong>Location:</strong> {event_data.get('Location', '')}</p>
        <p>{event_data.get('Description', '')}</p>
        <p><a href="{event_data.get('Registration URL', '')}">Register / More Info</a></p>
        """
        msg.attach(MIMEText(html, "html"))

        # Attach ICS file
        ics_part = MIMEBase("text", "calendar", method="REQUEST")
        ics_part.set_payload(ics_data)
        ics_part.add_header(
            "Content-Disposition", "attachment", filename="invite.ics"
        )
        msg.attach(ics_part)

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)

        logger.info(
            f"ICS email sent for '{event_data.get('Name')}' to {self.recipient}"
        )
