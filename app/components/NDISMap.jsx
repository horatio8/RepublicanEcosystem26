'use client';

import { useEffect, useRef, useState } from 'react';
import { getCategoryColor } from '../data/ndis-providers';

export default function NDISMap({ providers, center, zoom, selectedProvider, onSelectProvider, searchOrigin }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);
  const originMarkerRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Fix Leaflet default icon issue with bundlers
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(center || [-25.2744, 133.7751], zoom || 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      updateMarkers(L, map, providers);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when providers change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const updateAsync = async () => {
      const L = (await import('leaflet')).default;
      updateMarkers(L, mapInstanceRef.current, providers);
    };
    updateAsync();
  }, [providers]);

  // Update map view when center changes
  useEffect(() => {
    if (!mapInstanceRef.current || !center) return;

    const updateView = async () => {
      const L = (await import('leaflet')).default;
      mapInstanceRef.current.setView(center, zoom || 11, { animate: true });

      // Draw search radius circle
      if (circleRef.current) {
        circleRef.current.remove();
      }
      if (originMarkerRef.current) {
        originMarkerRef.current.remove();
      }

      if (searchOrigin) {
        circleRef.current = L.circle(center, {
          radius: 50000, // 50km
          color: '#3B82F6',
          fillColor: '#3B82F6',
          fillOpacity: 0.08,
          weight: 2,
          dashArray: '8 4',
        }).addTo(mapInstanceRef.current);

        // Add origin marker
        const originIcon = L.divIcon({
          className: 'origin-marker',
          html: `<div style="
            width: 20px; height: 20px;
            background: #3B82F6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(59,130,246,0.5);
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        originMarkerRef.current = L.marker(center, { icon: originIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`<strong>Your Location</strong><br/>${searchOrigin.postcode} ${searchOrigin.locality}, ${searchOrigin.state}`);
      }
    };
    updateView();
  }, [center, zoom, searchOrigin]);

  // Highlight selected provider
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedProvider) return;
    mapInstanceRef.current.setView([selectedProvider.lat, selectedProvider.lng], 14, { animate: true });
  }, [selectedProvider]);

  function updateMarkers(L, map, providerList) {
    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    providerList.forEach(provider => {
      const primaryCategory = provider.categories[0];
      const color = getCategoryColor(primaryCategory);
      const size = Math.min(Math.max(Math.sqrt(provider.funding / 1_000_000) * 2, 8), 24);

      const icon = L.divIcon({
        className: 'provider-marker',
        html: `<div style="
          width: ${size}px; height: ${size}px;
          background: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.3)'" onmouseout="this.style.transform='scale(1)'"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const distanceText = provider.distance !== undefined
        ? `<br/><strong>${provider.distance.toFixed(1)} km away</strong>`
        : '';

      const marker = L.marker([provider.lat, provider.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 200px; font-family: system-ui, sans-serif;">
            <h3 style="margin: 0 0 8px; font-size: 14px; color: #1E293B;">${provider.name}</h3>
            <p style="margin: 0 0 4px; font-size: 12px; color: #64748B;">
              ${provider.city}, ${provider.state} ${provider.postcode}
            </p>
            <p style="margin: 0 0 4px; font-size: 12px; color: #64748B;">
              <strong>$${(provider.funding / 1_000_000).toFixed(1)}M</strong> funding &bull;
              <strong>${provider.participants.toLocaleString()}</strong> participants
            </p>
            <div style="margin: 6px 0; display: flex; flex-wrap: wrap; gap: 3px;">
              ${provider.categories.map(c =>
                `<span style="font-size: 10px; padding: 2px 6px; border-radius: 9999px; background: ${getCategoryColor(c)}20; color: ${getCategoryColor(c)}; border: 1px solid ${getCategoryColor(c)}40;">${c}</span>`
              ).join('')}
            </div>
            ${distanceText}
          </div>
        `);

      marker.on('click', () => {
        if (onSelectProvider) onSelectProvider(provider);
      });

      markersRef.current.push(marker);
    });
  }

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
  );
}
