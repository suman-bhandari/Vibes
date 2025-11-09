import React, { useState, useMemo, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import MapView from './components/Map/MapView';
import SearchBar from './components/SearchBar/SearchBar';
import FilterPanel from './components/FilterPanel/FilterPanel';
import DarkModeToggle from './components/DarkModeToggle/DarkModeToggle';
import AccountButton from './components/AccountButton/AccountButton';
import LiveEventsPanel from './components/LiveEvents/LiveEventsPanel';
import FeelingLucky from './components/FeelingLucky/FeelingLucky';
import { mockVenues } from './data/mockVenues';
import { Venue, VenueCategory, LiveEvent } from './types';
import { filterVenuesByCategory, filterVenuesByActivity, getActivityColor } from './utils/venueUtils';
import './App.css';

function AppContent() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<VenueCategory | 'all'>('all');
  const [activityRange, setActivityRange] = useState<[number, number]>([0, 100]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);

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


  const handleVenueSelect = (venue: Venue | null) => {
    if (venue) {
      // Center map on venue (popup will show automatically via Leaflet)
      setSelectedVenue(venue);
      setIsFilterOpen(false);
    } else {
      setSelectedVenue(null);
      setIsFilterOpen(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedVenue(null);
  };

  const handleEventSelect = (event: LiveEvent) => {
    // If event has a linked venue, center map on it
    if (event.venueId) {
      const venue = mockVenues.find((v) => v.id === event.venueId);
      if (venue) {
        setSelectedVenue(venue);
      }
    }
    setIsEventsOpen(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <DarkModeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
        <AccountButton />

      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <SearchBar
          venues={mockVenues}
          onVenueSelect={handleVenueSelect}
          onClear={handleClearSelection}
        />
      </div>

      {/* Live Events Button */}
      <div className="absolute top-20 right-4 z-50">
        <button
          onClick={() => setIsEventsOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <span>🎉</span>
          <span>Live Events</span>
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

        {/* Map View */}
        <div className="flex-1 relative">
          <MapView
            venues={filteredVenues}
            selectedVenue={selectedVenue}
            onVenueSelect={handleVenueSelect}
          />
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

      {/* Live Events Panel */}
      <LiveEventsPanel
        isOpen={isEventsOpen}
        onClose={() => setIsEventsOpen(false)}
        onEventSelect={handleEventSelect}
      />

      {/* I'm Feeling Lucky Button */}
      <FeelingLucky onVenueSelect={handleVenueSelect} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
