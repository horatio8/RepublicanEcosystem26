'use client';

import { NDIS_STATS } from '../data/ndis-providers';

function formatCurrency(amount) {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M`;
  return `$${amount}`;
}

const STATE_COLORS = {
  NSW: '#3B82F6',
  VIC: '#10B981',
  QLD: '#F59E0B',
  SA: '#EF4444',
  WA: '#8B5CF6',
  TAS: '#06B6D4',
  ACT: '#F97316',
  NT: '#EC4899',
};

export default function StateBreakdown() {
  const states = Object.entries(NDIS_STATS.stateBreakdown);
  const maxFunding = Math.max(...states.map(([, s]) => s.funding));

  return (
    <div className="state-breakdown">
      <h3>Funding by State/Territory</h3>
      <div className="state-bars">
        {states.map(([state, data]) => (
          <div key={state} className="state-bar-row">
            <span className="state-label" style={{ color: STATE_COLORS[state] }}>{state}</span>
            <div className="state-bar-track">
              <div
                className="state-bar-fill"
                style={{
                  width: `${(data.funding / maxFunding) * 100}%`,
                  background: STATE_COLORS[state],
                }}
              />
            </div>
            <span className="state-amount">{formatCurrency(data.funding)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
