// Utility functions for reputation and karma

/**
 * Normalize reputation score from 0-100 to 0-5
 */
export function normalizeReputation(trustability: number): number {
  // Convert 0-100 trustability to 0-5 reputation
  return Math.min(5, Math.max(0, (trustability / 100) * 5));
}

/**
 * Get color for reputation-based username box
 * 0-1: red, 1-2: orange, 2-3: yellow, 3-4: light green, 4-5: green
 */
export function getReputationColor(reputation: number): string {
  if (reputation >= 4) return '#22C55E'; // green-500
  if (reputation >= 3) return '#84CC16'; // lime-500
  if (reputation >= 2) return '#EAB308'; // yellow-500
  if (reputation >= 1) return '#F97316'; // orange-500
  return '#EF4444'; // red-500
}

/**
 * Get background color for reputation box (lighter version)
 */
export function getReputationBgColor(reputation: number): string {
  if (reputation >= 4) return '#D1FAE5'; // green-100
  if (reputation >= 3) return '#ECFCCB'; // lime-100
  if (reputation >= 2) return '#FEF9C3'; // yellow-100
  if (reputation >= 1) return '#FFEDD5'; // orange-100
  return '#FEE2E2'; // red-100
}

