# Bento Refactor & Stats Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the application into a focused Bento-style dashboard for Spotify stats, removing all non-essential marketing pages and enabling hybrid data enrichment (CSV + API).

**Architecture:** A single-page focused dashboard using a CSS Grid Bento layout. Data is managed via a React Context that merges local CSV data with optional Spotify API metadata (images, recent plays).

**Tech Stack:** Next.js (App Router), Tailwind CSS, Lucide React, Recharts, Spotify API.

---

### Task 1: Site Cleanup

**Files:**
- Modify: `components/Header.tsx`
- Delete: `app/about/page.tsx`, `app/blog/page.tsx`, `app/careers/page.tsx`, `app/faq/page.tsx`, `app/features/page.tsx`, `app/pricing/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/cookies/page.tsx`

- [ ] **Step 1: Remove unnecessary routes**
Run: `rm -rf app/about app/blog app/careers app/faq app/features app/pricing app/privacy app/terms app/cookies`

- [ ] **Step 2: Simplify Header navigation**
Modify `components/Header.tsx` to remove the complex dropdowns and links to deleted pages. Keep only "Dashboard" (link to `/dashboard`), "Ma Musique" (link to `/all-music`), and the Spotify login button.

```tsx
// components/Header.tsx
// ... (simplified nav section)
<div className="hidden items-center gap-6 lg:flex">
  <Link href="/dashboard" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
    Dashboard
  </Link>
  <Link href="/all-music" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
    Ma Musique
  </Link>
</div>
// ... (simplified mobile menu)
```

- [ ] **Step 3: Commit cleanup**
```bash
git add .
git commit -m "refactor: remove marketing pages and simplify header"
```

---

### Task 2: DataContext Enhancement for Hybrid Data

**Files:**
- Modify: `lib/DataContext.tsx`

- [ ] **Step 1: Add metadata state to DataContext**
Update `DataContext` to store metadata (like images) fetched from the API and provide a method to merge this metadata into the stats.

```tsx
// lib/DataContext.tsx
interface Metadata {
  images: Record<string, string> // key could be artistName or trackName
}

interface DataContextProps {
  // ... existing props
  metadata: Metadata
  updateMetadata: (newMetadata: Partial<Metadata>) => void
}

// Inside DataProvider:
const [metadata, setMetadata] = useState<Metadata>({ images: {} })
const updateMetadata = (newMetadata: Partial<Metadata>) => {
  setMetadata(prev => ({ ...prev, ...newMetadata }))
}
```

- [ ] **Step 2: Commit DataContext changes**
```bash
git add lib/DataContext.tsx
git commit -m "feat: add metadata support to DataContext for API enrichment"
```

---

### Task 3: Bento Grid Layout Implementation

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Define the Bento Grid structure**
Rewrite the main content of `app/dashboard/page.tsx` to use a CSS Grid that defines the Bento blocks.

```tsx
// app/dashboard/page.tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-6 lg:gap-6">
  {/* Stat Flash Cards (1x1 each) */}
  <div className="md:col-span-1 md:row-span-1">...</div>
  
  {/* Heatmap (3x2) */}
  <div className="md:col-span-3 md:row-span-2">...</div>

  {/* Spotify Player (1x2) */}
  <div className="md:col-span-1 md:row-span-2">...</div>

  {/* Top Artists (2x3) */}
  <div className="md:col-span-2 md:row-span-3">...</div>

  {/* Top Tracks (2x3) */}
  <div className="md:col-span-2 md:row-span-3">...</div>
</div>
```

- [ ] **Step 2: Refactor Stat Flash cards**
Use the existing `Card` components but style them consistently for the Bento grid.

- [ ] **Step 3: Commit Bento layout**
```bash
git add app/dashboard/page.tsx
git commit -m "feat: implement bento grid layout on dashboard"
```

---

### Task 4: API Enrichment for Top Items

**Files:**
- Modify: `app/dashboard/page.tsx`
- Modify: `lib/hooks/useSpotifyArtistImage.ts` (or create if needed)

- [ ] **Step 1: Fetch images for Top Artists/Tracks**
Inside the Dashboard, if a Spotify token is present, trigger hooks to fetch images for the Top 5 artists and Top 5 tracks.

- [ ] **Step 2: Update Top Lists with Images**
Modify the artist/track items in the dashboard to display the images stored in `DataContext.metadata`.

- [ ] **Step 3: Final verification and commit**
Run: `pnpm build` to ensure no broken imports from deleted pages.
```bash
git add .
git commit -m "feat: enrich dashboard with Spotify API images"
```
