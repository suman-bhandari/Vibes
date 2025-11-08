import React from 'react';
import { Venue } from '../../types';
import { getCategoryLabel, getCategoryIcon, formatWaitTime, getActivityColor } from '../../utils/venueUtils';

interface VenuePopupProps {
  venue: Venue;
}

const VenuePopup: React.FC<VenuePopupProps> = ({ venue }) => {
  const handleGetDirections = () => {
    console.log('Get directions to:', venue.name, venue.address);
    // In a real app, this would open Google Maps or Apple Maps
  };

  const color = getActivityColor(venue.activityLevel);

  return (
    <div className="p-2 min-w-[200px]">
      <div className="flex items-start gap-2 mb-2">
        <span className="text-xl">{getCategoryIcon(venue.category)}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{venue.name}</h3>
          <p className="text-xs text-gray-600">{getCategoryLabel(venue.category)}</p>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-medium text-gray-700">
            {venue.capacity}% capacity
          </span>
        </div>
        <p className="text-xs text-gray-600">
          Wait time: {formatWaitTime(venue.waitTime)}
        </p>
      </div>

      <p className="text-xs text-gray-500 mb-3">{venue.address}</p>

      <button
        onClick={handleGetDirections}
        className="w-full px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
      >
        Get Directions
      </button>
    </div>
  );
};

export default VenuePopup;

