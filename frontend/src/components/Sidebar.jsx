import React from 'react'

const ORG_CATEGORIES = [
  'PAC', 'Super PAC', '501(c)(3) Nonprofit', '501(c)(4) Nonprofit',
  'Think Tank', 'Media Organization', 'Consulting Firm', 'Law Firm',
  'Lobbying Firm', 'Business / Corporation', 'National Party Committee',
]

const STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN',
  'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV',
  'NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN',
  'TX','UT','VT','VA','WA','WV','WI','WY','DC',
]

export default function Sidebar({
  filters,
  onFiltersChange,
  selectedNode,
  searchQuery,
  onSearchChange,
  stats,
  onTriggerJob,
  risingStars,
}) {
  return (
    <aside className="sidebar">
      {/* Search */}
      <div className="sidebar-section">
        <h3>Search</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search entities..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="sidebar-section">
        <h3>Filters</h3>
        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, category: e.target.value || undefined })
            }
          >
            <option value="">All Categories</option>
            {ORG_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>State</label>
          <select
            value={filters.state || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, state: e.target.value || undefined })
            }
          >
            <option value="">All States</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Min Prominence</label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.minProminence || 0}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                minProminence: Number(e.target.value) || undefined,
              })
            }
          />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {filters.minProminence || 0}+
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="sidebar-section">
        <h3>Legend</h3>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#dc3545' }} />
          PACs / Party
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#2ecc71' }} />
          Nonprofits
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#3498db' }} />
          Think Tanks
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#e67e22' }} />
          Media
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#9b59b6' }} />
          Consulting
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#f39c12' }} />
          Lobbying
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />
        <div className="legend-item">
          <span className="legend-line" style={{ background: '#f0c040' }} />
          Financial
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ background: '#4a90d9' }} />
          Employment
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ background: '#e74c3c' }} />
          Board
        </div>
      </div>

      {/* Selected Node Detail */}
      {selectedNode && (
        <div className="sidebar-section node-detail">
          <h3>Selected Entity</h3>
          <h2>{selectedNode.name}</h2>
          <div className="node-category">{selectedNode.category}</div>

          <div className="detail-row">
            <span className="detail-label">Type</span>
            <span className="detail-value">
              {selectedNode.type === 'organization' ? 'Organization' : 'Person'}
            </span>
          </div>

          {selectedNode.revenue > 0 && (
            <div className="detail-row">
              <span className="detail-label">Revenue</span>
              <span className="detail-value">
                ${(selectedNode.revenue / 1e6).toFixed(1)}M
              </span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Prominence</span>
            <span className="detail-value">
              {selectedNode.prominence.toFixed(1)}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Trend</span>
            <span className="detail-value">
              <span className={`trend-badge ${selectedNode.trend?.toLowerCase()}`}>
                {selectedNode.trend === 'Rising' ? '↑' : selectedNode.trend === 'Declining' ? '↓' : '→'}{' '}
                {selectedNode.trend}
              </span>
            </span>
          </div>

          {selectedNode.state && (
            <div className="detail-row">
              <span className="detail-label">State</span>
              <span className="detail-value">{selectedNode.state}</span>
            </div>
          )}

          {selectedNode.description && (
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
              {selectedNode.description}
            </div>
          )}

          {selectedNode.website && (
            <a
              href={selectedNode.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ marginTop: 12, display: 'inline-block', fontSize: 12 }}
            >
              Visit Website
            </a>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="sidebar-section">
        <h3>Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn btn-primary" onClick={() => onTriggerJob('scrape-events')}>
            Scrape Events Now
          </button>
          <button className="btn btn-secondary" onClick={() => onTriggerJob('research-fec')}>
            Run FEC Research
          </button>
          <button className="btn btn-secondary" onClick={() => onTriggerJob('send-invites')}>
            Send Calendar Invites
          </button>
        </div>
      </div>
    </aside>
  )
}
