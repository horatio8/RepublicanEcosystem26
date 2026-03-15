/**
 * FEC API researcher — discovers PACs, committees, and candidates.
 */

const FEC_BASE = 'https://api.open.fec.gov/v1'

async function fecGet(endpoint, params = {}) {
  params.api_key = process.env.FEC_API_KEY
  const url = new URL(endpoint, FEC_BASE)
  Object.entries(params).forEach(([k, v]) => {
    if (v != null) url.searchParams.set(k, v)
  })
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`FEC API error: ${res.status}`)
  return res.json()
}

export async function searchCommittees({ party = 'REP', committeeType, perPage = 50 } = {}) {
  const data = await fecGet('/committees/', {
    party,
    committee_type: committeeType,
    per_page: perPage,
    sort: '-receipts',
  })
  return (data.results || []).map((r) => {
    const typeFull = r.committee_type_full || ''
    let category = 'PAC'
    if (typeFull.toLowerCase().includes('super')) category = 'Super PAC'
    else if (typeFull.toLowerCase().includes('party')) category = 'National Party Committee'
    else if (typeFull.toLowerCase().includes('leadership')) category = 'Leadership PAC'

    return {
      name: r.name || '',
      category,
      fec_id: r.committee_id || '',
      state: r.state || '',
      city: r.city || '',
      description: `${typeFull}. Treasurer: ${r.treasurer_name || 'N/A'}`,
      website: r.website || null,
      data_source: 'FEC API',
    }
  })
}

export async function searchCandidates({ party = 'REP', office, perPage = 50 } = {}) {
  const data = await fecGet('/candidates/search/', {
    party,
    office,
    per_page: perPage,
    sort: '-receipts',
  })
  const officeMap = { H: 'U.S. House', S: 'U.S. Senate', P: 'President' }
  return (data.results || []).map((r) => {
    let officeLabel = officeMap[r.office] || r.office_full || ''
    if (r.district && officeLabel === 'U.S. House') {
      officeLabel = `${officeLabel} (${r.state}-${r.district})`
    }
    return {
      name: r.name || '',
      role: 'Candidate',
      title: officeLabel,
      state: r.state || '',
      party: 'Republican',
      office: officeLabel,
      data_source: 'FEC API',
    }
  })
}

export async function discoverRepublicanEntities() {
  const committeeTypes = { PACs: 'N', 'Super PACs': 'O', 'Party Committees': 'Y' }
  const allCommittees = []
  for (const [, ctype] of Object.entries(committeeTypes)) {
    try {
      const committees = await searchCommittees({ committeeType: ctype, perPage: 100 })
      allCommittees.push(...committees)
    } catch (e) {
      console.error(`FEC committee fetch failed: ${e.message}`)
    }
  }

  const allCandidates = []
  for (const office of ['P', 'S', 'H']) {
    try {
      const candidates = await searchCandidates({ office, perPage: 100 })
      allCandidates.push(...candidates)
    } catch (e) {
      console.error(`FEC candidate fetch failed: ${e.message}`)
    }
  }

  return { committees: allCommittees, candidates: allCandidates }
}
