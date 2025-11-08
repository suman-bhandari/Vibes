import { LiveEvent } from '../types';

export const mockEvents: LiveEvent[] = [
  {
    id: 'event_1',
    name: 'SF Street Food Festival',
    description: 'Annual street food festival with 50+ vendors, live music, and activities',
    latitude: 37.7749,
    longitude: -122.4194,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    category: 'festival',
  },
  {
    id: 'event_2',
    name: 'Jazz Night at Union Square',
    description: 'Free outdoor jazz concert featuring local artists',
    latitude: 37.7879,
    longitude: -122.4075,
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    endTime: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
    category: 'concert',
  },
  {
    id: 'event_3',
    name: 'Farmers Market - Mission District',
    description: 'Weekly farmers market with fresh produce, artisanal goods, and food trucks',
    latitude: 37.7594,
    longitude: -122.4194,
    startTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    category: 'market',
  },
  {
    id: 'event_4',
    name: 'Beach Volleyball Tournament',
    description: 'Amateur beach volleyball tournament at Ocean Beach',
    latitude: 37.7594,
    longitude: -122.5108,
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    category: 'sports',
  },
];

