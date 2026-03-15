import { NextResponse } from 'next/server'
import { getDB, listEvents, markEventInviteSent } from '../../../lib/db'
import { sendGoogleCalendarInvite } from '../../../lib/calendar'

export const maxDuration = 60

export async function POST(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getDB()
    const unsent = await listEvents(db, { upcoming: true, unsentOnly: true })

    let sent = 0
    let failed = 0

    for (const event of unsent) {
      try {
        await sendGoogleCalendarInvite(event)
        await markEventInviteSent(db, event.id)
        sent++
      } catch (error) {
        console.error(`Failed to send invite for "${event.name}": ${error.message}`)
        failed++
      }
    }

    return NextResponse.json({
      status: 'ok',
      total_unsent: unsent.length,
      sent,
      failed,
    })
  } catch (error) {
    console.error('Send invites failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  return POST(request)
}
