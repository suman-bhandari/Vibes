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
  waitTime: number; // in minutes (base estimate)
  waitTimeInterval: [number, number]; // 85% confidence interval [min, max]
  activityLevel: ActivityLevel;
  aiSummary?: string; // AI-generated current vibe summary
  vibe?: number; // 1-10 for social venues (bars, clubs)
  crowd?: number; // 1-10 for social venues
  isSpecialEvent?: boolean; // Star-marked special events
  specialEventDescription?: string;
  liveComments?: LiveComment[];
  openingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  phone?: string;
  website?: string;
  description?: string;
  userImages?: VenueImage[]; // images uploaded by users
}

export interface VenueImage {
  id: string;
  url: string;
  uploadedBy: string; // userId
  uploadedAt: Date;
  caption?: string;
}

export interface LiveComment {
  id: string;
  userId: string;
  userName: string; // anonymized/hashed
  comment: string;
  timestamp: Date;
  trustability: number;
  reputation: number; // 0-5, normalized reputation for color coding
  karma?: number; // experience points (for display)
  images?: string[]; // optional array of image URLs
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
  reputation: number; // 0-5, normalized reputation score (visible to all)
  karma: number; // karma points (only visible to user, can be redeemed)
  totalReviews: number;
  createdAt: Date;
}

export interface Review {
  id: string;
  venueId: string;
  userId: string;
  userName: string; // anonymized/hashed
  userAvatarUrl?: string;
  userTrustability: number;
  userReputation: number; // 0-5, normalized reputation
  activityQuotient: number; // how active user is at this venue (0-100)
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

