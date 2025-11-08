import React from 'react';
import { VenueCategory } from '../../types';

interface FilterPanelProps {
  selectedCategory: VenueCategory | 'all';
  onCategoryChange: (category: VenueCategory | 'all') => void;
  activityRange: [number, number];
  onActivityRangeChange: (range: [number, number]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onCategoryChange,
  activityRange,
  onActivityRangeChange,
  isOpen,
  onToggle,
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

          {/* Activity Level Slider */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Activity Level
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Min: {activityRange[0]}%</span>
                  <span>Max: {activityRange[1]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activityRange[0]}
                  onChange={(e) =>
                    onActivityRangeChange([
                      parseInt(e.target.value),
                      activityRange[1],
                    ])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activityRange[1]}
                  onChange={(e) =>
                    onActivityRangeChange([
                      activityRange[0],
                      parseInt(e.target.value),
                    ])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
              </div>
              <div className="flex gap-2 text-xs">
                <div className="flex-1 text-center">
                  <div className="w-full h-2 bg-green-500 rounded mb-1" />
                  <span className="text-gray-600">Available</span>
                </div>
                <div className="flex-1 text-center">
                  <div className="w-full h-2 bg-yellow-500 rounded mb-1" />
                  <span className="text-gray-600">Some Activity</span>
                </div>
                <div className="flex-1 text-center">
                  <div className="w-full h-2 bg-orange-500 rounded mb-1" />
                  <span className="text-gray-600">Moderate</span>
                </div>
                <div className="flex-1 text-center">
                  <div className="w-full h-2 bg-red-500 rounded mb-1" />
                  <span className="text-gray-600">Very Busy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;

