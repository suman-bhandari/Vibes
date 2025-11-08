import { Review } from '../types';

// Sample reviews for The Alembic (venue id: '25')
export const alembicReviews: Omit<Review, 'id' | 'createdAt'>[] = [
  {
    venueId: '25',
    userId: 'user_rev1',
    userName: 'a3b7c9d',
    userTrustability: 92,
    userReputation: 4.6, // normalized from trustability
    activityQuotient: 85,
    rating: 5,
    comment: 'Best cocktails in the Haight! The bartenders are true artists. Great atmosphere for a date night.',
    lastVisitDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    totalTimeSpent: 120,
    verified: true,
  },
  {
    venueId: '25',
    userId: 'user_rev2',
    userName: 'x5y8z2',
    userTrustability: 78,
    userReputation: 3.9,
    activityQuotient: 65,
    rating: 4,
    comment: 'Solid bar with creative drinks. Gets busy on weekends but worth the wait. Staff is friendly.',
    lastVisitDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    totalTimeSpent: 90,
    verified: true,
  },
  {
    venueId: '25',
    userId: 'user_rev3',
    userName: 'm9n4p6',
    userTrustability: 85,
    userReputation: 4.3,
    activityQuotient: 72,
    rating: 5,
    comment: 'Love the vibe here! Perfect mix of locals and visitors. The mezcal selection is impressive.',
    lastVisitDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    totalTimeSpent: 105,
    verified: true,
  },
  {
    venueId: '25',
    userId: 'user_rev4',
    userName: 'q1r3s7',
    userTrustability: 68,
    userReputation: 3.4,
    activityQuotient: 45,
    rating: 4,
    comment: 'Good spot but can be loud. Great for groups. The food menu is limited but what they have is quality.',
    lastVisitDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    totalTimeSpent: 75,
    verified: true,
  },
  {
    venueId: '25',
    userId: 'user_rev5',
    userName: 't2u5v8',
    userTrustability: 95,
    userReputation: 4.8,
    activityQuotient: 90,
    rating: 5,
    comment: 'My go-to bar! The seasonal cocktails are always on point. Atmosphere is cozy yet lively.',
    lastVisitDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    totalTimeSpent: 150,
    verified: true,
  },
];

