'use client';

import { NDIS_STATS } from '../data/ndis-providers';

function formatCurrency(amount) {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

export default function StatsCards({ filteredStats }) {
  const stats = filteredStats || {
    totalFunding: NDIS_STATS.totalAnnualFunding,
    totalProviders: NDIS_STATS.totalProviders,
    totalParticipants: NDIS_STATS.totalParticipants,
    averagePlanBudget: NDIS_STATS.averagePlanBudget,
  };

  const cards = [
    {
      label: 'Total Annual Funding',
      value: formatCurrency(stats.totalFunding),
      sub: 'FY 2024-25',
      icon: '💰',
      color: '#10B981',
    },
    {
      label: 'Active Participants',
      value: stats.totalParticipants.toLocaleString(),
      sub: 'Across Australia',
      icon: '👥',
      color: '#3B82F6',
    },
    {
      label: 'Registered Providers',
      value: stats.totalProviders.toLocaleString(),
      sub: 'All categories',
      icon: '🏢',
      color: '#8B5CF6',
    },
    {
      label: 'Avg Plan Budget',
      value: formatCurrency(stats.averagePlanBudget),
      sub: 'Per participant',
      icon: '📋',
      color: '#F59E0B',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div key={card.label} className="stat-card">
          <div className="stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
            {card.icon}
          </div>
          <div className="stat-content">
            <span className="stat-value" style={{ color: card.color }}>{card.value}</span>
            <span className="stat-label">{card.label}</span>
            <span className="stat-sub">{card.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
