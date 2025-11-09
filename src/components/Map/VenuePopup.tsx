import React, { useState, useEffect, useCallback } from 'react';
import { Venue, VenueImage } from '../../types';
import { getCategoryLabel, getCategoryIcon, formatWaitTime, formatWaitTimeInterval, getActivityColor } from '../../utils/venueUtils';
import { getAISummary, getReviews } from '../../services/reviews';
import { getReputationColor, getReputationBgColor, formatTimeAgo } from '../../utils/reputationUtils';
import { useAuth } from '../../context/AuthContext';
import ReviewModal from '../Reviews/ReviewModal';
import ReviewsList from '../Reviews/ReviewsList';

interface VenuePopupProps {
  venue: Venue;
  onViewDetails?: () => void;
}

interface ImageModalProps {
  image: VenueImage | string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, isOpen, onClose }) => {
  if (!isOpen) return null;

  const imageUrl = typeof image === 'string' ? image : image.url;
  const caption = typeof image === 'string' ? undefined : image.caption;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={imageUrl}
          alt={caption || 'Venue'}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
        {caption && (
          <div className="mt-4 text-center text-white">
            <p className="text-sm">{caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const VenuePopup: React.FC<VenuePopupProps> = ({ venue, onViewDetails }) => {
  const { user } = useAuth();
  const [aiSummary, setAiSummary] = useState<string>('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewsList, setShowReviewsList] = useState(false);
  const [expandedImage, setExpandedImage] = useState<VenueImage | string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [liveComments, setLiveComments] = useState(venue?.liveComments || []);
  const [newCommentIds, setNewCommentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const reviews = getReviews(venue.id);
    const summary = getAISummary(venue, reviews);
    setAiSummary(summary);
    
    // Initialize with existing comments, sorted by timestamp (newest first)
    const sortedComments = [...(venue.liveComments || [])].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
    setLiveComments(sortedComments);
    
    // Mark existing comments as not new
    setNewCommentIds(new Set());
  }, [venue]);

  // Helper function to add a new comment
  const addNewComment = useCallback(() => {
    // Pool of potential comments for real-time simulation
    const potentialComments = [
      { comment: 'Just arrived! The atmosphere is electric!', trustability: 88, reputation: 4.4 },
      { comment: 'DJ just dropped a banger! 🔥', trustability: 92, reputation: 4.6 },
      { comment: 'Line is getting longer but worth the wait', trustability: 75, reputation: 3.8 },
      { comment: 'Best night out in a while!', trustability: 80, reputation: 4.0 },
      { comment: 'Crowd is amazing tonight', trustability: 85, reputation: 4.3 },
      { comment: 'Drinks are flowing, energy is high!', trustability: 90, reputation: 4.5 },
      { comment: 'Just saw someone famous walk in!', trustability: 95, reputation: 4.8 },
      { comment: 'Music is on point tonight', trustability: 82, reputation: 4.1 },
      { comment: 'Place is packed but still fun', trustability: 70, reputation: 3.5 },
      { comment: 'Vibe check: 10/10 would recommend', trustability: 88, reputation: 4.4 },
    ];

    const generateRandomFirstName = () => {
      const firstNames = [
        'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
        'Sam', 'Dakota', 'Cameron', 'Blake', 'Jamie', 'Drew', 'Logan', 'Noah',
        'Emma', 'Olivia', 'Sophia', 'Isabella', 'Ava', 'Mia', 'Charlotte', 'Amelia',
        'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Ella', 'Avery',
        'Sofia', 'Camila', 'Aria', 'Scarlett', 'Victoria', 'Madison', 'Luna', 'Grace',
        'Chloe', 'Penelope', 'Layla', 'Riley', 'Zoey', 'Nora', 'Lily', 'Eleanor',
        'Hannah', 'Lillian', 'Addison', 'Aubrey', 'Ellie', 'Stella', 'Natalie', 'Zoe',
        'Leah', 'Hazel', 'Violet', 'Aurora', 'Savannah', 'Audrey', 'Brooklyn', 'Bella',
        'Claire', 'Skylar', 'Lucy', 'Paisley', 'Everly', 'Anna', 'Caroline', 'Nova',
        'Genesis', 'Aaliyah', 'Kennedy', 'Kinsley', 'Allison', 'Maya', 'Sarah', 'Madelyn',
        'Adeline', 'Alexa', 'Ariana', 'Elena', 'Arianna', 'Lydia', 'Clara', 'Hadley',
        'Gabriella', 'Josephine', 'Piper', 'Isla', 'Annabelle', 'Eliana', 'Willow', 'Naomi',
        'Emilia', 'Liliana', 'Natalia', 'Delilah', 'Valentina', 'Alyssa', 'Gianna', 'Elise',
        'Lyla', 'Arielle', 'Melanie', 'Julia', 'Katherine', 'Mya', 'Ivy', 'Khloe',
        'Lillian', 'Liliana', 'Aubree', 'Adalynn', 'Kylie', 'Brielle', 'Adalyn', 'Eva',
        'Paisley', 'Athena', 'Natalia', 'Elena', 'Molly', 'Emilia', 'Isabelle', 'Lyla',
        'Arianna', 'Leilani', 'Melanie', 'Mya', 'Quinn', 'Willow', 'Natalie', 'Ariana',
        'James', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher',
        'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul',
        'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald',
        'Jason', 'Edward', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric',
        'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel',
        'Gregory', 'Alexander', 'Patrick', 'Frank', 'Raymond', 'Jack', 'Dennis', 'Jerry',
        'Tyler', 'Aaron', 'Jose', 'Adam', 'Nathan', 'Henry', 'Douglas', 'Zachary',
        'Peter', 'Kyle', 'Noah', 'Ethan', 'Jeremy', 'Walter', 'Christian', 'Keith',
        'Roger', 'Terry', 'Austin', 'Sean', 'Gerald', 'Carl', 'Harold', 'Dylan',
        'Jesse', 'Jordan', 'Bryan', 'Billy', 'Bruce', 'Gabriel', 'Joe', 'Logan',
        'Alan', 'Juan', 'Lawrence', 'Wayne', 'Roy', 'Ralph', 'Randy', 'Eugene',
        'Vincent', 'Russell', 'Louis', 'Philip', 'Bobby', 'Johnny', 'Willie', 'Ethan',
        'Marcus', 'Lucas', 'Mason', 'Jackson', 'Aiden', 'Oliver', 'Carter', 'Sebastian',
        'Mateo', 'Jack', 'Levi', 'Grayson', 'Asher', 'Leo', 'Wyatt', 'Julian',
        'Hudson', 'Lincoln', 'Ezra', 'Owen', 'Maverick', 'Luke', 'Caleb', 'Isaac',
        'Josiah', 'Andrew', 'Thomas', 'Joshua', 'Ezekiel', 'Charles', 'Christopher', 'Jaxon',
        'Maverick', 'Carter', 'Theodore', 'Jayden', 'Dominic', 'Luca', 'Parker', 'Landon',
        'Cooper', 'Kayden', 'Miles', 'Adrian', 'Santiago', 'Colton', 'Brantley', 'Declan',
        'Bentley', 'Axel', 'Micah', 'Giovanni', 'Diego', 'Brody', 'Nathaniel', 'Ryder',
        'Theo', 'Bennett', 'George', 'Maxwell', 'Ivan', 'Maddox', 'Justin', 'Kevin',
        'Preston', 'Brandon', 'Tristan', 'Gael', 'Sawyer', 'Jax', 'Roman', 'Ryker',
        'Leonardo', 'Greyson', 'Jose', 'Bennett', 'Everett', 'Waylon', 'Weston', 'Easton',
        'Axel', 'Silas', 'Wesley', 'Sawyer', 'Harrison', 'Zachary', 'Ashton', 'Beau',
        'Ryder', 'Grayson', 'Easton', 'Jax', 'Cooper', 'Lincoln', 'Landon', 'Roman',
        'Axel', 'Silas', 'Wesley', 'Sawyer', 'Harrison', 'Zachary', 'Ashton', 'Beau',
        'Ryder', 'Grayson', 'Easton', 'Jax', 'Cooper', 'Lincoln', 'Landon', 'Roman',
      ];
      return firstNames[Math.floor(Math.random() * firstNames.length)];
    };

    const randomComment = potentialComments[Math.floor(Math.random() * potentialComments.length)];
    const newComment = {
      id: `comment_realtime_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId: `user_${Math.random().toString(36).substring(2, 9)}`,
      userName: generateRandomFirstName(),
      comment: randomComment.comment,
      timestamp: new Date(),
      trustability: randomComment.trustability,
      reputation: randomComment.reputation,
    };

    setLiveComments((prev) => {
      // Add new comment at the top, keep max 15 comments
      const updated = [newComment, ...prev].slice(0, 15);
      return updated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });

    // Mark as new for animation
    setNewCommentIds((prev) => {
      const updated = new Set(prev);
      updated.add(newComment.id);
      // Remove from new set after animation completes
      setTimeout(() => {
        setNewCommentIds((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.delete(newComment.id);
          return newSet;
        });
      }, 2000);
      return updated;
    });
  }, []);

  // Trigger first comment 2 seconds after venue opens
  useEffect(() => {
    if (!venue) return;

    const firstCommentTimer = setTimeout(() => {
      addNewComment();
    }, 2000); // 2 seconds after opening

    return () => clearTimeout(firstCommentTimer);
  }, [venue]);

  // Simulate real-time comment updates (subsequent comments)
  useEffect(() => {
    if (!venue) return;

    const interval = setInterval(() => {
      // Randomly decide if a new comment should appear (30% chance)
      if (Math.random() < 0.3) {
        addNewComment();
      }
    }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds

    return () => clearInterval(interval);
  }, [venue]);

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`;
    window.open(url, '_blank');
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;

    // Use the user's actual name (first name only if it contains a space)
    const firstName = user.name.split(' ')[0];

    const comment = {
      id: `comment_${Date.now()}`,
      userId: user.id,
      userName: firstName,
      comment: newComment.trim(),
      timestamp: new Date(),
      trustability: user.trustability,
      reputation: user.reputation,
    };

    // Add comment at the top of the list
    setLiveComments((prev) => {
      const updated = [comment, ...prev].slice(0, 15);
      return updated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });

    // Mark as new for animation
    setNewCommentIds((prev) => {
      const updated = new Set(prev);
      updated.add(comment.id);
      // Remove from new set after animation completes
      setTimeout(() => {
        setNewCommentIds((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.delete(comment.id);
          return newSet;
        });
      }, 2000);
      return updated;
    });

    setNewComment('');
  };

  const color = getActivityColor(venue.activityLevel);

  return (
    <>
      <div className="p-1.5 min-w-[320px] max-w-[400px] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-1.5 mb-1 flex-shrink-0">
          <span className="text-lg">{getCategoryIcon(venue.category)}</span>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white text-xs whitespace-nowrap truncate">{venue.name}</h3>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">{getCategoryLabel(venue.category)}</p>
                {/* Metrics - each on separate line */}
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {/* Capacity */}
                  <div className="flex items-center gap-0.5">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[9px] font-medium text-gray-700 dark:text-gray-300">
                      Capacity: {venue.capacity}%
                    </span>
                  </div>
                  {/* Vibe (for social venues) */}
                  {venue.vibe !== undefined && (
                    <div className="flex items-center gap-0.5">
                      <span className="text-[9px] font-medium text-gray-700 dark:text-gray-300">Vibe: {venue.vibe}/10</span>
                    </div>
                  )}
                  {/* Crowd (for social venues) */}
                  {venue.crowd !== undefined && (
                    <div className="flex items-center gap-0.5">
                      <span className="text-[9px] font-medium text-gray-700 dark:text-gray-300">Crowd: {venue.crowd}/10</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Fiery animation logo for high vibe */}
              {venue.vibe !== undefined && venue.vibe >= 8 && (
                <span className="text-2xl fire-animation flex-shrink-0">🔥</span>
              )}
            </div>
          </div>
        </div>

        {/* Two Scrollable Sections */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 gap-1">
          {/* Top Section: Details - Scrollable */}
          <div className="flex-[1.5] overflow-y-auto min-h-0 pr-1">
            {/* Special Event Badge */}
            {venue.isSpecialEvent && (
              <div className="mb-1 p-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
                <div className="flex items-center gap-1">
                  <span className="text-xs">⭐</span>
                  <p className="text-[10px] font-semibold text-yellow-800 dark:text-yellow-200">
                    {venue.specialEventDescription}
                  </p>
                </div>
              </div>
            )}

            {/* AI Summary */}
            {aiSummary && (
              <div className="mb-1">
                <p className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Live GenAI Summary</p>
                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-[10px] text-gray-700 dark:text-gray-300 italic">
                    "{aiSummary}"
                  </p>
                </div>
              </div>
            )}
            
            {/* Service-based venues: Show wait time interval */}
            {(venue.category === 'restaurant' || venue.category === 'salon' || venue.category === 'coffee') && (
              <div className="mb-1">
                <p className="text-[10px] text-gray-600 dark:text-gray-400">
                  Wait time: {venue.waitTimeInterval ? formatWaitTimeInterval(venue.waitTimeInterval) : formatWaitTime(venue.waitTime)}
                </p>
              </div>
            )}

            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">{venue.address}</p>

            {/* User Uploaded Images */}
            {venue.userImages && venue.userImages.length > 0 && (
              <div className="mb-1">
                <p className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Photos</p>
                <div className="grid grid-cols-3 gap-0.5">
                  {venue.userImages.slice(0, 6).map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setExpandedImage(image)}
                      className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={image.url}
                        alt={image.caption || 'Venue'}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section: Live Comments - Scrollable */}
          <div className="flex-[0.8] overflow-y-auto min-h-0 border-t border-gray-200 dark:border-gray-700 pt-1">
            <p className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Live Comments</p>
            
            {/* Comments List */}
            <div className="space-y-0.5 mb-0.5">
              {liveComments.length > 0 ? (
                liveComments.map((comment) => {
                  const repColor = getReputationColor(comment.reputation);
                  const repBgColor = getReputationBgColor(comment.reputation);
                  const isNew = newCommentIds.has(comment.id);
                  return (
                    <div
                      key={comment.id}
                      className={`p-1 rounded-lg border border-gray-200 dark:border-gray-700 text-[10px] transition-all duration-500 ${
                        isNew ? 'animate-slide-in bg-blue-50 dark:bg-blue-900/30' : ''
                      }`}
                      style={{ backgroundColor: isNew ? undefined : repBgColor }}
                    >
                      <div className="flex items-center gap-1 mb-0.5 flex-wrap">
                        <span
                          className="px-0.5 py-0 rounded text-[9px] font-medium text-white"
                          style={{ backgroundColor: repColor }}
                        >
                          {comment.userName}
                        </span>
                        <span className="text-[9px] text-gray-600 dark:text-gray-400">|</span>
                        <span className="text-[9px] text-gray-600 dark:text-gray-400">
                          Trust: {comment.reputation.toFixed(1)} 🤝
                        </span>
                        <span className="text-[9px] text-gray-600 dark:text-gray-400">|</span>
                        <span className="text-[9px] text-gray-600 dark:text-gray-400">
                          Exp: {comment.trustability >= 1000 ? `${(comment.trustability / 1000).toFixed(1)}k` : comment.trustability} ♠️
                        </span>
                        <span className="text-[9px] text-gray-500 dark:text-gray-400 ml-auto">
                          {formatTimeAgo(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-700 dark:text-gray-300">{comment.comment}</p>
                      {/* Comment Images */}
                      {comment.images && comment.images.length > 0 && (
                        <div className="flex gap-1 mt-0.5">
                          {comment.images.map((imgUrl, idx) => (
                            <button
                              key={idx}
                              onClick={() => setExpandedImage(imgUrl)}
                              className="w-12 h-12 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={imgUrl}
                                alt={`Comment ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                  No comments yet
                </p>
              )}
            </div>

          </div>
        </div>

        {/* WhatsApp-style Comment Input - Fixed at bottom */}
        {user && (
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 pt-1 mt-1">
            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 px-2 py-1">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add comment"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 px-2 py-1 text-[10px] bg-transparent text-gray-900 dark:text-white focus:outline-none"
              />
              <button
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                title="Add image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                title="Voice message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
          </div>
        )}
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

      {/* Image Expansion Modal */}
      {expandedImage && (
        <ImageModal
          image={expandedImage}
          isOpen={!!expandedImage}
          onClose={() => setExpandedImage(null)}
        />
      )}
    </>
  );
};

export default VenuePopup;

