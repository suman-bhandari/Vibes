import React from 'react';
import { VenueCategory, Venue, LiveEvent } from '../../types';

interface FilterPanelProps {
  selectedCategory: VenueCategory | 'all';
  onCategoryChange: (category: VenueCategory | 'all') => void;
  minVibe: number;
  onMinVibeChange: (vibe: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  onEventSelect?: (event: LiveEvent) => void;
  onVenueSelect?: (venue: Venue) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onCategoryChange,
  minVibe,
  onMinVibeChange,
  isOpen,
  onToggle,
  onEventSelect,
  onVenueSelect,
}) => {
  const categories: Array<{ value: VenueCategory | 'all'; label: string; icon: string }> = [
    { value: 'all', label: 'All', icon: '📍' },
    { value: 'bar', label: 'Bars & Clubs', icon: '🍺' },
    { value: 'restaurant', label: 'Restaurants', icon: '🍽️' },
    { value: 'salon', label: 'Salons & Barbers', icon: '✂️' },
    { value: 'coffee', label: 'Coffee Shops', icon: '☕' },
  ];

  return (
    <>
      {/* Mobile: Hamburger button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle filters"
      >
        <svg
          className="h-6 w-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile: Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed lg:sticky top-0 right-0 h-full lg:h-auto
          w-80 max-w-[90vw] bg-white shadow-xl lg:shadow-none
          border-l border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="p-6">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="h-5 w-5 text-gray-600"
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
          </div>

          {/* Desktop title */}
          <h2 className="text-xl font-bold text-gray-900 mb-6 hidden lg:block">
            Filters
          </h2>

          {/* Live Events Button */}
          {onEventSelect && (
            <div className="mb-6">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openLiveEvents'));
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-semibold flex items-center justify-center gap-2"
              >
                <span>🎉</span>
                <span>Live Events</span>
              </button>
            </div>
          )}

          {/* I'm Feeling Lucky Button */}
          {onVenueSelect && (
            <div className="mb-6">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openFeelingLucky'));
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg shadow-lg hover:from-yellow-600 hover:to-orange-600 transition-all text-sm font-semibold flex items-center justify-center gap-2"
              >
                <span>🍀</span>
                <span>I'm Feeling Lucky</span>
              </button>
            </div>
          )}

          {/* Category Filters */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Category
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => onCategoryChange(cat.value)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg transition-all
                    ${
                      selectedCategory === cat.value
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="font-medium">{cat.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Vibe - Sparkle Emoji Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Vibe
            </h3>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const rating = i + 1; // 1, 2, 3, 4, 5 (5 sparkles representing 1-5, 0 is unselected)
                const isSelected = minVibe >= rating;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      // Clicking sparkle N sets minVibe to N (1-5)
                      // If clicking the same sparkle again, set to 0
                      onMinVibeChange(minVibe === rating ? 0 : rating);
                    }}
                    className={`text-lg transition-all sparkle-orange ${
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
        </div>
      </div>
    </>
  );
};

export default FilterPanel;

