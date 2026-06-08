# Advanced Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement advanced listening habit visualizations (Listening Habits, Loyalty, Temporal Trends) in the Bento Dashboard.

**Architecture:** Create new utility functions for metrics in `lib/stats-utils.ts` and build corresponding Bento widgets in `components/widgets/`.

**Tech Stack:** Next.js (App Router), Recharts, Tailwind CSS.

---

### Task 1: Stats Utilities

**Files:**
- Create: `lib/stats-utils.ts`
- Modify: `lib/types.ts`

- [ ] **Step 1: Define new metric types in `lib/types.ts`**

```typescript
export interface AdvancedStats {
  peakListeningHour: number;
  skipIndex: number;
  weekendListenRatio: number;
  topLoyalArtist: { name: string; plays: number };
}
```

- [ ] **Step 2: Implement utility functions in `lib/stats-utils.ts`**

```typescript
import { SpotifyStreamingData } from './types';

export function calculateAdvancedStats(data: SpotifyStreamingData[]): AdvancedStats {
  // Logic for:
  // - peakListeningHour: count hour frequencies
  // - skipIndex: compare msPlayed vs avg duration
  // - weekendListenRatio: compare weekend vs weekday streams
  // - topLoyalArtist: artist with plays spread over most months
  return { ... };
}
```

- [ ] **Step 3: Commit**

---

### Task 2: Advanced Widgets

**Files:**
- Create: `components/widgets/ListeningHabitsWidget.tsx`
- Create: `components/widgets/LoyaltyWidget.tsx`
- Create: `components/widgets/TemporalTrendsWidget.tsx`

- [ ] **Step 1: Implement `ListeningHabitsWidget.tsx`**
Visualize peak listening hours and skip index.

- [ ] **Step 2: Implement `LoyaltyWidget.tsx`**
Display top loyal artist and weekend ratio.

- [ ] **Step 3: Implement `TemporalTrendsWidget.tsx`**
Display a line chart for listening evolution over time.

- [ ] **Step 4: Commit**

---

### Task 3: Dashboard Integration

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Add new widgets to the Bento grid**
Integrate the new widgets into the existing grid layout in `app/dashboard/page.tsx`.

- [ ] **Step 2: Final build verification**
Run: `pnpm run build`

- [ ] **Step 3: Commit**
