'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '../lib/supabase'

const supabase = createBrowserClient()

async function fetchJSON(path) {
  const res = await fetch(path)
  if (!res.ok) return null
  return res.json()
}

async function trySupabase(queryFn) {
  try {
    const result = await queryFn()
    if (result.error) throw result.error
    return result
  } catch {
    return null
  }
}

export function useGraphData(filters = {}) {
  const [graph, setGraph] = useState({ nodes: [], edges: [] })
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGraph = useCallback(async () => {
    try {
      let nodesData, edgesData

      // Try Supabase first
      let nodeQuery = supabase.from('ecosystem_graph').select('*')
      if (filters.category) nodeQuery = nodeQuery.eq('category', filters.category)
      if (filters.state) nodeQuery = nodeQuery.eq('state', filters.state)
      if (filters.minProminence) nodeQuery = nodeQuery.gte('prominence_score', filters.minProminence)

      const [nodesResult, edgesResult] = await Promise.all([
        trySupabase(() => nodeQuery),
        trySupabase(() => supabase.from('relationships').select('*')),
      ])

      if (nodesResult?.data && edgesResult?.data) {
        nodesData = nodesResult.data
        edgesData = edgesResult.data
      } else {
        // Fall back to static JSON
        nodesData = (await fetchJSON('/data/graph_nodes.json')) || []
        edgesData = (await fetchJSON('/data/relationships.json')) || []

        // Apply filters client-side
        if (filters.category) nodesData = nodesData.filter(n => n.category === filters.category)
        if (filters.state) nodesData = nodesData.filter(n => n.state === filters.state)
        if (filters.minProminence) nodesData = nodesData.filter(n => n.prominence_score >= filters.minProminence)
      }

      const nodes = (nodesData || []).map((n) => ({
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
      const edges = (edgesData || [])
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

      setGraph({ nodes, edges })
    } catch (err) {
      setError(err.message)
    }
  }, [filters.category, filters.state, filters.minProminence])

  const fetchStats = useCallback(async () => {
    try {
      const [orgs, people, rels, evts] = await Promise.all([
        trySupabase(() => supabase.from('organizations').select('category, annual_revenue')),
        trySupabase(() => supabase.from('people').select('id', { count: 'exact', head: true })),
        trySupabase(() => supabase.from('relationships').select('id', { count: 'exact', head: true })),
        trySupabase(() => supabase.from('events').select('id', { count: 'exact', head: true })),
      ])

      let orgsData, peopleCount, relsCount, evtsCount

      if (orgs?.data) {
        orgsData = orgs.data
        peopleCount = people?.count || 0
        relsCount = rels?.count || 0
        evtsCount = evts?.count || 0
      } else {
        // Fall back to static JSON
        orgsData = (await fetchJSON('/data/organizations.json')) || []
        const peopleData = (await fetchJSON('/data/people.json')) || []
        const relsData = (await fetchJSON('/data/relationships.json')) || []
        const evtsData = (await fetchJSON('/data/events.json')) || []
        peopleCount = peopleData.length
        relsCount = relsData.length
        evtsCount = Array.isArray(evtsData) ? evtsData.length : 0
      }

      const categories = {}
      let totalRevenue = 0
      ;(orgsData || []).forEach((o) => {
        const cat = o.category || 'Unknown'
        categories[cat] = (categories[cat] || 0) + 1
        totalRevenue += Number(o.annual_revenue) || 0
      })

      setStats({
        total_organizations: orgsData?.length || 0,
        total_people: peopleCount,
        total_relationships: relsCount,
        total_events: evtsCount,
        total_revenue: totalRevenue,
        categories,
      })
    } catch (err) {
      console.error('Stats fetch failed:', err)
    }
  }, [])

  const fetchEvents = useCallback(async () => {
    try {
      const result = await trySupabase(() =>
        supabase
          .from('events')
          .select('*')
          .gte('start_date', new Date().toISOString())
          .order('start_date', { ascending: true })
      )

      if (result?.data) {
        setEvents(result.data)
      } else {
        const evtsData = (await fetchJSON('/data/events.json')) || []
        const now = new Date().toISOString()
        setEvents(
          Array.isArray(evtsData)
            ? evtsData.filter((e) => e.start_date >= now).sort((a, b) => a.start_date.localeCompare(b.start_date))
            : []
        )
      }
    } catch (err) {
      console.error('Events fetch failed:', err)
    }
  }, [])

  const triggerJob = useCallback(async (jobName) => {
    try {
      const response = await fetch(`/api/jobs/${jobName}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${window.__CRON_SECRET || 'manual'}` },
      })
      if (!response.ok) throw new Error(`Failed to trigger ${jobName}`)
      return await response.json()
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const refetch = useCallback(() => {
    return Promise.all([fetchGraph(), fetchStats(), fetchEvents()])
  }, [fetchGraph, fetchStats, fetchEvents])

  useEffect(() => {
    setLoading(true)
    refetch().finally(() => setLoading(false))
  }, [refetch])

  return { graph, stats, events, loading, error, refetch, triggerJob }
}
