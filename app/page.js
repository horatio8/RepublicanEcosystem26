'use client'

import { useState, useMemo } from 'react'
import { useGraphData } from './hooks/useGraphData'
import NetworkGraph from './components/NetworkGraph'
import Sidebar from './components/Sidebar'
import EventsPanel from './components/EventsPanel'
import DataTable from './components/DataTable'

const TABS = ['Network Map', 'Events Calendar', 'Rising Stars', 'Data Manager']

export default function Home() {
  const [activeTab, setActiveTab] = useState('Network Map')
  const [filters, setFilters] = useState({})
  const [selectedNode, setSelectedNode] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { graph, stats, events, loading, error, refetch, triggerJob } =
    useGraphData(filters)

  const filteredGraph = useMemo(() => {
    if (!searchQuery) return graph
    const q = searchQuery.toLowerCase()
    const matchedNodes = graph.nodes.filter((n) =>
      n.name.toLowerCase().includes(q)
    )
    const matchedNames = new Set(matchedNodes.map((n) => n.name))
    const connectedNames = new Set()
    graph.edges.forEach((e) => {
      if (matchedNames.has(e.source)) connectedNames.add(e.target)
      if (matchedNames.has(e.target)) connectedNames.add(e.source)
    })
    const allNames = new Set([...matchedNames, ...connectedNames])
    return {
      nodes: graph.nodes.filter((n) => allNames.has(n.name)),
      edges: graph.edges.filter(
        (e) => allNames.has(e.source) && allNames.has(e.target)
      ),
    }
  }, [graph, searchQuery])

  const risingStars = useMemo(() => {
    return [...graph.nodes]
      .filter((n) => n.trend === 'Rising')
      .sort((a, b) => b.prominence - a.prominence)
  }, [graph.nodes])

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <span>Republican</span> Ecosystem Map
        </h1>
        <div className="header-stats">
          {stats && (
            <>
              <span>
                Orgs: <span className="stat-value">{stats.total_organizations}</span>
              </span>
              <span>
                People: <span className="stat-value">{stats.total_people}</span>
              </span>
              <span>
                Relationships: <span className="stat-value">{stats.total_relationships}</span>
              </span>
              <span>
                Revenue:{' '}
                <span className="stat-value">
                  ${(stats.total_revenue / 1e9).toFixed(1)}B
                </span>
              </span>
            </>
          )}
        </div>
      </header>

      <div className="tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Data Manager' ? (
        <DataTable />
      ) : (
        <div className="main-content">
          <Sidebar
            filters={filters}
            onFiltersChange={setFilters}
            selectedNode={selectedNode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            stats={stats}
            onTriggerJob={triggerJob}
            onRefetch={refetch}
          />

          <div className="graph-container">
            {loading ? (
              <div className="loading">Loading ecosystem data</div>
            ) : error ? (
              <div className="loading" style={{ color: '#dc3545' }}>
                Error: {error}
              </div>
            ) : activeTab === 'Network Map' ? (
              <NetworkGraph
                graph={filteredGraph}
                onNodeClick={setSelectedNode}
                selectedNode={selectedNode}
              />
            ) : activeTab === 'Events Calendar' ? (
              <EventsPanel events={events} />
            ) : (
              <div className="events-list" style={{ padding: 24 }}>
                <h2 style={{ marginBottom: 16 }}>Rising Stars</h2>
                {risingStars.map((node) => (
                  <div
                    key={node.id}
                    className="event-card"
                    onClick={() => {
                      setSelectedNode(node)
                      setActiveTab('Network Map')
                    }}
                  >
                    <h4>{node.name}</h4>
                    <div className="event-meta">
                      {node.category} | {node.state || 'National'} | Prominence:{' '}
                      {node.prominence.toFixed(1)}
                      <span
                        className="trend-badge rising"
                        style={{ marginLeft: 8 }}
                      >
                        Rising
                      </span>
                    </div>
                  </div>
                ))}
                {risingStars.length === 0 && (
                  <p style={{ color: 'var(--text-secondary)' }}>
                    No rising entities detected yet. Data will populate as
                    prominence scoring runs.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
