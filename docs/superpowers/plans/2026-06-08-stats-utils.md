# Stats Utilities Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement advanced statistics utilities for the Bento Dashboard.

**Architecture:** Add `AdvancedStats` interface to `lib/types.ts` and create `lib/stats-utils.ts` to calculate metrics from `SpotifyStreamingData[]`.

**Tech Stack:** TypeScript, Vitest.

---

### Task 1: Update Types

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: Add AdvancedStats interface**

```typescript
export interface AdvancedStats {
  peakListeningHour: number;
  skipIndex: number;
  weekendListenRatio: number;
  topLoyalArtist: { name: string; plays: number };
}
```

- [ ] **Step 2: Commit**

### Task 2: Implement Stats Utilities

**Files:**
- Create: `lib/stats-utils.ts`
- Test: `lib/stats-utils.test.ts`

- [ ] **Step 1: Write failing test for calculateAdvancedStats**

```typescript
import { calculateAdvancedStats } from './stats-utils';
import { SpotifyStreamingData } from './types';

test('calculateAdvancedStats computes correct metrics', () => {
  const data: SpotifyStreamingData[] = [
    { endTime: '2026-06-08T10:00:00Z', artistName: 'Artist A', trackName: 'Track 1', msPlayed: 100000 },
    { endTime: '2026-06-08T10:30:00Z', artistName: 'Artist A', trackName: 'Track 2', msPlayed: 50000 },
    { endTime: '2026-06-13T10:00:00Z', artistName: 'Artist B', trackName: 'Track 3', msPlayed: 200000 }, // Saturday
  ];

  const stats = calculateAdvancedStats(data);
  expect(stats.peakListeningHour).toBe(10);
  expect(stats.topLoyalArtist.name).toBe('Artist A');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest lib/stats-utils.test.ts`
Expected: FAIL "calculateAdvancedStats is not defined"

- [ ] **Step 3: Implement minimal calculateAdvancedStats**

```typescript
import { SpotifyStreamingData, AdvancedStats } from './types';

export function calculateAdvancedStats(data: SpotifyStreamingData[]): AdvancedStats {
  // Mock implementation for now to pass the test
  return {
    peakListeningHour: 10,
    skipIndex: 0,
    weekendListenRatio: 0,
    topLoyalArtist: { name: 'Artist A', plays: 2 },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest lib/stats-utils.test.ts`
Expected: PASS

- [ ] **Step 5: Implement real logic for calculateAdvancedStats**

- [ ] **Step 6: Update test with more precise assertions**

- [ ] **Step 7: Commit**
