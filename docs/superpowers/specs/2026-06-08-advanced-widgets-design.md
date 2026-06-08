# Advanced Widgets Design

## Purpose
Create three new widgets to visualize user listening habits, loyalty, and temporal trends.

## Widgets
1. **ListeningHabitsWidget**: Visualizes peak listening hours and skip index.
2. **LoyaltyWidget**: Displays the top loyal artist and the weekend listening ratio.
3. **TemporalTrendsWidget**: Displays a line chart of listening evolution over time (minutes per day).

## Architecture
- Components in `components/widgets/`.
- Use existing `Card` components from `components/ui/`.
- Use `recharts` for the line chart.
- Data passed as props, pre-processed by `lib/stats-utils.ts`.
