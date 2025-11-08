import React, { useState } from 'react';
import { LiveEvent } from '../../types';
import { mockEvents } from '../../data/mockEvents';

interface LiveEventsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEventSelect: (event: LiveEvent) => void;
}

const LiveEventsPanel: React.FC<LiveEventsPanelProps> = ({ isOpen, onClose, onEventSelect }) => {
  const [events] = useState<LiveEvent[]>(mockEvents);

  if (!isOpen) return null;

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const getCategoryIcon = (category: LiveEvent['category']) => {
    switch (category) {
      case 'festival':
        return '🎪';
      case 'concert':
        return '🎵';
      case 'market':
        return '🛒';
      case 'sports':
        return '⚽';
      default:
        return '📍';
    }
  };

  const isEventActive = (event: LiveEvent) => {
    const now = new Date();
    return now >= event.startTime && now <= event.endTime;
  };

  const isEventUpcoming = (event: LiveEvent) => {
    const now = new Date();
    return now < event.startTime;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Events Nearby</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              One-time events happening in your area
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto p-6">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No live events nearby at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const active = isEventActive(event);
                const upcoming = isEventUpcoming(event);

                return (
                  <div
                    key={event.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      active
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
                    }`}
                    onClick={() => onEventSelect(event)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{getCategoryIcon(event.category)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{event.name}</h3>
                          {active && (
                            <span className="px-2 py-0.5 bg-green-500 text-white rounded text-xs font-medium">
                              LIVE
                            </span>
                          )}
                          {upcoming && (
                            <span className="px-2 py-0.5 bg-blue-500 text-white rounded text-xs font-medium">
                              UPCOMING
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div>
                            <span className="font-medium">Starts:</span> {formatTime(event.startTime)}
                          </div>
                          <div>
                            <span className="font-medium">Ends:</span> {formatTime(event.endTime)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveEventsPanel;

