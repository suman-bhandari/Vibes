# Venue Tracker - Activity & Wait Time MVP

A modern web application for tracking venue activity levels and wait times in San Francisco. Built with React, TypeScript, Tailwind CSS, and Leaflet.js.

## Features

### 🗺️ Interactive Map
- Full-screen Leaflet map centered on San Francisco
- Color-coded venue markers:
  - 🔴 **Red**: Very busy (90-100% capacity / 60+ min wait)
  - 🟠 **Orange**: Moderately busy (60-89% capacity / 30-60 min wait)
  - 🟡 **Yellow**: Some activity (30-59% capacity / 15-30 min wait)
  - 🟢 **Green**: Available (0-29% capacity / <15 min wait)
- Click markers to view venue details in popups
- "Get Directions" button (logs to console for MVP)

### 🔍 Search Functionality
- Floating search bar with autocomplete dropdown
- Real-time venue search by name
- Clicking results centers map and opens venue popup
- Clear search button

### 🎛️ Filter Controls
- Category filters:
  - All venues
  - Bars & Clubs
  - Restaurants
  - Salons & Barbers
  - Coffee Shops
- Activity level slider (0-100%)
- Responsive side panel (desktop) or bottom sheet (mobile)
- Hamburger menu for mobile access

### 📱 Responsive Design
- Mobile-first approach
- Search bar stacks on top on mobile
- Filters accessible via hamburger menu on mobile
- Map fills remaining viewport
- Smooth transitions and animations

### 🌓 Dark Mode
- Toggle dark/light mode
- Smooth theme transitions
- Persistent across page reloads

### 📋 List View (Bonus)
- Toggle between Map and List views
- Card-based venue display
- Trending venues section
- Click cards to navigate to venue on map

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Leaflet.js** with React Leaflet for maps
- **Mock Data** (30 SF venues)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd venue-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
venue-tracker/
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapView.tsx
│   │   │   └── VenuePopup.tsx
│   │   ├── SearchBar/
│   │   │   └── SearchBar.tsx
│   │   ├── FilterPanel/
│   │   │   └── FilterPanel.tsx
│   │   ├── DarkModeToggle/
│   │   │   └── DarkModeToggle.tsx
│   │   └── ListView/
│   │       └── ListView.tsx
│   ├── data/
│   │   └── mockVenues.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── venueUtils.ts
│   ├── App.tsx
│   └── index.tsx
├── public/
└── package.json
```

## Mock Data

The app includes 30 mock venues across San Francisco with:
- Realistic names and addresses
- Variety of categories (bars, restaurants, salons, coffee shops)
- Different activity levels and wait times
- Accurate latitude/longitude coordinates

## Future Enhancements

- Backend integration for real-time data
- User authentication
- Favorite venues
- Push notifications
- Real-time updates via WebSocket
- Payment integration
- Advanced analytics dashboard

## License

MIT
