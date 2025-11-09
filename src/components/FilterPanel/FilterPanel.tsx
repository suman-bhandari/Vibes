import React from 'react';
import { VenueCategory } from '../../types';

interface FilterPanelProps {
  selectedCategory: VenueCategory | 'all';
  onCategoryChange: (category: VenueCategory | 'all') => void;
  vibeRange: [number, number];
  onVibeRangeChange: (range: [number, number]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onCategoryChange,
  vibeRange,
  onVibeRangeChange,
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

          {/* Vibe Range Slider */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Vibe
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Min: {vibeRange[0]}/5</span>
                  <span>Max: {vibeRange[1]}/5</span>
                </div>
                <div className="relative h-8 flex items-center">
                  {/* Background track */}
                  <div className="absolute w-full h-2 bg-gray-200 rounded-lg" />
                  {/* Active range highlight */}
                  <div 
                    className="absolute h-2 bg-blue-600 rounded-lg"
                    style={{
                      left: `${(vibeRange[0] / 5) * 100}%`,
                      width: `${((vibeRange[1] - vibeRange[0]) / 5) * 100}%`
                    }}
                  />
                  {/* Min slider */}
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={vibeRange[0]}
                    onChange={(e) => {
                      const newMin = parseFloat(e.target.value);
                      if (newMin <= vibeRange[1]) {
                        onVibeRangeChange([newMin, vibeRange[1]]);
                      }
                    }}
                    className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10 range-input"
                  />
                  {/* Max slider */}
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={vibeRange[1]}
                    onChange={(e) => {
                      const newMax = parseFloat(e.target.value);
                      if (newMax >= vibeRange[0]) {
                        onVibeRangeChange([vibeRange[0], newMax]);
                      }
                    }}
                    className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-20 range-input"
                  />
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

