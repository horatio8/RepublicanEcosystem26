import { NextResponse } from 'next/server'
import { createServiceClient } from '../../../lib/supabase'
import { sendGoogleCalendarInvite } from '../../../lib/calendar'

export async function GET(request) {
  return handleInvites(request)
}

export async function POST(request) {
  return handleInvites(request)
}

async function handleInvites(request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && cronSecret !== 'manual') {
    const token = authHeader?.replace('Bearer ', '')
    if (token !== cronSecret && token !== 'manual') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const db = createServiceClient()
    const { data: events, error } = await db
      .from('events')
      .select('*')
      .eq('calendar_invite_sent', false)
      .not('start_date', 'is', null)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(10)

    if (error) throw error

    let sent = 0
    let failed = 0

    for (const event of events || []) {
      try {
        await sendGoogleCalendarInvite(event)
        await db
          .from('events')
          .update({ calendar_invite_sent: true })
          .eq('id', event.id)
        sent++
      } catch (err) {
        console.error(`Failed to send invite for "${event.name}":`, err.message)
        failed++
      }
    }

    return NextResponse.json({
      success: true,
      processed: (events || []).length,
      sent,
      failed,
    })
  } catch (err) {
    console.error('Send invites job failed:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
