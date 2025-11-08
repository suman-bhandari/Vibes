import React, { useState, useMemo, useEffect } from 'react';
import MapView from './components/Map/MapView';
import SearchBar from './components/SearchBar/SearchBar';
import FilterPanel from './components/FilterPanel/FilterPanel';
import DarkModeToggle from './components/DarkModeToggle/DarkModeToggle';
import ListView from './components/ListView/ListView';
import { mockVenues } from './data/mockVenues';
import { Venue, VenueCategory } from './types';
import { filterVenuesByCategory, filterVenuesByActivity, getActivityColor } from './utils/venueUtils';
import './App.css';

function App() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<VenueCategory | 'all'>('all');
  const [activityRange, setActivityRange] = useState<[number, number]>([0, 100]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Filter venues based on category and activity
  const filteredVenues = useMemo(() => {
    let venues = filterVenuesByCategory(mockVenues, selectedCategory);
    venues = filterVenuesByActivity(venues, activityRange[0], activityRange[1]);
    return venues;
  }, [selectedCategory, activityRange]);

  // Get trending venues (top 5 by capacity)
  const trendingVenues = useMemo(() => {
    return [...mockVenues]
      .sort((a, b) => b.capacity - a.capacity)
      .slice(0, 5);
  }, []);

  const handleVenueSelect = (venue: Venue | null) => {
    setSelectedVenue(venue);
    setIsFilterOpen(false); // Close filter panel on mobile when venue is selected
  };

  const handleClearSelection = () => {
    setSelectedVenue(null);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <DarkModeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />

      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <SearchBar
          venues={mockVenues}
          onVenueSelect={handleVenueSelect}
          onClear={handleClearSelection}
        />
      </div>

      {/* View Toggle */}
      <div className="absolute top-20 right-4 z-50 flex gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1">
        <button
          onClick={() => setViewMode('map')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'map'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'list'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          List
        </button>
      </div>

      {/* Main Content */}
      <div className="flex h-full pt-24 lg:pt-20">
        {/* Filter Panel */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <FilterPanel
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            activityRange={activityRange}
            onActivityRangeChange={setActivityRange}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
          />
        </div>

        {/* Map or List View */}
        <div className="flex-1 relative">
          {viewMode === 'map' ? (
            <MapView
              venues={filteredVenues}
              selectedVenue={selectedVenue}
              onVenueSelect={handleVenueSelect}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              {/* Trending Section */}
              {selectedCategory === 'all' && (
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    🔥 Trending Venues
                  </h2>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {trendingVenues.map((venue) => {
                      const color = getActivityColor(venue.activityLevel);
                      return (
                        <button
                          key={venue.id}
                          onClick={() => handleVenueSelect(venue)}
                          className="flex-shrink-0 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {venue.name}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {venue.capacity}% capacity
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <ListView venues={filteredVenues} onVenueSelect={handleVenueSelect} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <div className="lg:hidden">
        <FilterPanel
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          activityRange={activityRange}
          onActivityRangeChange={setActivityRange}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
        />
      </div>
    </div>
  );
}

export default App;
