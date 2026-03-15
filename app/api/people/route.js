import { NextResponse } from 'next/server'
import { getDB, listPeople } from '../../lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') || undefined
  const state = searchParams.get('state') || undefined

  try {
    const db = getDB()
    const people = await listPeople(db, { role, state })
    return NextResponse.json({ people })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
