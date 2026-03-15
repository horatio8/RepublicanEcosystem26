import { NextResponse } from 'next/server'
import { getDB, getStats } from '../../lib/db'

export async function GET() {
  try {
    const db = getDB()
    const stats = await getStats(db)
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
