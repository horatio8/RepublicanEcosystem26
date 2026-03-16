'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { NDIS_PROVIDERS, NDIS_STATS, searchProvidersByPostcode } from './data/ndis-providers';
import { AUSTRALIAN_POSTCODES } from './data/postcodes';
import StatsCards from './components/StatsCards';
import PostcodeSearch from './components/PostcodeSearch';
import ProviderList from './components/ProviderList';
import StateBreakdown from './components/StateBreakdown';

// Dynamic import for Leaflet (no SSR)
const NDISMap = dynamic(() => import('./components/NDISMap'), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <div className="map-loading-spinner" />
      <p>Loading map...</p>
    </div>
  ),
});

export default function Home() {
  const [searchPostcode, setSearchPostcode] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');

  const searchResult = useMemo(() => {
    if (!searchPostcode) return null;
    return searchProvidersByPostcode(searchPostcode, NDIS_PROVIDERS, AUSTRALIAN_POSTCODES, 50);
  }, [searchPostcode]);

  const displayProviders = useMemo(() => {
    let list = searchResult ? searchResult.providers : NDIS_PROVIDERS;

    if (categoryFilter !== 'all') {
      list = list.filter(p => p.categories.includes(categoryFilter));
    }
    if (stateFilter !== 'all') {
      list = list.filter(p => p.state === stateFilter);
    }

    return list;
  }, [searchResult, categoryFilter, stateFilter]);

  const mapCenter = useMemo(() => {
    if (searchResult?.origin) {
      return [searchResult.origin.lat, searchResult.origin.lng];
    }
    return [-25.2744, 133.7751]; // Center of Australia
  }, [searchResult]);

  const mapZoom = useMemo(() => {
    return searchResult?.origin ? 11 : 5;
  }, [searchResult]);

  const filteredStats = useMemo(() => {
    if (!searchResult) return null;
    const provs = displayProviders;
    return {
      totalFunding: provs.reduce((sum, p) => sum + p.funding, 0),
      totalProviders: provs.length,
      totalParticipants: provs.reduce((sum, p) => sum + p.participants, 0),
      averagePlanBudget: NDIS_STATS.averagePlanBudget,
    };
  }, [displayProviders, searchResult]);

  const handleSearch = useCallback((postcode) => {
    setSearchPostcode(postcode);
    setSelectedProvider(null);
  }, []);

  const handleClear = useCallback(() => {
    setSearchPostcode(null);
    setSelectedProvider(null);
    setCategoryFilter('all');
    setStateFilter('all');
  }, []);

  const allCategories = useMemo(() => {
    const cats = new Set();
    NDIS_PROVIDERS.forEach(p => p.categories.forEach(c => cats.add(c)));
    return Array.from(cats).sort();
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-brand">
            <div className="header-logo">
              <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                <rect width="32" height="32" rx="8" fill="#1D4ED8" />
                <path d="M8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16C24 20.42 20.42 24 16 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="16" cy="16" r="3" fill="white" />
              </svg>
            </div>
            <div>
              <h1>NDIS Operations Map</h1>
              <p className="header-subtitle">National Disability Insurance Scheme Provider Directory</p>
            </div>
          </div>
          <div className="header-search">
            <PostcodeSearch
              postcodes={AUSTRALIAN_POSTCODES}
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <section className="dashboard">
        <StatsCards filteredStats={filteredStats} />
      </section>

      {/* Filters */}
      <section className="filters-bar">
        <div className="filters-content">
          <div className="filter-group">
            <label>Service Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>State/Territory</label>
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="all">All States</option>
              <option value="NSW">New South Wales</option>
              <option value="VIC">Victoria</option>
              <option value="QLD">Queensland</option>
              <option value="SA">South Australia</option>
              <option value="WA">Western Australia</option>
              <option value="TAS">Tasmania</option>
              <option value="ACT">ACT</option>
              <option value="NT">Northern Territory</option>
            </select>
          </div>
          {searchPostcode && (
            <div className="filter-active">
              <span>Showing results near <strong>{searchPostcode}</strong></span>
              <button onClick={handleClear} className="filter-clear-btn">Clear search</button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="map-container">
          <NDISMap
            providers={displayProviders}
            center={mapCenter}
            zoom={mapZoom}
            selectedProvider={selectedProvider}
            onSelectProvider={setSelectedProvider}
            searchOrigin={searchResult?.origin}
          />
        </div>
        <aside className="sidebar">
          {selectedProvider ? (
            <div className="provider-detail">
              <button className="back-btn" onClick={() => setSelectedProvider(null)}>
                &larr; Back to list
              </button>
              <h2>{selectedProvider.name}</h2>
              <p className="detail-location">{selectedProvider.city}, {selectedProvider.state} {selectedProvider.postcode}</p>
              {selectedProvider.distance !== undefined && (
                <p className="detail-distance">{selectedProvider.distance.toFixed(1)} km from your location</p>
              )}
              <div className="detail-stats">
                <div className="detail-stat">
                  <span className="detail-stat-value">${(selectedProvider.funding / 1_000_000).toFixed(1)}M</span>
                  <span className="detail-stat-label">Annual Funding</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-value">{selectedProvider.participants.toLocaleString()}</span>
                  <span className="detail-stat-label">Participants</span>
                </div>
                {selectedProvider.rating > 0 && (
                  <div className="detail-stat">
                    <span className="detail-stat-value">{selectedProvider.rating}/5</span>
                    <span className="detail-stat-label">Rating</span>
                  </div>
                )}
              </div>
              <div className="detail-section">
                <h4>Services</h4>
                <div className="detail-categories">
                  {selectedProvider.categories.map(cat => (
                    <span key={cat} className="detail-category-tag">{cat}</span>
                  ))}
                </div>
              </div>
              {selectedProvider.phone && (
                <div className="detail-section">
                  <h4>Contact</h4>
                  <p className="detail-phone">{selectedProvider.phone}</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <ProviderList
                providers={displayProviders}
                selectedProvider={selectedProvider}
                onSelectProvider={setSelectedProvider}
                isSearchResult={!!searchPostcode}
              />
              {!searchPostcode && <StateBreakdown />}
            </>
          )}
        </aside>
      </main>
    </div>
  );
}
