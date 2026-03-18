'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

const TABLE_CONFIG = {
  organizations: {
    label: 'Organizations',
    columns: [
      { key: 'name', label: 'Name', editable: true },
      { key: 'category', label: 'Category', editable: true, type: 'select', options: ['PAC', 'Super PAC', '501(c)(3)', '501(c)(4)', 'Think Tank', 'Media', 'Law Firm', 'Lobbying Firm', 'Party Committee', 'Campaign', 'Coalition', 'Grassroots', 'Other'] },
      { key: 'state', label: 'State', editable: true },
      { key: 'city', label: 'City', editable: true },
      { key: 'annual_revenue', label: 'Revenue', editable: true, type: 'number', format: 'currency' },
      { key: 'prominence_score', label: 'Prominence', editable: true, type: 'number' },
      { key: 'prominence_trend', label: 'Trend', editable: true, type: 'select', options: ['Rising', 'Stable', 'Declining'] },
      { key: 'website', label: 'Website', editable: true },
      { key: 'verified', label: 'Verified', editable: true, type: 'boolean' },
    ],
  },
  people: {
    label: 'People',
    columns: [
      { key: 'name', label: 'Name', editable: true },
      { key: 'role', label: 'Role', editable: true, type: 'select', options: ['Elected Official', 'Candidate', 'Donor', 'Consultant', 'Strategist', 'Media Figure', 'Activist', 'Lawyer', 'Lobbyist', 'Executive', 'Board Member', 'Other'] },
      { key: 'title', label: 'Title', editable: true },
      { key: 'state', label: 'State', editable: true },
      { key: 'party', label: 'Party', editable: true },
      { key: 'prominence_score', label: 'Prominence', editable: true, type: 'number' },
      { key: 'prominence_trend', label: 'Trend', editable: true, type: 'select', options: ['Rising', 'Stable', 'Declining'] },
      { key: 'website', label: 'Website', editable: true },
    ],
  },
  relationships: {
    label: 'Relationships',
    columns: [
      { key: 'entity_a_name', label: 'Entity A', editable: true },
      { key: 'entity_a_type', label: 'A Type', editable: true, type: 'select', options: ['organization', 'person'] },
      { key: 'entity_b_name', label: 'Entity B', editable: true },
      { key: 'entity_b_type', label: 'B Type', editable: true, type: 'select', options: ['organization', 'person'] },
      { key: 'relationship_type', label: 'Relationship', editable: true, type: 'select', options: ['Donation/Financial', 'Employment', 'Board Membership', 'Consulting', 'Coalition Partner', 'Subsidiary', 'Founding', 'Lobbying', 'Legal', 'Advisory', 'Endorsement', 'Other'] },
      { key: 'financial_amount', label: 'Amount', editable: true, type: 'number', format: 'currency' },
      { key: 'active', label: 'Active', editable: true, type: 'boolean' },
      { key: 'description', label: 'Description', editable: true },
    ],
  },
  events: {
    label: 'Events',
    columns: [
      { key: 'name', label: 'Name', editable: true },
      { key: 'organizer', label: 'Organizer', editable: true },
      { key: 'start_date', label: 'Start Date', editable: true, type: 'date' },
      { key: 'end_date', label: 'End Date', editable: true, type: 'date' },
      { key: 'location', label: 'Location', editable: true },
      { key: 'city', label: 'City', editable: true },
      { key: 'state', label: 'State', editable: true },
      { key: 'source_url', label: 'Source', editable: true },
      { key: 'calendar_invite_sent', label: 'Invite Sent', editable: true, type: 'boolean' },
    ],
  },
}

function formatValue(value, col) {
  if (value == null || value === '') return '—'
  if (col.type === 'boolean') return value ? 'Yes' : 'No'
  if (col.format === 'currency') {
    const num = Number(value)
    if (isNaN(num)) return value
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return '$' + (num / 1e3).toFixed(0) + 'K'
    return '$' + num.toLocaleString()
  }
  if (col.type === 'date' && value) {
    try {
      return new Date(value).toLocaleDateString()
    } catch { return value }
  }
  if (col.type === 'number') return String(value)
  const s = String(value)
  return s.length > 60 ? s.slice(0, 57) + '...' : s
}

export default function DataTable() {
  const [activeTable, setActiveTable] = useState('organizations')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [columnFilters, setColumnFilters] = useState({})
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [editingCell, setEditingCell] = useState(null) // { rowId, colKey }
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState(null)

  const config = TABLE_CONFIG[activeTable]

  const fetchData = useCallback(async (table) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/data?table=${table}`)
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setRows(json.data || [])
    } catch (err) {
      setError(err.message)
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setSearch('')
    setColumnFilters({})
    setSortCol(null)
    setEditingCell(null)
    fetchData(activeTable)
  }, [activeTable, fetchData])

  const filteredRows = useMemo(() => {
    let result = rows
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((row) =>
        config.columns.some((col) => {
          const v = row[col.key]
          return v != null && String(v).toLowerCase().includes(q)
        })
      )
    }
    // Column-specific filters
    for (const [key, val] of Object.entries(columnFilters)) {
      if (!val) continue
      const q = val.toLowerCase()
      result = result.filter((row) => {
        const v = row[key]
        return v != null && String(v).toLowerCase().includes(q)
      })
    }
    // Sort
    if (sortCol) {
      result = [...result].sort((a, b) => {
        const av = a[sortCol] ?? ''
        const bv = b[sortCol] ?? ''
        const numA = Number(av), numB = Number(bv)
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDir === 'asc' ? numA - numB : numB - numA
        }
        const cmp = String(av).localeCompare(String(bv))
        return sortDir === 'asc' ? cmp : -cmp
      })
    }
    return result
  }, [rows, search, columnFilters, sortCol, sortDir, config.columns])

  const handleSort = (colKey) => {
    if (sortCol === colKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(colKey)
      setSortDir('asc')
    }
  }

  const startEdit = (rowId, colKey, currentValue) => {
    setEditingCell({ rowId, colKey })
    setEditValue(currentValue == null ? '' : String(currentValue))
  }

  const cancelEdit = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const saveEdit = async () => {
    if (!editingCell) return
    setSaving(true)
    try {
      const col = config.columns.find((c) => c.key === editingCell.colKey)
      let value = editValue
      if (col.type === 'number') value = editValue === '' ? null : Number(editValue)
      else if (col.type === 'boolean') value = editValue === 'true'
      else if (col.type === 'date') value = editValue || null

      const res = await fetch('/api/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: activeTable,
          id: editingCell.rowId,
          updates: { [editingCell.colKey]: value },
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Save failed')
      }

      // Update local state
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingCell.rowId ? { ...r, [editingCell.colKey]: value } : r
        )
      )
      setStatusMsg('Saved')
      setTimeout(() => setStatusMsg(null), 2000)
      cancelEdit()
    } catch (err) {
      setStatusMsg('Error: ' + err.message)
      setTimeout(() => setStatusMsg(null), 4000)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (rowId) => {
    if (!confirm('Delete this row? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/data?table=${activeTable}&id=${rowId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Delete failed')
      setRows((prev) => prev.filter((r) => r.id !== rowId))
      setStatusMsg('Deleted')
      setTimeout(() => setStatusMsg(null), 2000)
    } catch (err) {
      setStatusMsg('Error: ' + err.message)
      setTimeout(() => setStatusMsg(null), 4000)
    }
  }

  const handleExport = (format) => {
    window.open(`/api/export?table=${activeTable}&format=${format}`, '_blank')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit()
    else if (e.key === 'Escape') cancelEdit()
  }

  const renderEditInput = (col) => {
    if (col.type === 'select') {
      return (
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="dt-edit-input"
        >
          <option value="">—</option>
          {col.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )
    }
    if (col.type === 'boolean') {
      return (
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="dt-edit-input"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      )
    }
    if (col.type === 'date') {
      return (
        <input
          type="datetime-local"
          value={editValue ? editValue.slice(0, 16) : ''}
          onChange={(e) => setEditValue(e.target.value ? new Date(e.target.value).toISOString() : '')}
          onKeyDown={handleKeyDown}
          autoFocus
          className="dt-edit-input"
        />
      )
    }
    return (
      <input
        type={col.type === 'number' ? 'number' : 'text'}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        className="dt-edit-input"
      />
    )
  }

  return (
    <div className="dt-container">
      <div className="dt-toolbar">
        <div className="dt-table-tabs">
          {Object.entries(TABLE_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              className={activeTable === key ? 'active' : ''}
              onClick={() => setActiveTable(key)}
            >
              {cfg.label}
            </button>
          ))}
        </div>
        <div className="dt-actions">
          <input
            type="text"
            placeholder="Search all columns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dt-search"
          />
          <button className="btn btn-secondary" onClick={() => handleExport('csv')}>
            Export CSV
          </button>
          <button className="btn btn-secondary" onClick={() => handleExport('json')}>
            Export JSON
          </button>
          <button className="btn btn-secondary" onClick={() => fetchData(activeTable)}>
            Refresh
          </button>
          <span className="dt-count">{filteredRows.length} rows</span>
        </div>
      </div>

      {statusMsg && (
        <div className={`dt-status ${statusMsg.startsWith('Error') ? 'error' : ''}`}>
          {statusMsg}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading {config.label}</div>
      ) : error ? (
        <div className="dt-error">{error}</div>
      ) : (
        <div className="dt-table-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                {config.columns.map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)}>
                    <div className="dt-th-content">
                      {col.label}
                      {sortCol === col.key && (
                        <span className="dt-sort-arrow">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="dt-actions-col">Actions</th>
              </tr>
              <tr className="dt-filter-row">
                {config.columns.map((col) => (
                  <th key={col.key}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      value={columnFilters[col.key] || ''}
                      onChange={(e) =>
                        setColumnFilters((f) => ({ ...f, [col.key]: e.target.value }))
                      }
                      className="dt-col-filter"
                    />
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  {config.columns.map((col) => {
                    const isEditing =
                      editingCell?.rowId === row.id && editingCell?.colKey === col.key
                    return (
                      <td
                        key={col.key}
                        onDoubleClick={() =>
                          col.editable && startEdit(row.id, col.key, row[col.key])
                        }
                        className={col.editable ? 'dt-editable' : ''}
                      >
                        {isEditing ? (
                          <div className="dt-edit-wrap">
                            {renderEditInput(col)}
                            <div className="dt-edit-actions">
                              <button onClick={saveEdit} disabled={saving} className="dt-save">
                                {saving ? '...' : 'Save'}
                              </button>
                              <button onClick={cancelEdit} className="dt-cancel">
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span title={row[col.key] != null ? String(row[col.key]) : ''}>
                            {formatValue(row[col.key], col)}
                          </span>
                        )}
                      </td>
                    )
                  })}
                  <td>
                    <button
                      className="dt-delete-btn"
                      onClick={() => handleDelete(row.id)}
                      title="Delete row"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={config.columns.length + 1} className="dt-empty">
                    {rows.length === 0 ? 'No data' : 'No matches for current filters'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
