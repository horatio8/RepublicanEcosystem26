import { NextResponse } from 'next/server'
import { getDB, findOrgByName, upsertOrganization, findPersonByName, upsertPerson } from '../../../lib/db'
import { discoverRepublicanEntities } from '../../../lib/fec'

export const maxDuration = 60

export async function POST(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getDB()
    const results = await discoverRepublicanEntities()

    let newOrgs = 0
    let newPeople = 0

    for (const committee of results.committees) {
      if (!committee.name) continue
      const existing = await findOrgByName(db, committee.name)
      if (!existing) {
        await upsertOrganization(db, committee)
        newOrgs++
      }
    }

    for (const candidate of results.candidates) {
      if (!candidate.name) continue
      const existing = await findPersonByName(db, candidate.name)
      if (!existing) {
        await upsertPerson(db, candidate)
        newPeople++
      }
    }

    return NextResponse.json({
      status: 'ok',
      committees_found: results.committees.length,
      candidates_found: results.candidates.length,
      new_orgs: newOrgs,
      new_people: newPeople,
    })
  } catch (error) {
    console.error('FEC research failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  return POST(request)
}
