import { Venue, ActivityLevel } from '../types';

export function getActivityColor(level: ActivityLevel): string {
  switch (level) {
    case 'very-busy':
      return '#EF4444'; // red-500
    case 'moderately-busy':
      return '#F97316'; // orange-500
    case 'some-activity':
      return '#EAB308'; // yellow-500
    case 'available':
      return '#22C55E'; // green-500
    default:
      return '#6B7280'; // gray-500
  }
}

export function getCategoryLabel(category: Venue['category']): string {
  switch (category) {
    case 'bar':
      return 'Bar';
    case 'club':
      return 'Club';
    case 'restaurant':
      return 'Restaurant';
    case 'salon':
      return 'Salon';
    case 'coffee':
      return 'Coffee Shop';
    default:
      return 'Venue';
  }
}

export function getCategoryIcon(category: Venue['category']): string {
  switch (category) {
    case 'bar':
    case 'club':
      return '🍺';
    case 'restaurant':
      return '🍽️';
    case 'salon':
      return '✂️';
    case 'coffee':
      return '☕';
    default:
      return '📍';
  }
}

export function formatWaitTime(minutes: number): string {
  if (minutes === 0) return 'No wait';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function filterVenuesByCategory(
  venues: Venue[],
  category: Venue['category'] | 'all'
): Venue[] {
  if (category === 'all') return venues;
  return venues.filter((v) => v.category === category);
}

export function filterVenuesByActivity(
  venues: Venue[],
  minActivity: number,
  maxActivity: number
): Venue[] {
  return venues.filter((v) => {
    // Filter by capacity percentage (0-100)
    return v.capacity >= minActivity && v.capacity <= maxActivity;
  });
}

