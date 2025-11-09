import React, { useState } from 'react';
import { Venue } from '../../types';
import { mockVenues } from '../../data/mockVenues';

interface FeelingLuckyProps {
  onVenueSelect: (venue: Venue) => void;
}

const FeelingLucky: React.FC<FeelingLuckyProps> = ({ onVenueSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [vibeInput, setVibeInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [matchedVenue, setMatchedVenue] = useState<Venue | null>(null);

  const handleMatch = () => {
    if (!vibeInput.trim()) return;

    // Simple vibe matching algorithm
    const input = vibeInput.toLowerCase();
    let bestMatch: Venue | null = null;
    let bestScore = 0;

    mockVenues.forEach((venue) => {
      let score = 0;

      // Match based on keywords
      if (input.includes('quiet') || input.includes('relaxed') || input.includes('chill')) {
        if (venue.activityLevel === 'available' || venue.capacity < 40) score += 3;
        if (venue.category === 'coffee') score += 2;
      }
      if (input.includes('busy') || input.includes('lively') || input.includes('energetic')) {
        if (venue.activityLevel === 'very-busy' || venue.capacity > 70) score += 3;
        if (venue.category === 'bar' || venue.category === 'club') score += 2;
      }
      if (input.includes('food') || input.includes('eat') || input.includes('dinner')) {
        if (venue.category === 'restaurant') score += 4;
      }
      if (input.includes('drink') || input.includes('cocktail') || input.includes('bar')) {
        if (venue.category === 'bar' || venue.category === 'club') score += 4;
      }
      if (input.includes('coffee') || input.includes('cafe')) {
        if (venue.category === 'coffee') score += 4;
      }
      if (input.includes('vibe') || input.includes('atmosphere')) {
        if (venue.vibe && venue.vibe >= 7) score += 2;
      }
      if (input.includes('crowd') || input.includes('people')) {
        // Check if crowd range indicates a busy venue (average crowd >= 30 people)
        if (venue.crowdRange) {
          const avgCrowd = (venue.crowdRange[0] + venue.crowdRange[1]) / 2;
          if (avgCrowd >= 30) score += 2;
        }
      }
      if (input.includes('special') || input.includes('event')) {
        if (venue.isSpecialEvent) score += 5;
      }
      
      // Asian restaurant matching
      if ((input.includes('asian') || input.includes('japanese') || input.includes('sushi') || input.includes('ramen')) && venue.category === 'restaurant') {
        score += 6;
        // Boost for Hokkaido specifically
        if (venue.name.toLowerCase().includes('hokkaido')) score += 10;
      }
      
      // Music matching
      if (input.includes('music') || input.includes('sound') || input.includes('tunes')) {
        // Hokkaido has good music mentioned in description
        if (venue.description && (venue.description.toLowerCase().includes('music') || venue.name.toLowerCase().includes('hokkaido'))) {
          score += 5;
        }
        // Bars and clubs typically have music
        if (venue.category === 'bar' || venue.category === 'club') score += 3;
      }
      
      // "Open now" matching - check if current time is within opening hours
      if (input.includes('open now') || input.includes('open')) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
        
        if (venue.openingHours && venue.openingHours[currentDay as keyof typeof venue.openingHours]) {
          const hours = venue.openingHours[currentDay as keyof typeof venue.openingHours];
          if (hours) {
            // Simple check - if venue has opening hours, assume it's open during typical hours
            // Hokkaido is open 11 AM - 10 PM most days
            if (currentHour >= 11 && currentHour < 22) {
              score += 4;
            }
          }
        }
      }

      // Boost score for venues with good reviews
      if (venue.aiSummary && venue.aiSummary.includes('recommended')) score += 1;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = venue;
      }
    });

    // If no good match, pick a random popular venue
    if (!bestMatch || bestScore < 2) {
      const popularVenues = mockVenues.filter(
        (v) => v.capacity > 50 || v.isSpecialEvent || (v.vibe && v.vibe >= 7)
      );
      bestMatch = popularVenues[Math.floor(Math.random() * popularVenues.length)] || mockVenues[0];
    }

    setMatchedVenue(bestMatch);
  };

  const handleMicClick = () => {
    setIsListening(!isListening);
    // In a real app, this would use Web Speech API
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setVibeInput('I want a lively bar with good vibe');
        setIsListening(false);
      }, 2000);
    }
  };

  const handleSelectMatch = () => {
    if (matchedVenue) {
      onVenueSelect(matchedVenue);
      setIsOpen(false);
      setVibeInput('');
      setMatchedVenue(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
      >
        <span className="text-lg">🍀</span>
        <span className="hidden sm:block">I'm Feeling Lucky</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>🍀</span> I'm Feeling Lucky
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Describe the vibe you're looking for, and we'll find the perfect spot!
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={vibeInput}
                onChange={(e) => setVibeInput(e.target.value)}
                placeholder="e.g., 'lively bar with good vibe' or 'quiet coffee shop'"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && handleMatch()}
              />
              <button
                onClick={handleMicClick}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                🎤
              </button>
            </div>

            <button
              onClick={handleMatch}
              disabled={!vibeInput.trim()}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              Find My Match
            </button>

            {matchedVenue && (
              <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{matchedVenue.category === 'bar' || matchedVenue.category === 'club' ? '🍺' : matchedVenue.category === 'restaurant' ? '🍽️' : matchedVenue.category === 'salon' ? '✂️' : '☕'}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{matchedVenue.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{matchedVenue.address}</p>
                  </div>
                </div>
                {matchedVenue.aiSummary && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-3">"{matchedVenue.aiSummary}"</p>
                )}
                <button
                  onClick={handleSelectMatch}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Take Me There!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeelingLucky;

