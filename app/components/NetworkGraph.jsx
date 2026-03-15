'use client'

import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'

const CATEGORY_COLORS = {
  'PAC': '#dc3545',
  'Super PAC': '#e74c3c',
  'Leadership PAC': '#c0392b',
  '501(c)(3) Nonprofit': '#2ecc71',
  '501(c)(4) Nonprofit': '#27ae60',
  'Think Tank': '#3498db',
  'Media Organization': '#e67e22',
  'Consulting Firm': '#9b59b6',
  'Law Firm': '#1abc9c',
  'Lobbying Firm': '#f39c12',
  'Business / Corporation': '#34495e',
  'National Party Committee': '#dc3545',
  'State Party': '#e74c3c',
  'Campaign Committee': '#c0392b',
  'Grassroots Organization': '#16a085',
  'Religious Organization': '#8e44ad',
  'Digital / Tech Firm': '#2980b9',
  '527 Organization': '#d35400',
  'Trade Association': '#7f8c8d',
  'Elected Official': '#e74c3c',
  'Candidate': '#c0392b',
  'Donor': '#f1c40f',
  'Consultant': '#9b59b6',
  'Media Figure': '#e67e22',
  'Lobbyist': '#f39c12',
  'Staffer': '#3498db',
}

const EDGE_COLORS = {
  'Donation / Financial': '#f0c040',
  'Employment': '#4a90d9',
  'Board Membership': '#e74c3c',
  'Consulting': '#9b59b6',
  'Lobbying': '#f39c12',
  'Coalition Partner': '#2ecc71',
  'Endorsement': '#e67e22',
  'Subsidiary / Parent': '#1abc9c',
  'Founding': '#dc3545',
  'Advisory': '#6c757d',
  'Shared Leadership': '#e74c3c',
}

export default function NetworkGraph({ graph, onNodeClick, selectedNode }) {
  const svgRef = useRef()
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    if (!graph.nodes.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    const g = svg.append('g')

    const zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => g.attr('transform', event.transform))
    svg.call(zoom)

    const nodeMap = new Map(graph.nodes.map((n) => [n.name, n]))

    const edges = graph.edges
      .filter((e) => nodeMap.has(e.source) && nodeMap.has(e.target))
      .map((e) => ({ ...e }))

    const maxRevenue = Math.max(...graph.nodes.map((n) => n.revenue || 0), 1)
    const radiusScale = d3.scaleSqrt().domain([0, maxRevenue]).range([6, 45])

    const simulation = d3.forceSimulation(graph.nodes)
      .force('link', d3.forceLink(edges).id((d) => d.name).distance(120).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-250))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d) => radiusScale(d.revenue || 0) + 5))

    // Edges
    const link = g.append('g')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', (d) => EDGE_COLORS[d.type] || '#2d3244')
      .attr('stroke-width', (d) => Math.max(1, Math.min(4, (d.amount || 0) / 1000000)))
      .attr('stroke-opacity', 0.4)

    // Nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(graph.nodes)
      .join('circle')
      .attr('r', (d) => radiusScale(d.revenue || d.prominence * 1000000 || 1000000))
      .attr('fill', (d) => CATEGORY_COLORS[d.category] || '#6c757d')
      .attr('stroke', (d) =>
        selectedNode && selectedNode.name === d.name ? '#fff' : 'transparent'
      )
      .attr('stroke-width', 2.5)
      .style('cursor', 'pointer')
      .call(drag(simulation))

    // Labels for important nodes
    const labelThreshold = maxRevenue * 0.03
    const label = g.append('g')
      .selectAll('text')
      .data(graph.nodes.filter((n) =>
        (n.revenue || n.prominence * 1000000) > labelThreshold
      ))
      .join('text')
      .text((d) => d.name.length > 28 ? d.name.slice(0, 25) + '...' : d.name)
      .attr('font-size', 10)
      .attr('fill', '#e8eaf0')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => -radiusScale(d.revenue || d.prominence * 1000000 || 1000000) - 6)
      .style('pointer-events', 'none')
      .style('text-shadow', '0 1px 3px rgba(0,0,0,0.8)')

    // Interactions
    node
      .on('mouseover', (event, d) => {
        const [x, y] = d3.pointer(event, svgRef.current)
        setTooltip({ x: x + 12, y: y - 12, node: d })
        link
          .attr('stroke-opacity', (l) =>
            l.source.name === d.name || l.target.name === d.name ? 0.9 : 0.08
          )
          .attr('stroke-width', (l) =>
            l.source.name === d.name || l.target.name === d.name ? 3 : 1
          )
        node.attr('opacity', (n) => {
          if (n.name === d.name) return 1
          const connected = edges.some(
            (e) =>
              (e.source.name === d.name && e.target.name === n.name) ||
              (e.target.name === d.name && e.source.name === n.name)
          )
          return connected ? 1 : 0.15
        })
        label.attr('opacity', (n) => {
          if (n.name === d.name) return 1
          const connected = edges.some(
            (e) =>
              (e.source.name === d.name && e.target.name === n.name) ||
              (e.target.name === d.name && e.source.name === n.name)
          )
          return connected ? 1 : 0.1
        })
      })
      .on('mouseout', () => {
        setTooltip(null)
        link
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', (d) => Math.max(1, Math.min(4, (d.amount || 0) / 1000000)))
        node.attr('opacity', 1)
        label.attr('opacity', 1)
      })
      .on('click', (event, d) => onNodeClick(d))

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)
      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)
      label.attr('x', (d) => d.x).attr('y', (d) => d.y)
    })

    return () => simulation.stop()
  }, [graph, selectedNode, onNodeClick])

  return (
    <>
      <svg ref={svgRef} />
      {tooltip && (
        <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          <h4>{tooltip.node.name}</h4>
          <p>
            {tooltip.node.type === 'organization' ? 'Org' : 'Person'} |{' '}
            {tooltip.node.category}
          </p>
          {tooltip.node.revenue > 0 && (
            <p>Revenue: ${(tooltip.node.revenue / 1e6).toFixed(1)}M</p>
          )}
          <p>
            Prominence: {tooltip.node.prominence.toFixed(1)}
            {tooltip.node.trend !== 'Stable' && (
              <span
                style={{
                  color: tooltip.node.trend === 'Rising' ? '#28a745' : '#dc3545',
                  marginLeft: 4,
                }}
              >
                {tooltip.node.trend === 'Rising' ? ' Rising' : ' Declining'}
              </span>
            )}
          </p>
          {tooltip.node.state && <p>State: {tooltip.node.state}</p>}
        </div>
      )}
    </>
  )
}

function drag(simulation) {
  return d3.drag()
    .on('start', (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    })
    .on('drag', (event, d) => {
      d.fx = event.x
      d.fy = event.y
    })
    .on('end', (event, d) => {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    })
}
