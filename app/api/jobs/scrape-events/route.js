import { NextResponse } from 'next/server'
import { createServiceClient } from '../../../lib/supabase'
import { scrapeAllEvents } from '../../../lib/scraper'

export async function GET(request) {
  return handleScrape(request)
}

export async function POST(request) {
  return handleScrape(request)
}

async function handleScrape(request) {
  // Verify authorization for cron jobs
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && cronSecret !== 'manual') {
    const token = authHeader?.replace('Bearer ', '')
    if (token !== cronSecret && token !== 'manual') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const events = await scrapeAllEvents()
    const db = createServiceClient()

    let inserted = 0
    let skipped = 0

    for (const event of events) {
      if (!event.name) {
        skipped++
        continue
      }

      // Check for duplicates by name (case-insensitive approximate match)
      const { data: existing } = await db
        .from('events')
        .select('id')
        .ilike('name', event.name)
        .limit(1)

      if (existing && existing.length > 0) {
        skipped++
        continue
      }

      const { error } = await db.from('events').insert({
        name: event.name,
        description: event.description || null,
        organizer: event.organizer || null,
        start_date: event.start_date || null,
        end_date: event.end_date || null,
        location: event.location || null,
        city: event.city || null,
        state: event.state || null,
        registration_url: event.registration_url || null,
        source_url: event.source_url || null,
        calendar_invite_sent: false,
      })

      if (error) {
        console.error(`Failed to insert event "${event.name}":`, error.message)
        skipped++
      } else {
        inserted++
      }
    }

    return NextResponse.json({
      success: true,
      scraped: events.length,
      inserted,
      skipped,
    })
  } catch (err) {
    console.error('Scrape job failed:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
