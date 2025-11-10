import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Venue, VenueImage } from '../../types';
import { getCategoryLabel, getCategoryIcon, formatWaitTime, formatWaitTimeInterval, getActivityColor } from '../../utils/venueUtils';
import { getAISummary, getReviews } from '../../services/reviews';
import { getReputationColor, getReputationBgColor, formatTimeAgo, generateExp } from '../../utils/reputationUtils';
import { useAuth } from '../../context/AuthContext';
import ReviewModal from '../Reviews/ReviewModal';
import ReviewsList from '../Reviews/ReviewsList';
import StackedImageGallery from './StackedImageGallery';

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
  const [vibeRating, setVibeRating] = useState<number>(0); // For entertainment venues (0-5 scale)
  const [waitTimeMin, setWaitTimeMin] = useState<number>(10); // For service venues
  const [waitTimeMax, setWaitTimeMax] = useState<number>(15); // For service venues
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [expandedCommentImage, setExpandedCommentImage] = useState<string | null>(null);
  const [venueUserImages, setVenueUserImages] = useState<VenueImage[]>(venue?.userImages || []);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const reviews = getReviews(venue.id);
    const summary = getAISummary(venue, reviews);
    setAiSummary(summary);
    
    // Initialize with existing comments, sorted by timestamp (newest first)
    const sortedComments = [...(venue.liveComments || [])].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
    setLiveComments(sortedComments);
    
    // Initialize venue user images
    setVenueUserImages(venue?.userImages || []);
    
    // Mark existing comments as not new
    setNewCommentIds(new Set());
    
    // Clear any error messages when venue changes
    setErrorMessage(null);
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
    // Generate EXP using max(500, normal(2000, 1000))
    const exp = generateExp();
    const newComment = {
      id: `comment_realtime_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId: `user_${Math.random().toString(36).substring(2, 9)}`,
      userName: generateRandomFirstName(),
      comment: randomComment.comment,
      timestamp: new Date(),
      trustability: randomComment.trustability,
      reputation: randomComment.reputation,
      karma: exp, // Use Gamma-distributed EXP
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

  // Trigger first comment 2 seconds after venue opens (skip for Floyd's Barbershop, Smuggler's Cove, and Bourbon & Branch)
  useEffect(() => {
    if (!venue || venue.id === '31' || venue.id === '4' || venue.id === '33') return; // Skip auto-comments for Floyd's Barbershop, Smuggler's Cove, and Bourbon & Branch

    const firstCommentTimer = setTimeout(() => {
      addNewComment();
    }, 2000); // 2 seconds after opening

    return () => clearTimeout(firstCommentTimer);
  }, [venue, addNewComment]);

  // Simulate real-time comment updates (subsequent comments) - skip for Floyd's Barbershop, Smuggler's Cove, and Bourbon & Branch
  useEffect(() => {
    if (!venue || venue.id === '31' || venue.id === '4' || venue.id === '33') return; // Skip auto-comments for Floyd's Barbershop, Smuggler's Cove, and Bourbon & Branch

    const interval = setInterval(() => {
      // Randomly decide if a new comment should appear (30% chance)
      if (Math.random() < 0.3) {
        addNewComment();
      }
    }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds

    return () => clearInterval(interval);
  }, [venue, addNewComment]);

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`;
    window.open(url, '_blank');
  };

  // Check if venue is entertainment-based (bar, club)
  const isEntertainmentVenue = venue.category === 'bar' || venue.category === 'club';
  // Check if venue is service-based (restaurant, salon, coffee)
  const isServiceVenue = venue.category === 'restaurant' || venue.category === 'salon' || venue.category === 'coffee';

  // Calculate aggregated vibe from live comments (0-5 scale)
  const aggregatedVibe = useMemo(() => {
    if (!isEntertainmentVenue) return undefined;
    
    // If venue has a direct vibe property set, use that (prioritize over comments)
    if (venue.vibe !== undefined) {
      return venue.vibe > 5 ? (venue.vibe - 1) / 2 : venue.vibe;
    }
    
    // If no comments, return undefined
    if (!liveComments || liveComments.length === 0) {
      return undefined;
    }
    
    // Calculate from live comments
    const commentsWithVibe = liveComments.filter(c => c.vibe !== undefined);
    if (commentsWithVibe.length === 0) {
      return undefined;
    }
    
    // Convert old 1-10 scale to 0-5 scale if needed, then calculate average
    const sum = commentsWithVibe.reduce((acc, c) => {
      const vibe = c.vibe || 0;
      // If vibe is > 5, it's old scale (1-10), convert to 0-5
      const normalizedVibe = vibe > 5 ? (vibe - 1) / 2 : vibe;
      return acc + normalizedVibe;
    }, 0);
    const avg = sum / commentsWithVibe.length;
    return avg; // Return actual average (not rounded)
  }, [liveComments, isEntertainmentVenue, venue.vibe, venue]);

  // Get rounded vibe for display (nearest 0.5)
  const roundedVibe = useMemo(() => {
    if (aggregatedVibe === undefined) return undefined;
    return Math.round(aggregatedVibe * 2) / 2;
  }, [aggregatedVibe]);

  // Helper function to render sparkle symbols for vibe (0-5 scale)
  const renderVibeSparkles = (vibe: number) => {
    const roundedVibe = Math.round(vibe * 2) / 2; // Round to nearest 0.5
    const fullSparkles = Math.floor(roundedVibe);
    const hasHalfSparkle = roundedVibe % 1 === 0.5;
    
    return (
      <span className="flex items-center gap-0.5">
        {Array.from({ length: fullSparkles }).map((_, i) => (
          <span key={i} className="text-xs sparkle-orange">🔥</span>
        ))}
        {hasHalfSparkle && <span className="text-xs opacity-50 sparkle-orange">🔥</span>}
        {Array.from({ length: 5 - fullSparkles - (hasHalfSparkle ? 1 : 0) }).map((_, i) => (
          <span key={`empty-${i}`} className="text-xs opacity-20 sparkle-orange">🔥</span>
        ))}
      </span>
    );
  };

  const handleAddComment = () => {
    if ((!newComment.trim() && selectedImages.length === 0) || !user) return;
    
    // Check if user is trying to comment on Smuggler's Cove
    if (venue.id === '4') {
      setErrorMessage('Comment cannot be posted because you are not in the venue.');
      // Auto-dismiss error after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }
    
    // Clear any previous error
    setErrorMessage(null);
    
    // Validate required fields based on venue type
    if (isEntertainmentVenue && vibeRating === 0) {
      alert('Please select a vibe rating (1-5)');
      return;
    }
    if (isEntertainmentVenue && (vibeRating < 0 || vibeRating > 5)) {
      alert('Please provide a vibe rating between 1-5');
      return;
    }
    if (isServiceVenue && (waitTimeMin < 0 || waitTimeMax < waitTimeMin)) {
      alert('Please provide a valid wait time range');
      return;
    }

    // Use the user's actual name (first name only if it contains a space)
    const firstName = user.name.split(' ')[0];

    const comment: any = {
      id: `comment_${Date.now()}`,
      userId: user.id,
      userName: firstName,
      comment: newComment.trim(),
      timestamp: new Date(),
      trustability: user.trustability,
      reputation: user.reputation,
      karma: user.karma || 0, // Include user's karma/experience
    };

    // Add vibe for entertainment venues
    if (isEntertainmentVenue) {
      comment.vibe = vibeRating;
    }
    
    // Add wait time range for service venues
    if (isServiceVenue) {
      comment.waitTimeRange = [waitTimeMin, waitTimeMax];
    }

    // Add images if any
    if (selectedImages.length > 0) {
      comment.images = selectedImages;
      
      // Also add images to venue's userImages for Recent Photos section
      const newVenueImages: VenueImage[] = selectedImages.map((imgUrl, idx) => ({
        id: `img_${Date.now()}_${idx}`,
        url: imgUrl,
        uploadedBy: user.id,
        uploadedAt: new Date(),
        caption: newComment.trim() || undefined,
      }));
      
      setVenueUserImages((prev) => {
        // Add new images at the beginning (newest first) and limit to reasonable number
        const updated = [...newVenueImages, ...prev].slice(0, 20);
        return updated;
      });
    }

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
    // Reset inputs
    setVibeRating(0);
    setWaitTimeMin(10);
    setWaitTimeMax(15);
    setSelectedImages([]);
  };

  // Calculate crowd range from live comments (if available) or use venue's crowdRange
  const displayCrowdRange = useMemo(() => {
    if (venue.crowdRange) return venue.crowdRange;
    // If no crowdRange set, calculate from comments or use default
    // For now, use a default range based on venue capacity
    const estimatedCrowd = Math.round((venue.capacity / 100) * 50); // Rough estimate
    return [Math.max(0, estimatedCrowd - 5), estimatedCrowd + 5];
  }, [venue.crowdRange, venue.capacity]);

  // Calculate max crowd for display scale - adjust based on venue
  const maxCrowdForDisplay = useMemo(() => {
    // For small venues like barbershops (2-3 people), use a smaller max scale (e.g., 10) for better visualization
    if (venue.crowdRange && venue.crowdRange[1] <= 5) {
      return 10; // Smaller scale for small venues
    }
    return 100; // Default scale for larger venues
  }, [venue.crowdRange]);

  // Calculate wait time range for service venues from live comments
  const displayWaitTimeRange = useMemo(() => {
    if (!isServiceVenue) return venue.waitTimeInterval;
    const commentsWithWaitTime = liveComments.filter(c => c.waitTimeRange);
    if (commentsWithWaitTime.length === 0) return venue.waitTimeInterval;
    
    // Aggregate wait time ranges from comments
    const allMins = commentsWithWaitTime.map(c => c.waitTimeRange![0]);
    const allMaxs = commentsWithWaitTime.map(c => c.waitTimeRange![1]);
    const avgMin = Math.round(allMins.reduce((a, b) => a + b, 0) / allMins.length);
    const avgMax = Math.round(allMaxs.reduce((a, b) => a + b, 0) / allMaxs.length);
    return [avgMin, avgMax];
  }, [liveComments, isServiceVenue, venue.waitTimeInterval]);

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
                
                {/* Metrics in horizontal layout - for entertainment venues */}
                {isEntertainmentVenue && (
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    {/* Vibe Rating (sparkle symbols) */}
                    {aggregatedVibe !== undefined && roundedVibe !== undefined && (
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] text-gray-600 dark:text-gray-400">Vibe:</span>
                        {renderVibeSparkles(roundedVibe)}
                        <span className="text-[9px] font-medium text-gray-700 dark:text-gray-300">
                          {aggregatedVibe.toFixed(1)}/5
                        </span>
                      </div>
                    )}
                    
                    {/* Crowd Range Display */}
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-gray-600 dark:text-gray-400">Crowd:</span>
                      <span className="text-[9px] font-medium text-gray-700 dark:text-gray-300">
                        {displayCrowdRange[0]} - {displayCrowdRange[1]} people
                      </span>
                    </div>
                  </div>
                )}

                {/* Wait Time Range - for service venues only (no crowd) */}
                {isServiceVenue && (
                  <div className="mt-1">
                    <p className="text-[9px] text-gray-600 dark:text-gray-400 mb-0.5">Wait Time</p>
                    <div className="relative h-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden">
                      {/* Blue highlighted interval - use 60 minutes as max scale */}
                      <div
                        className="absolute h-full bg-blue-600 rounded-full"
                        style={{
                          left: `${Math.min(95, (displayWaitTimeRange[0] / 60) * 100)}%`,
                          width: `${Math.min(100 - (displayWaitTimeRange[0] / 60) * 100, ((displayWaitTimeRange[1] - displayWaitTimeRange[0]) / 60) * 100)}%`
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[8px] font-medium text-gray-700 dark:text-gray-300 z-10">
                          {displayWaitTimeRange[0]} - {displayWaitTimeRange[1]} min
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two Scrollable Sections */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 gap-1">
          {/* Top Section: Details - No scroll, squeezed */}
          <div className="flex-[1.5] overflow-hidden min-h-0 pr-1">
            <div className="space-y-0.5">
              {/* Special Event Badge */}
              {venue.isSpecialEvent && (
                <div className="p-0.5 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-300 dark:border-yellow-700">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px]">⭐</span>
                    <p className="text-[9px] font-semibold text-yellow-800 dark:text-yellow-200">
                      {venue.specialEventDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* AI Summary */}
              {aiSummary && (
                <div>
                  <p className="text-[9px] font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Live GenAI Summary</p>
                  <div className="p-0.5 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-[9px] text-gray-700 dark:text-gray-300 italic leading-tight">
                      "{aiSummary}"
                    </p>
                  </div>
                </div>
              )}

              <p className="text-[9px] text-gray-500 dark:text-gray-400">{venue.address}</p>
            </div>
          </div>

          {/* Bottom Section: Live Comments - Scrollable */}
          <div className="h-48 overflow-y-auto border-t border-gray-200 dark:border-gray-700 pt-1 flex-shrink-0">
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
                          <span className="font-bold text-blue-600 dark:text-blue-400">EXP</span>: {(() => {
                            const exp = comment.karma !== undefined ? comment.karma : comment.trustability;
                            return exp >= 1000 ? `${(exp / 1000).toFixed(1)}k` : exp;
                          })()}
                        </span>
                        <span className="text-[9px] text-gray-500 dark:text-gray-400 ml-auto">
                          {formatTimeAgo(comment.timestamp)}
                        </span>
                      </div>
                      {comment.comment && (
                        <p className="text-[10px] text-gray-700 dark:text-gray-300">{comment.comment}</p>
                      )}
                      {/* Comment Images */}
                      {comment.images && comment.images.length > 0 && (
                        <div className="flex gap-1 mt-0.5 flex-wrap">
                          {comment.images.map((imgUrl, idx) => (
                            <button
                              key={idx}
                              onClick={() => setExpandedCommentImage(imgUrl)}
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

        {/* Recent Photos - Below Live Comments, Above Input */}
        {venueUserImages && venueUserImages.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 pt-2 pb-1">
            <StackedImageGallery
              images={venueUserImages}
              onImageClick={(image) => setExpandedImage(image)}
            />
          </div>
        )}

        {/* WhatsApp-style Comment Input - Fixed at bottom */}
            {user && (
              <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 pt-1 mt-1 space-y-1">
                {/* Vibe input for entertainment venues - clickable sparkle symbols */}
                {isEntertainmentVenue && (
                  <div className="flex items-center gap-2 px-2">
                    <label className="text-[9px] text-gray-600 dark:text-gray-400 whitespace-nowrap">Vibe:</label>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const rating = i + 1; // 1, 2, 3, 4, 5 (5 sparkles representing 1-5, 0 is unselected)
                        const isSelected = vibeRating >= rating;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              // Clicking sparkle N sets rating to N (1-5)
                              // If clicking the same sparkle again, set to 0
                              setVibeRating(vibeRating === rating ? 0 : rating);
                            }}
                            className={`text-sm transition-all sparkle-orange ${
                              isSelected ? 'opacity-100' : 'opacity-20'
                            } hover:opacity-60`}
                            title={`${rating}/5`}
                          >
                            🔥
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Wait time range input for service venues */}
                {isServiceVenue && (
                  <div className="flex items-center gap-2 px-2">
                    <label className="text-[9px] text-gray-600 dark:text-gray-400 whitespace-nowrap">Wait (min):</label>
                    <input
                      type="number"
                      min="0"
                      value={waitTimeMin}
                      onChange={(e) => setWaitTimeMin(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-16 px-1.5 py-0.5 text-[10px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-[9px] text-gray-600 dark:text-gray-400">-</span>
                    <input
                      type="number"
                      min={waitTimeMin}
                      value={waitTimeMax}
                      onChange={(e) => setWaitTimeMax(Math.max(waitTimeMin, parseInt(e.target.value) || waitTimeMin))}
                      className="w-16 px-1.5 py-0.5 text-[10px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-[9px] text-gray-600 dark:text-gray-400">min</span>
                  </div>
                )}
                
                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="flex gap-1 px-2 flex-wrap">
                    {selectedImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={imgUrl}
                          alt={`Preview ${idx + 1}`}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <button
                          onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-600"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Error Message */}
                {errorMessage && (
                  <div className="px-2 mb-1">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-[10px] text-red-600 dark:text-red-400">{errorMessage}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 px-2 py-1">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() && selectedImages.length === 0}
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
                    onChange={(e) => {
                      setNewComment(e.target.value);
                      // Clear error when user starts typing
                      if (errorMessage) setErrorMessage(null);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 px-2 py-1 text-[10px] bg-transparent text-gray-900 dark:text-white focus:outline-none"
                  />
                  <label className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer" title="Add image (camera or gallery)">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              if (result) {
                                setSelectedImages((prev) => [...prev, result]);
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }
                        // Reset input to allow selecting the same file again
                        e.target.value = '';
                      }}
                    />
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </label>
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
      
      {/* Comment Image Modal */}
      {expandedCommentImage && (
        <ImageModal
          image={expandedCommentImage}
          isOpen={!!expandedCommentImage}
          onClose={() => setExpandedCommentImage(null)}
        />
      )}
    </>
  );
};

export default VenuePopup;

