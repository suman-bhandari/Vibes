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
  aiSummary?: string; // AI-generated current vibe summary
}

export interface MapMarker {
  venue: Venue;
  position: [number, number];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  trustability: number; // 0-100, starts at 0
  totalReviews: number;
  createdAt: Date;
}

export interface Review {
  id: string;
  venueId: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  userTrustability: number;
  rating: number; // 1-5
  comment: string;
  lastVisitDate: Date;
  totalTimeSpent: number; // in minutes
  createdAt: Date;
  verified: boolean; // whether location was verified
}

export interface LiveEvent {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  startTime: Date;
  endTime: Date;
  category: 'festival' | 'concert' | 'market' | 'sports' | 'other';
  venueId?: string; // optional link to venue
}

