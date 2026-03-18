import { NextResponse } from 'next/server'
import { createServiceClient } from '../../lib/supabase'

const VALID_TABLES = ['organizations', 'people', 'relationships', 'events']

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const table = searchParams.get('table')

  if (!table || !VALID_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  try {
    const db = createServiceClient()
    let query = db.from(table).select('*')

    // Apply ordering
    if (table === 'organizations') query = query.order('prominence_score', { ascending: false })
    else if (table === 'people') query = query.order('prominence_score', { ascending: false })
    else if (table === 'events') query = query.order('start_date', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request) {
  const body = await request.json()
  const { table, id, updates } = body

  if (!table || !VALID_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }
  if (!id || !updates) {
    return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 })
  }

  // Remove fields that shouldn't be updated directly
  delete updates.id
  delete updates.created_at

  try {
    const db = createServiceClient()
    const { data, error } = await db.from(table).update(updates).eq('id', id).select()
    if (error) throw error

    return NextResponse.json({ data: data?.[0] })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const table = searchParams.get('table')
  const id = searchParams.get('id')

  if (!table || !VALID_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  try {
    const db = createServiceClient()
    const { error } = await db.from(table).delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
