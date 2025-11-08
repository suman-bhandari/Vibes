import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Venue } from '../types';
import { mockVenues } from '../data/mockVenues';
import { getReviews } from '../services/reviews';
import { getAISummary } from '../services/reviews';
import { getCategoryIcon, getCategoryLabel, formatWaitTimeInterval, getActivityColor } from '../utils/venueUtils';
import { getReputationColor, getReputationBgColor } from '../utils/reputationUtils';
import ReviewModal from '../components/Reviews/ReviewModal';
import ReviewsList from '../components/Reviews/ReviewsList';

const VenueDetailsScreen: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewsList, setShowReviewsList] = useState(false);

  useEffect(() => {
    if (venueId) {
      const foundVenue = mockVenues.find((v) => v.id === venueId);
      if (foundVenue) {
        setVenue(foundVenue);
        const reviews = getReviews(foundVenue.id);
        const summary = getAISummary(foundVenue, reviews);
        setAiSummary(summary);
      }
    }
  }, [venueId]);

  if (!venue) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Venue not found</p>
      </div>
    );
  }

  const color = getActivityColor(venue.activityLevel);

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-start gap-4">
            <span className="text-4xl">{getCategoryIcon(venue.category)}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{venue.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{getCategoryLabel(venue.category)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Special Event Badge */}
        {venue.isSpecialEvent && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                {venue.specialEventDescription}
              </p>
            </div>
          </div>
        )}

        {/* AI Summary */}
        {aiSummary && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-gray-700 dark:text-gray-300 italic">"{aiSummary}"</p>
          </div>
        )}

        {/* Current Metrics */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Status</h2>
          
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {venue.capacity}% capacity
            </span>
          </div>

          {/* Service-based venues: Show wait time interval */}
          {(venue.category === 'restaurant' || venue.category === 'salon' || venue.category === 'coffee') && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Wait Time</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {venue.waitTimeInterval ? formatWaitTimeInterval(venue.waitTimeInterval) : 'No wait'}
              </p>
            </div>
          )}

          {/* Social venues: Show vibe and crowd */}
          {(venue.category === 'bar' || venue.category === 'club') && (
            <div className="space-y-3">
              {venue.vibe !== undefined && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vibe</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{venue.vibe}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-purple-500 h-3 rounded-full transition-all"
                      style={{ width: `${venue.vibe * 10}%` }}
                    />
                  </div>
                </div>
              )}
              {venue.crowd !== undefined && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Crowd</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{venue.crowd}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all"
                      style={{ width: `${venue.crowd * 10}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Venue Details */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
          
          {venue.description && (
            <p className="text-gray-700 dark:text-gray-300 mb-4">{venue.description}</p>
          )}

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Address</p>
              <p className="text-gray-900 dark:text-white">{venue.address}</p>
            </div>

            {venue.phone && (
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                <a href={`tel:${venue.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {venue.phone}
                </a>
              </div>
            )}

            {venue.website && (
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Website</p>
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {venue.website}
                </a>
              </div>
            )}

            {venue.openingHours && (
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Opening Hours</p>
                <div className="space-y-1 text-sm">
                  {venue.openingHours.monday && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Monday</span>
                      <span className="text-gray-900 dark:text-white">{venue.openingHours.monday}</span>
                    </div>
                  )}
                  {venue.openingHours.tuesday && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tuesday</span>
                      <span className="text-gray-900 dark:text-white">{venue.openingHours.tuesday}</span>
                    </div>
                  )}
                  {venue.openingHours.wednesday && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Wednesday</span>
                      <span className="text-gray-900 dark:text-white">{venue.openingHours.wednesday}</span>
                    </div>
                  )}
                  {venue.openingHours.thursday && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Thursday</span>
                      <span className="text-gray-900 dark:text-white">{venue.openingHours.thursday}</span>
                    </div>
                  )}
                  {venue.openingHours.friday && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Friday</span>
                      <span className="text-gray-900 dark:text-white">{venue.openingHours.friday}</span>
                    </div>
                  )}
                  {venue.openingHours.saturday && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                      <span className="text-gray-900 dark:text-white">{venue.openingHours.saturday}</span>
                    </div>
                  )}
                  {venue.openingHours.sunday && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                      <span className="text-gray-900 dark:text-white">{venue.openingHours.sunday}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Comments */}
        {venue.liveComments && venue.liveComments.length > 0 && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Comments</h2>
            <div className="space-y-3">
              {venue.liveComments.map((comment) => {
                const repColor = getReputationColor(comment.reputation);
                const repBgColor = getReputationBgColor(comment.reputation);
                return (
                  <div
                    key={comment.id}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: repBgColor }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: repColor }}
                      >
                        {comment.userName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.comment}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Add Review
          </button>
          <button
            onClick={() => setShowReviewsList(true)}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Show Reviews
          </button>
          <button
            onClick={handleGetDirections}
            className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Get Directions
          </button>
        </div>
      </div>

      {/* Modals */}
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
    </div>
  );
};

export default VenueDetailsScreen;

