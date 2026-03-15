import { NextResponse } from 'next/server'
import { getDB, findEventByNameAndDate, insertEvent } from '../../../lib/db'
import { scrapeAllEvents } from '../../../lib/scraper'

export const maxDuration = 60 // Vercel Pro: up to 60s for cron jobs

export async function POST(request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getDB()
    const events = await scrapeAllEvents()

    let created = 0
    let skipped = 0
    for (const event of events) {
      if (!event.name) continue
      const existing = await findEventByNameAndDate(
        db,
        event.name,
        event.start_date || new Date().toISOString()
      )
      if (!existing) {
        await insertEvent(db, event)
        created++
      } else {
        skipped++
      }
    }

    return NextResponse.json({
      status: 'ok',
      scraped: events.length,
      created,
      skipped,
    })
  } catch (error) {
    console.error('Event scrape failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Also support GET for Vercel Cron
export async function GET(request) {
  return POST(request)
}
