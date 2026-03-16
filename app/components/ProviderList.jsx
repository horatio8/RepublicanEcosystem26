'use client';

import { getCategoryColor } from '../data/ndis-providers';

function formatCurrency(amount) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

export default function ProviderList({ providers, selectedProvider, onSelectProvider, isSearchResult }) {
  if (providers.length === 0) {
    return (
      <div className="provider-list-empty">
        <p>No providers found. Try a different postcode or increase the search radius.</p>
      </div>
    );
  }

  return (
    <div className="provider-list">
      <div className="provider-list-header">
        <h3>{isSearchResult ? `${providers.length} Providers Nearby` : `All Providers (${providers.length})`}</h3>
      </div>
      <div className="provider-list-items">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`provider-card ${selectedProvider?.id === provider.id ? 'selected' : ''}`}
            onClick={() => onSelectProvider(provider)}
          >
            <div className="provider-card-header">
              <h4>{provider.name}</h4>
              {provider.distance !== undefined && (
                <span className="provider-distance">{provider.distance.toFixed(1)} km</span>
              )}
            </div>
            <p className="provider-location">{provider.city}, {provider.state} {provider.postcode}</p>
            <div className="provider-stats">
              <span className="provider-funding">{formatCurrency(provider.funding)}</span>
              <span className="provider-separator">&bull;</span>
              <span className="provider-participants">{provider.participants.toLocaleString()} participants</span>
            </div>
            <div className="provider-categories">
              {provider.categories.map((cat) => (
                <span
                  key={cat}
                  className="category-tag"
                  style={{
                    background: `${getCategoryColor(cat)}15`,
                    color: getCategoryColor(cat),
                    borderColor: `${getCategoryColor(cat)}40`,
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
            {provider.phone && (
              <p className="provider-phone">{provider.phone}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
