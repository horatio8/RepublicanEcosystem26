import { NextResponse } from 'next/server'
import { getDB, listOrganizations } from '../../lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || undefined
  const state = searchParams.get('state') || undefined

  try {
    const db = getDB()
    const orgs = await listOrganizations(db, { category, state })
    return NextResponse.json({ organizations: orgs })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
