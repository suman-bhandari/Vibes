import React from 'react';
import { Venue } from '../../types';
import { getReviews } from '../../services/reviews';
import { formatWaitTime } from '../../utils/venueUtils';
import { getReputationColor } from '../../utils/reputationUtils';

interface ReviewsListProps {
  venue: Venue;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ venue, isOpen, onClose }) => {
  if (!isOpen) return null;

  const reviews = getReviews(venue.id);
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{venue.name} Reviews</h2>
            {reviews.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {avgRating.toFixed(1)} ⭐ average ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </p>
            )}
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

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto p-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white mb-1"
                          style={{ backgroundColor: getReputationColor(review.userReputation) }}
                        >
                          {review.userName}
                        </span>
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          <span className="text-gray-500 dark:text-gray-400">
                            Activity: {review.activityQuotient}%
                          </span>
                          {review.verified && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 text-lg">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Last visit:</span> {formatDate(review.lastVisitDate)}
                    </div>
                    <div>
                      <span className="font-medium">Time spent:</span> {formatWaitTime(review.totalTimeSpent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;

