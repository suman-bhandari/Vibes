import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Venue } from '../../types';
import { getActivityColor } from '../../utils/venueUtils';
import VenuePopup from './VenuePopup';

// Fix for default marker icon in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  venues: Venue[];
  selectedVenue: Venue | null;
  onVenueSelect: (venue: Venue | null) => void;
}

// Component to handle map centering when venue is selected
function MapController({ selectedVenue }: { selectedVenue: Venue | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedVenue) {
      map.setView([selectedVenue.latitude, selectedVenue.longitude], 16, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [selectedVenue, map]);

  return null;
}

const MapView: React.FC<MapViewProps> = ({ venues, selectedVenue, onVenueSelect }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  // Open popup when venue is selected
  useEffect(() => {
    if (selectedVenue) {
      const marker = markerRefs.current.get(selectedVenue.id);
      if (marker) {
        // Wait for map animation to complete, then open popup
        setTimeout(() => {
          marker.openPopup();
        }, 600);
      }
    }
  }, [selectedVenue]);

  // Create custom marker icons based on activity level
  const createCustomIcon = (venue: Venue) => {
    const color = getActivityColor(venue.activityLevel);
    const hasHighVibe = venue.vibe !== undefined && venue.vibe >= 8;
    
    if (hasHighVibe) {
      // Star marker for venues with high vibe (8 or more)
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            font-size: 32px;
            line-height: 1;
            filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
            cursor: pointer;
            text-align: center;
            color: #FFD700;
            text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
          ">⭐</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    }
    
    // Regular circle marker for normal venues
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s;
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[37.7749, -122.4194]} // San Francisco center
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController selectedVenue={selectedVenue} />
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            position={[venue.latitude, venue.longitude]}
            icon={createCustomIcon(venue)}
            eventHandlers={{
              click: () => {
                onVenueSelect(venue);
              },
              add: (e) => {
                // Store marker reference when added to map
                const marker = e.target as L.Marker;
                markerRefs.current.set(venue.id, marker);
              },
            }}
          >
            <Popup>
              <VenuePopup venue={venue} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;

