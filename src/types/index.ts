export type VenueCategory = 'bar' | 'restaurant' | 'salon' | 'coffee' | 'club';

export type ActivityLevel = 'very-busy' | 'moderately-busy' | 'some-activity' | 'available';

export interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number; // 0-100
  waitTime: number; // in minutes
  activityLevel: ActivityLevel;
}

export interface MapMarker {
  venue: Venue;
  position: [number, number];
}

