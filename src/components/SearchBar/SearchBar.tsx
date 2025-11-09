import React, { useState, useRef, useEffect } from 'react';
import { Venue } from '../../types';

interface SearchBarProps {
  venues: Venue[];
  onVenueSelect: (venue: Venue | null) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ venues, onVenueSelect, onClear }) => {
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

    const filtered = venues.filter((venue) =>
      venue.name.toLowerCase().includes(query.toLowerCase())
    );
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
      <div className="relative">
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
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
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

      {isOpen && filteredVenues.length > 0 && (
        <div className="absolute mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-auto z-50">
          {filteredVenues.map((venue) => (
            <button
              key={venue.id}
              onClick={() => handleSelect(venue)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{venue.category === 'bar' || venue.category === 'club' ? '🍺' : venue.category === 'restaurant' ? '🍽️' : venue.category === 'salon' ? '✂️' : '☕'}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{venue.name}</p>
                  <p className="text-sm text-gray-500">{venue.address}</p>
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

