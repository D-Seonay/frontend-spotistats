# Dashboard Integration Design

## Overview
Integrate three new widgets (`ListeningHabitsWidget`, `LoyaltyWidget`, `TemporalTrendsWidget`) into the `DashboardPage` grid.

## Data Requirement
- Compute `AdvancedStats` using `calculateAdvancedStats` from `allRawData` (imported in `DataContext`).
- Use `useMemo` to optimize the computation.

## Grid Layout Update
- Current grid: `md:grid-cols-4 md:grid-rows-6`.
- Proposed grid: `md:grid-cols-4 md:grid-rows-9`.
- New widgets placement:
    - `ListeningHabitsWidget`: md:col-span-2 md:row-span-1
    - `LoyaltyWidget`: md:col-span-1 md:row-span-1
    - `TemporalTrendsWidget`: md:col-span-1 md:row-span-1

## Components
- Import widgets from `@/components/widgets`.

## Verification
- Run `pnpm run build` to ensure no type errors.
