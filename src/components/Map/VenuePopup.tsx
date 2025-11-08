import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Venue } from '../../types';
import { getCategoryLabel, getCategoryIcon, formatWaitTime, formatWaitTimeInterval, getActivityColor } from '../../utils/venueUtils';
import { getAISummary, getReviews } from '../../services/reviews';
import { getReputationColor, getReputationBgColor } from '../../utils/reputationUtils';
import ReviewModal from '../Reviews/ReviewModal';
import ReviewsList from '../Reviews/ReviewsList';

interface VenuePopupProps {
  venue: Venue;
}

const VenuePopup: React.FC<VenuePopupProps> = ({ venue }) => {
  const navigate = useNavigate();
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

        {/* Special Event Badge */}
        {venue.isSpecialEvent && (
          <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
            <div className="flex items-center gap-1">
              <span className="text-sm">⭐</span>
              <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">
                {venue.specialEventDescription}
              </p>
            </div>
          </div>
        )}

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
          
          {/* Service-based venues: Show wait time interval */}
          {(venue.category === 'restaurant' || venue.category === 'salon' || venue.category === 'coffee') && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Wait time: {venue.waitTimeInterval ? formatWaitTimeInterval(venue.waitTimeInterval) : formatWaitTime(venue.waitTime)}
            </p>
          )}
          
          {/* Social venues: Show vibe and crowd */}
          {(venue.category === 'bar' || venue.category === 'club') && (
            <div className="space-y-1">
              {venue.vibe !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Vibe:</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full"
                      style={{ width: `${venue.vibe * 10}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{venue.vibe}/10</span>
                </div>
              )}
              {venue.crowd !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Crowd:</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-orange-500 h-1.5 rounded-full"
                      style={{ width: `${venue.crowd * 10}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{venue.crowd}/10</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Comments */}
        {venue.liveComments && venue.liveComments.length > 0 && (
          <div className="mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Live Comments:</p>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {venue.liveComments.slice(0, 2).map((comment) => {
                const timeAgo = Math.floor((Date.now() - comment.timestamp.getTime()) / 60000);
                const repColor = getReputationColor(comment.reputation);
                return (
                  <div key={comment.id} className="text-xs">
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white mr-1"
                      style={{ backgroundColor: repColor }}
                    >
                      {comment.userName}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{comment.comment}</span>
                    <span className="text-gray-400 dark:text-gray-500 text-[10px] ml-1"> {timeAgo}m ago</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
            onClick={() => navigate(`/venue/${venue.id}`)}
            className="w-full px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors"
          >
            View Details
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

