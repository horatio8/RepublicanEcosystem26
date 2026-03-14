import { useState, useEffect, useCallback } from 'react'

const API_BASE = '/api'

export function useGraphData(filters = {}) {
  const [graph, setGraph] = useState({ nodes: [], edges: [] })
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGraph = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filters.category) params.set('category', filters.category)
      if (filters.state) params.set('state', filters.state)
      if (filters.minProminence) params.set('min_prominence', filters.minProminence)

      const response = await fetch(`${API_BASE}/graph?${params}`)
      if (!response.ok) throw new Error('Failed to fetch graph data')
      const data = await response.json()
      setGraph(data)
    } catch (err) {
      setError(err.message)
    }
  }, [filters.category, filters.state, filters.minProminence])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`)
      if (!response.ok) throw new Error('Failed to fetch stats')
      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Stats fetch failed:', err)
    }
  }, [])

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/events?upcoming=true`)
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(data.events || [])
    } catch (err) {
      console.error('Events fetch failed:', err)
    }
  }, [])

  const triggerJob = useCallback(async (jobName) => {
    try {
      const response = await fetch(`${API_BASE}/jobs/${jobName}`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error(`Failed to trigger ${jobName}`)
      return await response.json()
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchGraph(), fetchStats(), fetchEvents()])
      .finally(() => setLoading(false))
  }, [fetchGraph, fetchStats, fetchEvents])

  return {
    graph,
    stats,
    events,
    loading,
    error,
    refetch: () => Promise.all([fetchGraph(), fetchStats(), fetchEvents()]),
    triggerJob,
  }
}
