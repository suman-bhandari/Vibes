import { Review, Venue } from '../types';
import { getCurrentLocation } from './location';

// Mock storage for reviews
const STORAGE_KEY = 'venueTracker_reviews';

export const getReviews = (venueId: string): Review[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const allReviews: Review[] = JSON.parse(stored);
    return allReviews
      .filter((r) => r.venueId === venueId)
      .map((r) => ({
        ...r,
        lastVisitDate: new Date(r.lastVisitDate),
        createdAt: new Date(r.createdAt),
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch {
    return [];
  }
};

export const saveReview = (review: Omit<Review, 'id' | 'createdAt'>): Review => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const allReviews: Review[] = stored ? JSON.parse(stored) : [];
  
  const newReview: Review = {
    ...review,
    id: `review_${Date.now()}`,
    createdAt: new Date(),
  };

  allReviews.push(newReview);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));
  return newReview;
};

export const checkLocationVerification = (
  userLat: number,
  userLng: number,
  venue: Venue,
  toleranceMeters: number = 50
): boolean => {
  // Calculate distance using Haversine formula
  const R = 6371e3; // Earth radius in meters
  const φ1 = (venue.latitude * Math.PI) / 180;
  const φ2 = (userLat * Math.PI) / 180;
  const Δφ = ((userLat - venue.latitude) * Math.PI) / 180;
  const Δλ = ((userLng - venue.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance <= toleranceMeters;
};

export const getAISummary = (venue: Venue, reviews: Review[]): string => {
  // Mock AI-generated summary based on venue data and recent reviews
  const recentReviews = reviews.slice(0, 3);
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const activityDescriptions = {
    'very-busy': 'buzzing with energy',
    'moderately-busy': 'lively and active',
    'some-activity': 'comfortably busy',
    'available': 'quiet and relaxed',
  };

  const categoryVibes = {
    bar: 'great spot for drinks',
    club: 'vibrant nightlife scene',
    restaurant: 'delicious food',
    salon: 'professional service',
    coffee: 'cozy atmosphere',
  };

  if (reviews.length === 0) {
    return `${venue.name} is ${activityDescriptions[venue.activityLevel]} - ${categoryVibes[venue.category]}.`;
  }

  const vibe = avgRating >= 4.5
    ? 'highly recommended'
    : avgRating >= 3.5
    ? 'well-liked'
    : 'mixed reviews';

  return `${venue.name} is ${activityDescriptions[venue.activityLevel]} with ${vibe} from recent visitors - ${categoryVibes[venue.category]}.`;
};

