'use client'

export default function EventsPanel({ events }) {
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.start_date || ''
    const dateB = b.start_date || ''
    return dateA.localeCompare(dateB)
  })

  const grouped = {}
  sortedEvents.forEach((event) => {
    const date = event.start_date || ''
    const month = date.slice(0, 7) || 'Unknown'
    if (!grouped[month]) grouped[month] = []
    grouped[month].push(event)
  })

  return (
    <div className="events-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Upcoming Events</h2>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {events.length} events
        </span>
      </div>

      {Object.entries(grouped).map(([month, monthEvents]) => (
        <div key={month}>
          <h3 style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '16px 0 8px', textTransform: 'uppercase' }}>
            {formatMonth(month)}
          </h3>
          {monthEvents.map((event) => (
            <div key={event.id} className="event-card">
              <h4>{event.name}</h4>
              <div className="event-meta">
                <div>{event.organizer}</div>
                <div>
                  {formatDate(event.start_date)}
                  {event.location && ` | ${event.location}`}
                  {event.city && event.state && ` (${event.city}, ${event.state})`}
                </div>
                {event.cost > 0 && <div>Cost: ${event.cost}</div>}
                {event.calendar_invite_sent && (
                  <span style={{ color: 'var(--rising)', fontSize: 11 }}>
                    Invite Sent
                  </span>
                )}
              </div>
              {event.description && (
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.4 }}>
                  {event.description.slice(0, 200)}
                  {event.description.length > 200 && '...'}
                </p>
              )}
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                {event.registration_url && (
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ fontSize: 11, padding: '4px 10px', textDecoration: 'none' }}
                  >
                    Register
                  </a>
                )}
                {event.source_url && (
                  <a
                    href={event.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ fontSize: 11, padding: '4px 10px', textDecoration: 'none' }}
                  >
                    Source
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {events.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
          <p>No upcoming events found.</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            Click &quot;Scrape Events Now&quot; in the sidebar to discover events.
          </p>
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return 'TBD'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatMonth(monthStr) {
  if (monthStr === 'Unknown') return monthStr
  try {
    const [year, month] = monthStr.split('-')
    const d = new Date(year, month - 1)
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  } catch {
    return monthStr
  }
}
