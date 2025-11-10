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
import { filterVenuesByCategory } from './utils/venueUtils';
import './App.css';

function AppContent() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<VenueCategory | 'all'>('all');
  const [minVibe, setMinVibe] = useState<number>(0);
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

  // Filter venues based on category, vibe, and activity level
  const filteredVenues = useMemo(() => {
    let venues = filterVenuesByCategory(mockVenues, selectedCategory);
    
    // Filter out venues below 3.5 vibe and venues with red waiting times (very-busy)
    venues = venues.filter((v) => {
      // Always include Celeste (special venue)
      if (v.id === '32' || v.name === 'Celeste') {
        return true;
      }
      
      // Filter out venues with very-busy activity level (red waiting times)
      if (v.activityLevel === 'very-busy') {
        return false;
      }
      
      // For entertainment venues (bar, club), filter by vibe (must be >= 3.5)
      if (v.category === 'bar' || v.category === 'club') {
        let calculatedVibe: number | undefined = undefined;
        
        // Calculate vibe from live comments if available
        if (v.liveComments && v.liveComments.length > 0) {
          const commentsWithVibe = v.liveComments.filter(c => c.vibe !== undefined);
          if (commentsWithVibe.length > 0) {
            const sum = commentsWithVibe.reduce((acc, c) => {
              const vibe = c.vibe || 0;
              const normalizedVibe = vibe > 5 ? (vibe - 1) / 2 : vibe;
              return acc + normalizedVibe;
            }, 0);
            calculatedVibe = sum / commentsWithVibe.length;
          }
        }
        
        // Use vibe property if available (prefer this over calculated)
        if (v.vibe !== undefined) {
          calculatedVibe = v.vibe > 5 ? (v.vibe - 1) / 2 : v.vibe;
        }
        
        // If we have a vibe value and it's below 3.5, filter it out
        if (calculatedVibe !== undefined && calculatedVibe < 3.5) {
          return false;
        }
        
        // If no vibe data available for entertainment venue, exclude it (to be safe)
        if (calculatedVibe === undefined) {
          return false;
        }
      }
      
      return true;
    });
    
    // Additional filter by minVibe if set
    if (minVibe > 0) {
      venues = venues.filter((v) => {
        if (v.category === 'bar' || v.category === 'club') {
          // For entertainment venues, filter by aggregated vibe
          if (v.vibe !== undefined) {
            const normalizedVibe = v.vibe > 5 ? (v.vibe - 1) / 2 : v.vibe;
            return normalizedVibe >= minVibe;
          }
          // If no vibe set, include it (will be calculated from comments)
          return true;
        }
        // For non-entertainment venues, include all
        return true;
      });
    }
    
    return venues;
  }, [selectedCategory, minVibe]);


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

  // Listen for custom events from FilterPanel
  useEffect(() => {
    const handleOpenLiveEvents = () => setIsEventsOpen(true);
    const handleOpenFeelingLucky = () => {
      // Trigger FeelingLucky component to open
      const event = new CustomEvent('feelingLuckyOpen');
      window.dispatchEvent(event);
    };

    window.addEventListener('openLiveEvents', handleOpenLiveEvents);
    window.addEventListener('openFeelingLucky', handleOpenFeelingLucky);

    return () => {
      window.removeEventListener('openLiveEvents', handleOpenLiveEvents);
      window.removeEventListener('openFeelingLucky', handleOpenFeelingLucky);
    };
  }, []);

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


      {/* Main Content */}
      <div className="flex h-full pt-24 lg:pt-20">
        {/* Filter Panel */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <FilterPanel
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            minVibe={minVibe}
            onMinVibeChange={setMinVibe}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
            onEventSelect={handleEventSelect}
            onVenueSelect={(venue) => handleVenueSelect(venue)}
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
          minVibe={minVibe}
          onMinVibeChange={setMinVibe}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
          onEventSelect={handleEventSelect}
          onVenueSelect={(venue) => handleVenueSelect(venue)}
        />
      </div>

      {/* Live Events Panel */}
      <LiveEventsPanel
        isOpen={isEventsOpen}
        onClose={() => setIsEventsOpen(false)}
        onEventSelect={handleEventSelect}
      />

      {/* I'm Feeling Lucky - handled via FilterPanel */}
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
