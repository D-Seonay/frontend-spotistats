# Design Spec: Bento Refactor & Stats Focus

**Date:** 2026-06-08
**Topic:** Refactoring the Spotify Listener Stats frontend to a Bento-style UI and removing non-essential pages.

## 1. Goal
Transform the application from a multi-page marketing site into a focused, high-performance data visualization tool for Spotify listening history.

### Success Criteria
- Dashboard uses a "Bento" grid layout.
- Marketing pages (FAQ, Blog, Pricing, etc.) are removed.
- Data sourcing is "Hybrid": CSV works immediately, API enriches with images and recent data.
- Navigation is simplified to Dashboard, Music/Artists, and Profile.

## 2. Architecture & Design

### UI: Bento Dashboard
The main dashboard (`/dashboard`) will be reorganized into a responsive grid of cards:
- **Stat Flash (1x1)**: Total Hours, Top Genre, Unique Tracks, Unique Artists.
- **Activity Heatmap (3x2)**: GitHub-style 12-month activity visualization.
- **Spotify Player (1x2)**: Compact playback controls.
- **Top Artists (2x3)**: List with photos and play counts.
- **Top Tracks (2x3)**: List with album covers and play counts.

### Data Flow: Hybrid Model
1. **Initial State (CSV)**: 
   - User uploads CSV/JSON from Spotify export.
   - `DataContext` processes data locally.
   - UI shows stats with placeholder icons for artists/tracks.
2. **Enriched State (API)**:
   - User logs in with Spotify.
   - App fetches missing metadata (artist images, track covers) for the top items.
   - App fetches "Recently Played" or "Top Items" from Spotify API to merge with the CSV history.

## 3. Scope of Changes

### Removal of Pages
The following routes and their associated logic will be deleted:
- `app/about/`
- `app/blog/`
- `app/careers/`
- `app/faq/`
- `app/features/`
- `app/pricing/`
- `app/privacy/`
- `app/terms/`
- `app/cookies/`

### Refactoring Components
- **Header**: Remove navigation links to deleted pages.
- **Dashboard**: Complete rewrite of the layout using a Grid/Bento structure.
- **DataContext**: Update to handle the merging of CSV data and API-fetched metadata.

### Styling
- **CSS Grid**: Primary layout tool for the Bento grid.
- **Glassmorphism**: Maintain the dark theme with subtle borders and background blurs.

## 4. Implementation Plan (High-Level)
1. **Cleanup Phase**: Delete unnecessary routes and components.
2. **Data Phase**: Enhance `DataContext` to support "Enrichment" hooks.
3. **UI Phase**: Implement the new Bento grid layout in `app/dashboard/page.tsx`.
4. **Integration Phase**: Connect Spotify API hooks (`useSpotifyArtistImage`, etc.) to the dashboard cards.

## 5. Self-Review
- **Placeholders**: None.
- **Internal Consistency**: Matches the Bento layout discussed.
- **Scope**: Focused on the dashboard and cleanup.
- **Ambiguity**: Data merging logic is clear (CSV + API enrichment).
