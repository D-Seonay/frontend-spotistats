# Dashboard Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate three new widgets (`ListeningHabitsWidget`, `LoyaltyWidget`, `TemporalTrendsWidget`) into the `DashboardPage` Bento grid.

**Architecture:** Utilize `useMemo` to compute `AdvancedStats` from `allRawData` in `DashboardPage`, then pass this data to the new widgets which will be positioned in the dashboard grid.

**Tech Stack:** React, Next.js, TypeScript, Tailwind CSS.

---

### Task 1: Update DashboardPage to compute and import new widgets

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Import new widgets**
Add imports in `app/dashboard/page.tsx`:
```tsx
import { ListeningHabitsWidget } from "@/components/widgets/ListeningHabitsWidget";
import { LoyaltyWidget } from "@/components/widgets/LoyaltyWidget";
import { TemporalTrendsWidget } from "@/components/widgets/TemporalTrendsWidget";
import { calculateAdvancedStats } from "@/lib/stats-utils";
```

- [ ] **Step 2: Compute AdvancedStats**
In `DashboardPage`, compute `advancedStats`:
```tsx
const advancedStats = useMemo(() => calculateAdvancedStats(allRawData), [allRawData]);
```

- [ ] **Step 3: Commit**
```bash
git add app/dashboard/page.tsx
git commit -m "feat: compute advancedStats and import new widgets"
```

### Task 2: Update Dashboard grid and integrate new widgets

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Modify Grid**
Update the grid class and add widgets to the JSX.
Increase rows to 9 (`md:grid-rows-9`).

```tsx
// Inside main JSX
<div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-9 lg:gap-6">
// ... existing widgets
// Add new widgets
<div className="md:col-span-2 md:row-span-1">
  <ListeningHabitsWidget stats={advancedStats} />
</div>
<div className="md:col-span-1 md:row-span-1">
  <LoyaltyWidget stats={advancedStats} />
</div>
<div className="md:col-span-1 md:row-span-1">
  <TemporalTrendsWidget stats={advancedStats} />
</div>
// ...
```

- [ ] **Step 2: Commit**
```bash
git add app/dashboard/page.tsx
git commit -m "feat: integrate new widgets into dashboard grid"
```

### Task 3: Build Verification

**Files:**
- None

- [ ] **Step 1: Build verification**
Run: `pnpm run build`
Expected: SUCCESS

- [ ] **Step 2: Final Commit (if any)**
```bash
# None if build succeeds
```
