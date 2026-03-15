'use client'

const ORG_CATEGORIES = [
  'PAC', 'Super PAC', 'Leadership PAC',
  '501(c)(3) Nonprofit', '501(c)(4) Nonprofit',
  'Think Tank', 'Media Organization', 'Consulting Firm', 'Law Firm',
  'Lobbying Firm', 'Business / Corporation', 'National Party Committee',
  'Grassroots Organization', 'Religious Organization',
]

const STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DC','DE','FL','GA','HI','ID','IL','IN',
  'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV',
  'NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN',
  'TX','UT','VT','VA','WA','WV','WI','WY',
]

export default function Sidebar({
  filters,
  onFiltersChange,
  selectedNode,
  searchQuery,
  onSearchChange,
  stats,
  onTriggerJob,
  onRefetch,
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
          <label>Min Prominence: {filters.minProminence || 0}</label>
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
        </div>
      </div>

      {/* Legend */}
      <div className="sidebar-section">
        <h3>Node Types</h3>
        {[
          ['#dc3545', 'PACs / Party'],
          ['#2ecc71', 'Nonprofits'],
          ['#3498db', 'Think Tanks'],
          ['#e67e22', 'Media'],
          ['#9b59b6', 'Consulting'],
          ['#f39c12', 'Lobbying'],
          ['#34495e', 'Business'],
        ].map(([color, label]) => (
          <div key={label} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            {label}
          </div>
        ))}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />
        <h3 style={{ marginTop: 8 }}>Edge Types</h3>
        {[
          ['#f0c040', 'Financial'],
          ['#2ecc71', 'Coalition'],
          ['#dc3545', 'Founding'],
          ['#4a90d9', 'Employment'],
          ['#6c757d', 'Advisory'],
        ].map(([color, label]) => (
          <div key={label} className="legend-item">
            <span className="legend-line" style={{ background: color }} />
            {label}
          </div>
        ))}
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
                ${selectedNode.revenue >= 1e9
                  ? (selectedNode.revenue / 1e9).toFixed(1) + 'B'
                  : (selectedNode.revenue / 1e6).toFixed(1) + 'M'}
              </span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Prominence</span>
            <span className="detail-value">{selectedNode.prominence.toFixed(1)}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Trend</span>
            <span className="detail-value">
              <span className={`trend-badge ${selectedNode.trend?.toLowerCase()}`}>
                {selectedNode.trend === 'Rising' ? 'Rising' : selectedNode.trend === 'Declining' ? 'Declining' : 'Stable'}
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
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {selectedNode.description}
            </div>
          )}

          {selectedNode.website && (
            <a
              href={selectedNode.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ marginTop: 12, display: 'inline-block', fontSize: 12, textDecoration: 'none' }}
            >
              Visit Website
            </a>
          )}
        </div>
      )}

      {/* Category Breakdown */}
      {stats?.categories && (
        <div className="sidebar-section">
          <h3>Category Breakdown</h3>
          {Object.entries(stats.categories)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, count]) => (
              <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '2px 0', color: 'var(--text-secondary)' }}>
                <span>{cat}</span>
                <span style={{ color: 'var(--text-primary)' }}>{count}</span>
              </div>
            ))}
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
          <button className="btn btn-secondary" onClick={onRefetch}>
            Refresh Data
          </button>
        </div>
      </div>
    </aside>
  )
}
