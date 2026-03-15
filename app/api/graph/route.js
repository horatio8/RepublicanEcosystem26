import { NextResponse } from 'next/server'
import { getDB, getFullGraph } from '../../lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || undefined
  const state = searchParams.get('state') || undefined
  const minProminence = searchParams.get('min_prominence')
    ? Number(searchParams.get('min_prominence'))
    : undefined

  try {
    const db = getDB()
    const graph = await getFullGraph(db, { category, state, minProminence })
    return NextResponse.json(graph)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
