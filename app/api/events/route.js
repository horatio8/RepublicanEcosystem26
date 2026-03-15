import { NextResponse } from 'next/server'
import { getDB, listEvents } from '../../lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const upcoming = searchParams.get('upcoming') === 'true'

  try {
    const db = getDB()
    const events = await listEvents(db, { upcoming })
    return NextResponse.json({ events })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
