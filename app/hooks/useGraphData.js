'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '../lib/supabase'

const supabase = createBrowserClient()

export function useGraphData(filters = {}) {
  const [graph, setGraph] = useState({ nodes: [], edges: [] })
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGraph = useCallback(async () => {
    try {
      let nodeQuery = supabase.from('ecosystem_graph').select('*')
      if (filters.category) nodeQuery = nodeQuery.eq('category', filters.category)
      if (filters.state) nodeQuery = nodeQuery.eq('state', filters.state)
      if (filters.minProminence) nodeQuery = nodeQuery.gte('prominence_score', filters.minProminence)

      const [nodesResult, edgesResult] = await Promise.all([
        nodeQuery,
        supabase.from('relationships').select('*'),
      ])

      if (nodesResult.error) throw nodesResult.error
      if (edgesResult.error) throw edgesResult.error

      const nodes = (nodesResult.data || []).map((n) => ({
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
      const edges = (edgesResult.data || [])
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
        supabase.from('organizations').select('category, annual_revenue'),
        supabase.from('people').select('id', { count: 'exact', head: true }),
        supabase.from('relationships').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
      ])

      const categories = {}
      let totalRevenue = 0
      ;(orgs.data || []).forEach((o) => {
        const cat = o.category || 'Unknown'
        categories[cat] = (categories[cat] || 0) + 1
        totalRevenue += Number(o.annual_revenue) || 0
      })

      setStats({
        total_organizations: orgs.data?.length || 0,
        total_people: people.count || 0,
        total_relationships: rels.count || 0,
        total_events: evts.count || 0,
        total_revenue: totalRevenue,
        categories,
      })
    } catch (err) {
      console.error('Stats fetch failed:', err)
    }
  }, [])

  const fetchEvents = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })

      if (fetchError) throw fetchError
      setEvents(data || [])
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
