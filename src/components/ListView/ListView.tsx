import React from 'react';
import { Venue } from '../../types';
import { getCategoryIcon, getCategoryLabel, formatWaitTime, getActivityColor } from '../../utils/venueUtils';

interface ListViewProps {
  venues: Venue[];
  onVenueSelect: (venue: Venue | null) => void;
}

const ListView: React.FC<ListViewProps> = ({ venues, onVenueSelect }) => {
  if (venues.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No venues found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {venues.map((venue) => {
        const color = getActivityColor(venue.activityLevel);
        return (
          <div
            key={venue.id}
            onClick={() => onVenueSelect(venue)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{getCategoryIcon(venue.category)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{venue.name}</h3>
                  <p className="text-sm text-gray-600">{getCategoryLabel(venue.category)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {venue.capacity}% capacity
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Wait time: {formatWaitTime(venue.waitTime)}
              </p>

              <p className="text-xs text-gray-500 text-xs">{venue.address}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListView;

