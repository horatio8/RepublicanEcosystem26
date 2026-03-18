import { NextResponse } from 'next/server'
import { createServiceClient } from '../../lib/supabase'

const VALID_TABLES = ['organizations', 'people', 'relationships', 'events']

function toCSV(rows) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  for (const row of rows) {
    const vals = headers.map((h) => {
      const v = row[h]
      if (v == null) return ''
      const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? '"' + s.replace(/"/g, '""') + '"'
        : s
    })
    lines.push(vals.join(','))
  }
  return lines.join('\n')
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const table = searchParams.get('table')
  const format = searchParams.get('format') || 'csv'

  if (!table || !VALID_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  try {
    const db = createServiceClient()
    const { data, error } = await db.from(table).select('*')
    if (error) throw error

    if (format === 'json') {
      return new Response(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${table}.json"`,
        },
      })
    }

    const csv = toCSV(data || [])
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${table}.csv"`,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
