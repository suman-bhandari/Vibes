import React, { useState, useRef, useEffect } from 'react';
import { Venue } from '../../types';
import { getCategoryLabel, getCategoryIcon } from '../../utils/venueUtils';

interface SearchBarProps {
  venues: Venue[];
  onVenueSelect: (venue: Venue | null) => void;
  onClear: () => void;
  onOpenLiveEvents?: () => void;
  onOpenFeelingLucky?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ venues, onVenueSelect, onClear, onOpenLiveEvents, onOpenFeelingLucky }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredVenues([]);
      setIsOpen(false);
      return;
    }

    const queryLower = query.toLowerCase().trim();
    
    // Category mapping for search
    const categoryKeywords: Record<string, string[]> = {
      'bar': ['bar', 'bars', 'club', 'clubs', 'pub', 'pubs', 'nightlife', 'drinks', 'beer', 'cocktail'],
      'restaurant': ['restaurant', 'restaurants', 'dining', 'food', 'eat', 'cafe', 'bistro', 'diner'],
      'salon': ['salon', 'salons', 'barber', 'barbers', 'haircut', 'hair', 'stylist', 'beauty', 'spa'],
      'coffee': ['coffee', 'cafe', 'café', 'espresso', 'latte', 'cappuccino', 'brew', 'roastery'],
    };

    const filtered = venues.filter((venue) => {
      const nameMatch = venue.name.toLowerCase().includes(queryLower);
      const categoryLabel = getCategoryLabel(venue.category).toLowerCase();
      const categoryMatch = categoryLabel.includes(queryLower);
      
      // Check if query matches any category keywords
      const categoryKeywordsMatch = categoryKeywords[venue.category]?.some(keyword =>
        keyword.includes(queryLower) || queryLower.includes(keyword)
      ) || false;
      
      return nameMatch || categoryMatch || categoryKeywordsMatch;
    });
    
    setFilteredVenues(filtered);
    setIsOpen(filtered.length > 0);
  }, [query, venues]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (venue: Venue) => {
    setQuery('');
    setIsOpen(false);
    onVenueSelect(venue);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    onClear();
  };

  return (
    <div ref={searchRef} className="relative z-50 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        {/* Live Events Button - Left side */}
        {onOpenLiveEvents && (
          <button
            onClick={onOpenLiveEvents}
            className="px-3 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-lg flex items-center justify-center whitespace-nowrap"
            title="Live Events"
          >
            <span className="text-sm">🎉</span>
          </button>
        )}

        {/* Search Input Container */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search venues..."
            className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
            {/* Microphone Icon */}
            <button
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Voice search"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
            {/* Clear Button */}
            {query && (
              <button
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* I'm Feeling Lucky Button - Right side */}
        {onOpenFeelingLucky && (
          <button
            onClick={onOpenFeelingLucky}
            className="px-3 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium shadow-lg flex items-center justify-center whitespace-nowrap"
            title="I'm Feeling Lucky"
          >
            <span className="text-sm">🍀</span>
          </button>
        )}
      </div>

      {isOpen && filteredVenues.length > 0 && (
        <div className="absolute mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-auto z-50">
          {filteredVenues.map((venue) => (
            <button
              key={venue.id}
              onClick={() => handleSelect(venue)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{getCategoryIcon(venue.category)}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{venue.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">{getCategoryLabel(venue.category)}</p>
                    <span className="text-gray-300">•</span>
                    <p className="text-sm text-gray-500">{venue.address}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

