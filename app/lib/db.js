import { createServiceClient } from './supabase'

/**
 * Database helper functions for the Republican Ecosystem.
 * All functions use the service role client for full read/write access.
 */

export function getDB() {
  return createServiceClient()
}

// ── Organizations ──────────────────────────────────────────────────

export async function listOrganizations(db, { category, state, minProminence } = {}) {
  let query = db.from('organizations').select('*').order('prominence_score', { ascending: false })
  if (category) query = query.eq('category', category)
  if (state) query = query.eq('state', state)
  if (minProminence) query = query.gte('prominence_score', minProminence)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function findOrgByName(db, name) {
  const { data } = await db.from('organizations').select('*').eq('name', name).limit(1)
  return data?.[0] || null
}

export async function upsertOrganization(db, org) {
  const { data, error } = await db
    .from('organizations')
    .upsert(org, { onConflict: 'name', ignoreDuplicates: false })
    .select()
  if (error) throw error
  return data?.[0]
}

// ── People ─────────────────────────────────────────────────────────

export async function listPeople(db, { role, state } = {}) {
  let query = db.from('people').select('*').order('prominence_score', { ascending: false })
  if (role) query = query.eq('role', role)
  if (state) query = query.eq('state', state)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function findPersonByName(db, name) {
  const { data } = await db.from('people').select('*').eq('name', name).limit(1)
  return data?.[0] || null
}

export async function upsertPerson(db, person) {
  const { data, error } = await db
    .from('people')
    .upsert(person, { onConflict: 'name', ignoreDuplicates: false })
    .select()
  if (error) throw error
  return data?.[0]
}

// ── Relationships ──────────────────────────────────────────────────

export async function listRelationships(db, entityName) {
  let query = db.from('relationships').select('*')
  if (entityName) {
    query = query.or(`entity_a_name.eq.${entityName},entity_b_name.eq.${entityName}`)
  }
  const { data, error } = await query
  if (error) throw error
  return data
}

// ── Events ─────────────────────────────────────────────────────────

export async function listEvents(db, { upcoming, unsentOnly } = {}) {
  let query = db.from('events').select('*').order('start_date', { ascending: true })
  if (upcoming) query = query.gte('start_date', new Date().toISOString())
  if (unsentOnly) query = query.eq('calendar_invite_sent', false)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function findEventByNameAndDate(db, name, startDate) {
  const dateStr = startDate.slice(0, 10)
  const { data } = await db
    .from('events')
    .select('*')
    .eq('name', name)
    .gte('start_date', dateStr + 'T00:00:00')
    .lte('start_date', dateStr + 'T23:59:59')
    .limit(1)
  return data?.[0] || null
}

export async function insertEvent(db, event) {
  const { data, error } = await db.from('events').insert(event).select()
  if (error) throw error
  return data?.[0]
}

export async function markEventInviteSent(db, eventId) {
  const { error } = await db
    .from('events')
    .update({ calendar_invite_sent: true })
    .eq('id', eventId)
  if (error) throw error
}

// ── Graph ──────────────────────────────────────────────────────────

export async function getFullGraph(db, { category, state, minProminence } = {}) {
  // Fetch nodes from the view
  let nodeQuery = db.from('ecosystem_graph').select('*')
  if (category) nodeQuery = nodeQuery.eq('category', category)
  if (state) nodeQuery = nodeQuery.eq('state', state)
  if (minProminence) nodeQuery = nodeQuery.gte('prominence_score', minProminence)

  const [nodesResult, edgesResult] = await Promise.all([
    nodeQuery,
    db.from('relationships').select('*'),
  ])

  if (nodesResult.error) throw nodesResult.error
  if (edgesResult.error) throw edgesResult.error

  const nodes = nodesResult.data.map((n) => ({
    id: n.id,
    name: n.name,
    type: n.entity_type,
    category: n.category,
    revenue: Number(n.revenue) || 0,
    prominence: Number(n.prominence_score) || 0,
    trend: n.trend || 'Stable',
    state: n.state || '',
    description: n.description || '',
    website: n.website || '',
    verified: n.verified,
  }))

  const nodeNames = new Set(nodes.map((n) => n.name))
  const edges = edgesResult.data
    .filter((r) => nodeNames.has(r.entity_a_name) && nodeNames.has(r.entity_b_name))
    .map((r) => ({
      id: r.id,
      source: r.entity_a_name,
      target: r.entity_b_name,
      type: r.relationship_type || '',
      active: r.active,
      amount: Number(r.financial_amount) || 0,
      description: r.description || '',
    }))

  return { nodes, edges }
}

// ── Stats ──────────────────────────────────────────────────────────

export async function getStats(db) {
  const [orgs, people, rels, events] = await Promise.all([
    db.from('organizations').select('category, annual_revenue'),
    db.from('people').select('id', { count: 'exact', head: true }),
    db.from('relationships').select('id', { count: 'exact', head: true }),
    db.from('events').select('id', { count: 'exact', head: true }),
  ])

  const categories = {}
  let totalRevenue = 0
  ;(orgs.data || []).forEach((o) => {
    const cat = o.category || 'Unknown'
    categories[cat] = (categories[cat] || 0) + 1
    totalRevenue += Number(o.annual_revenue) || 0
  })

  return {
    total_organizations: orgs.data?.length || 0,
    total_people: people.count || 0,
    total_relationships: rels.count || 0,
    total_events: events.count || 0,
    total_revenue: totalRevenue,
    categories,
  }
}

// ── Research Log ───────────────────────────────────────────────────

export async function insertResearchFinding(db, finding) {
  const { data, error } = await db.from('research_log').insert(finding).select()
  if (error) throw error
  return data?.[0]
}

// ── Prominence ─────────────────────────────────────────────────────

export async function insertProminenceScore(db, score) {
  const { data, error } = await db.from('prominence_scores').insert(score).select()
  if (error) throw error
  return data?.[0]
}

export async function updateOrgProminence(db, orgId, score, trend) {
  const { error } = await db
    .from('organizations')
    .update({ prominence_score: score, prominence_trend: trend })
    .eq('id', orgId)
  if (error) throw error
}
