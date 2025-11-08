import React, { useState, useEffect } from 'react';
import { Venue, Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { saveReview, checkLocationVerification } from '../../services/reviews';
import { getCurrentLocation } from '../../services/location';

interface ReviewModalProps {
  venue: Venue;
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ venue, isOpen, onClose, onReviewAdded }) => {
  const { user, updateUser } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [timeSpent, setTimeSpent] = useState(30); // minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [allowOnce, setAllowOnce] = useState(false);
  const [hasUsedAllowOnce, setHasUsedAllowOnce] = useState(() => {
    return localStorage.getItem(`allowOnce_${user?.id}`) === 'true';
  });

  useEffect(() => {
    if (!isOpen) {
      setRating(5);
      setComment('');
      setTimeSpent(30);
      setLocationError(null);
      setAllowOnce(false);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsVerifying(true);
    setLocationError(null);

    try {
      // Get user's current location
      const userLocation = await getCurrentLocation();
      
      // Check if user is at the venue (within 50 meters)
      const isAtVenue = checkLocationVerification(
        userLocation.latitude,
        userLocation.longitude,
        venue,
        50
      );

      if (!isAtVenue && !allowOnce) {
        if (!hasUsedAllowOnce) {
          // First time: offer the "allow once" option
          setAllowOnce(true);
          setIsVerifying(false);
          return;
        } else {
          setLocationError('You must be at the venue to leave a review. Please enable location services and visit the venue.');
          setIsVerifying(false);
          return;
        }
      }

      // If allowOnce is true, mark it as used
      if (allowOnce && !hasUsedAllowOnce) {
        localStorage.setItem(`allowOnce_${user.id}`, 'true');
        setHasUsedAllowOnce(true);
      }

      // Create review
      const review: Omit<Review, 'id' | 'createdAt'> = {
        venueId: venue.id,
        userId: user.id,
        userName: user.name,
        userAvatarUrl: user.avatarUrl,
        userTrustability: user.trustability,
        rating,
        comment,
        lastVisitDate: new Date(),
        totalTimeSpent: timeSpent,
        verified: isAtVenue || allowOnce,
      };

      saveReview(review);

      // Update user trustability (increase by 1-5 based on rating and verification)
      const trustabilityIncrease = isAtVenue ? rating : Math.max(1, rating - 1);
      const newTrustability = Math.min(100, user.trustability + trustabilityIncrease);
      updateUser({
        trustability: newTrustability,
        totalReviews: user.totalReviews + 1,
      });

      onReviewAdded();
      onClose();
    } catch (error: any) {
      setLocationError(error.message || 'Failed to verify location. Please enable location services.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Review</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{venue.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{venue.address}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Share your experience..."
              required
            />
          </div>

          {/* Time Spent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time Spent (minutes)
            </label>
            <input
              type="number"
              value={timeSpent}
              onChange={(e) => setTimeSpent(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          {locationError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{locationError}</p>
            </div>
          )}

          {allowOnce && !hasUsedAllowOnce && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                You're not at the venue. You can submit this review once, but it will affect your trustability score.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? 'Verifying...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;

