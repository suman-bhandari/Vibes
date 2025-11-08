import React, { useState, useEffect } from 'react';
import { Venue } from '../../types';
import { getCategoryLabel, getCategoryIcon, formatWaitTime, getActivityColor } from '../../utils/venueUtils';
import { getAISummary, getReviews } from '../../services/reviews';
import ReviewModal from '../Reviews/ReviewModal';
import ReviewsList from '../Reviews/ReviewsList';

interface VenuePopupProps {
  venue: Venue;
}

const VenuePopup: React.FC<VenuePopupProps> = ({ venue }) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewsList, setShowReviewsList] = useState(false);

  useEffect(() => {
    const reviews = getReviews(venue.id);
    const summary = getAISummary(venue, reviews);
    setAiSummary(summary);
  }, [venue]);

  const handleGetDirections = () => {
    console.log('Get directions to:', venue.name, venue.address);
    // In a real app, this would open Google Maps or Apple Maps
  };

  const color = getActivityColor(venue.activityLevel);

  return (
    <>
      <div className="p-2 min-w-[280px] max-w-[320px]">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xl">{getCategoryIcon(venue.category)}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{venue.name}</h3>
            <p className="text-xs text-gray-600">{getCategoryLabel(venue.category)}</p>
          </div>
        </div>

        {/* AI Summary */}
        {aiSummary && (
          <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-gray-700 dark:text-gray-300 italic">
              "{aiSummary}"
            </p>
          </div>
        )}
        
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {venue.capacity}% capacity
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Wait time: {formatWaitTime(venue.waitTime)}
          </p>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{venue.address}</p>

        <div className="space-y-2">
          <button
            onClick={() => setShowReviewModal(true)}
            className="w-full px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
          >
            Add Review
          </button>
          <button
            onClick={() => setShowReviewsList(true)}
            className="w-full px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Show Reviews
          </button>
          <button
            onClick={handleGetDirections}
            className="w-full px-3 py-1.5 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 transition-colors"
          >
            Get Directions
          </button>
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          venue={venue}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onReviewAdded={() => {
            const reviews = getReviews(venue.id);
            setAiSummary(getAISummary(venue, reviews));
          }}
        />
      )}

      {showReviewsList && (
        <ReviewsList
          venue={venue}
          isOpen={showReviewsList}
          onClose={() => setShowReviewsList(false)}
        />
      )}
    </>
  );
};

export default VenuePopup;

