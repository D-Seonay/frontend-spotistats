import { calculateAdvancedStats } from './stats-utils';
import { SpotifyStreamingData } from './types';
import { test, expect } from 'vitest';

test('calculateAdvancedStats computes correct metrics', () => {
  const data: SpotifyStreamingData[] = [
    { endTime: '2026-06-08T10:00:00Z', artistName: 'Artist A', trackName: 'Track 1', msPlayed: 100000 },
    { endTime: '2026-06-08T10:30:00Z', artistName: 'Artist A', trackName: 'Track 2', msPlayed: 50000 },
    { endTime: '2026-06-13T10:00:00Z', artistName: 'Artist B', trackName: 'Track 3', msPlayed: 200000 }, // Saturday
  ];

  const stats = calculateAdvancedStats(data);
  expect(stats.peakListeningHour).toBe(10);
  expect(stats.topLoyalArtist.name).toBe('Artist A');
  expect(stats.topLoyalArtist.plays).toBe(2);
  // weekend: 6/13 is Saturday
  expect(stats.weekendListenRatio).toBe(1/3);
  // skipIndex: (100000 + 50000 + 200000) / (3 * 180000) = 350000 / 540000 = 0.648...
  expect(stats.skipIndex).toBeCloseTo(0.648, 3);
});
