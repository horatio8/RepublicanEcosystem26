/**
 * Calendar invite sender — creates ICS events and sends via Google Calendar API.
 */
import { GoogleAuth } from 'google-auth-library'

/**
 * Create an ICS calendar file as a string.
 */
export function createICSEvent({ name, description, location, startDate, endDate, organizer, url }) {
  const uid = `${name.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30)}-${startDate.slice(0, 10)}@ecosystem.teller.consulting`
  const now = formatICSDate(new Date())
  const start = formatICSDate(new Date(startDate))
  const end = endDate
    ? formatICSDate(new Date(endDate))
    : formatICSDate(new Date(new Date(startDate).getTime() + 2 * 60 * 60 * 1000))

  const descParts = [description, organizer && `Organized by: ${organizer}`, url && `Register: ${url}`]
    .filter(Boolean)
    .join('\\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Republican Ecosystem Mapper//EN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICS(name)}`,
    `DESCRIPTION:${escapeICS(descParts)}`,
    location && `LOCATION:${escapeICS(location)}`,
    url && `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n')
}

function formatICSDate(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeICS(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

/**
 * Send a Google Calendar invite using the Google Calendar API.
 */
export async function sendGoogleCalendarInvite(eventData) {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON || '{}')
  const recipient = process.env.CALENDAR_RECIPIENT_EMAIL || 'james@teller.consulting'

  if (!credentials.client_email) {
    console.warn('Google Calendar credentials not configured — skipping invite send')
    return null
  }

  // Build JWT for Google API auth
  const jwt = await createGoogleJWT(credentials)

  const startDate = new Date(eventData.start_date)
  const endDate = eventData.end_date
    ? new Date(eventData.end_date)
    : new Date(startDate.getTime() + 2 * 60 * 60 * 1000)

  const body = {
    summary: eventData.name,
    description: [
      eventData.description,
      eventData.organizer && `Organized by: ${eventData.organizer}`,
      eventData.registration_url && `Register: ${eventData.registration_url}`,
      '',
      '---',
      'Sent by Republican Ecosystem Mapper',
    ]
      .filter(Boolean)
      .join('\n'),
    location: eventData.location || '',
    start: { dateTime: startDate.toISOString(), timeZone: 'America/New_York' },
    end: { dateTime: endDate.toISOString(), timeZone: 'America/New_York' },
    attendees: [{ email: recipient }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 1440 },
        { method: 'popup', minutes: 60 },
      ],
    },
  }

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Google Calendar API error: ${res.status} ${text}`)
  }

  return res.json()
}

/**
 * Create an access token for Google service account auth.
 */
async function createGoogleJWT(credentials) {
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  return token.token
}
