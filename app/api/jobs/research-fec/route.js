import { NextResponse } from 'next/server'
import { createServiceClient } from '../../../lib/supabase'
import { discoverRepublicanEntities } from '../../../lib/fec'

export async function GET(request) {
  return handleResearch(request)
}

export async function POST(request) {
  return handleResearch(request)
}

async function handleResearch(request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && cronSecret !== 'manual') {
    const token = authHeader?.replace('Bearer ', '')
    if (token !== cronSecret && token !== 'manual') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const { organizations, people } = await discoverRepublicanEntities()
    const db = createServiceClient()

    let orgsInserted = 0
    let peopleInserted = 0

    for (const org of organizations) {
      const { data: existing } = await db
        .from('organizations')
        .select('id')
        .eq('name', org.name)
        .limit(1)

      if (!existing || existing.length === 0) {
        const { error } = await db.from('organizations').insert(org)
        if (!error) orgsInserted++
      }
    }

    for (const person of people) {
      const { data: existing } = await db
        .from('people')
        .select('id')
        .eq('name', person.name)
        .limit(1)

      if (!existing || existing.length === 0) {
        const { error } = await db.from('people').insert(person)
        if (!error) peopleInserted++
      }
    }

    return NextResponse.json({
      success: true,
      discovered: { organizations: organizations.length, people: people.length },
      inserted: { organizations: orgsInserted, people: peopleInserted },
    })
  } catch (err) {
    console.error('FEC research job failed:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
