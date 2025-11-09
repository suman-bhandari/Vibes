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

    setLiveComments([comment, ...liveComments]);
    setNewComment('');
  };

  const color = getActivityColor(venue.activityLevel);

  return (
    <>
      <div className="p-2 min-w-[320px] max-w-[400px] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-2 mb-2 flex-shrink-0 relative">
          <span className="text-xl">{getCategoryIcon(venue.category)}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{venue.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">{getCategoryLabel(venue.category)}</p>
          </div>
          {/* Fiery animation logo for high vibe */}
          {venue.vibe !== undefined && venue.vibe >= 8 && (
            <div className="absolute top-0 right-0">
              <span className="text-2xl fire-animation">🔥</span>
            </div>
          )}
        </div>

        {/* Two Scrollable Sections */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 gap-2">
          {/* Top Section: Details - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0 pr-1">
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
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Live GenAI Summary</p>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-gray-700 dark:text-gray-300 italic">
                    "{aiSummary}"
                  </p>
                </div>
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

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{venue.address}</p>

            {/* User Uploaded Images */}
            {venue.userImages && venue.userImages.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Photos</p>
                <div className="grid grid-cols-3 gap-1">
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
          <div className="flex-1 overflow-y-auto min-h-0 border-t border-gray-200 dark:border-gray-700 pt-2">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Live Comments</p>
            
            {/* Comments List */}
            <div className="space-y-2 mb-2">
              {liveComments.length > 0 ? (
                liveComments.map((comment) => {
                  const repColor = getReputationColor(comment.reputation);
                  const repBgColor = getReputationBgColor(comment.reputation);
                  const isNew = newCommentIds.has(comment.id);
                  return (
                    <div
                      key={comment.id}
                      className={`p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs transition-all duration-500 ${
                        isNew ? 'animate-slide-in bg-blue-50 dark:bg-blue-900/30' : ''
                      }`}
                      style={{ backgroundColor: isNew ? undefined : repBgColor }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                          style={{ backgroundColor: repColor }}
                        >
                          {comment.userName}
                        </span>
                        <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
                          {comment.reputation.toFixed(1)}/5
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">{comment.comment}</p>
                      {/* Comment Images */}
                      {comment.images && comment.images.length > 0 && (
                        <div className="flex gap-1 mt-1">
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

            {/* Add Comment Section */}
            {user && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex gap-1">
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
                    placeholder="Add a comment..."
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 space-y-1">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="w-full px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors"
            >
              View Details
            </button>
          )}
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

