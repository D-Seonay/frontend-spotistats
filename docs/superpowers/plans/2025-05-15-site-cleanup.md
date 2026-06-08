# Site Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove unnecessary marketing routes and simplify the navigation in `Header.tsx` to focus on the core application (Dashboard and All Music).

**Architecture:** Deletion of Next.js route directories and simplification of navigation components.

**Tech Stack:** Next.js, React, Tailwind CSS.

---

### Task 1: Remove unnecessary routes

**Files:**
- Delete: `app/about/`
- Delete: `app/blog/`
- Delete: `app/careers/`
- Delete: `app/faq/`
- Delete: `app/features/`
- Delete: `app/pricing/`
- Delete: `app/privacy/`
- Delete: `app/terms/`
- Delete: `app/cookies/`

- [ ] **Step 1: Delete the directories**

Run: `powershell -Command "Remove-Item -Recurse -Force app/about, app/blog, app/careers, app/faq, app/features, app/pricing, app/privacy, app/terms, app/cookies"`

- [ ] **Step 2: Verify deletion**

Run: `ls app`
Expected: The deleted directories should no longer be listed.

- [ ] **Step 3: Commit deletion**

```bash
git add app/
git commit -m "refactor: remove marketing routes"
```

### Task 2: Simplify Header navigation

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: Update imports and state**
Remove `ChevronDown` from `lucide-react` and remove the `productDropdownOpen` state.

- [ ] **Step 2: Simplify navigation section**
Replace the complex dropdown and list of links with just "Dashboard" and "Ma Musique".

```tsx
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          <Link href="/dashboard" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
            Dashboard
          </Link>
          <Link href="/all-music" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
            Ma Musique
          </Link>
        </div>
```

- [ ] **Step 3: Simplify mobile menu**
Update the mobile menu to match the desktop navigation.

```tsx
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/dashboard"
              className="block text-gray-300 transition-colors hover:text-[#1DB954]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/all-music"
              className="block text-gray-300 transition-colors hover:text-[#1DB954]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ma Musique
            </Link>
            <Button
              className="w-full rounded-full bg-[#1DB954] text-black font-semibold transition-all hover:bg-[#1ed760]"
              onClick={handleLogin}
            >
              Se connecter avec Spotify
            </Button>
          </div>
        </div>
      )}
```

- [ ] **Step 4: Commit header changes**

```bash
git add components/Header.tsx
git commit -m "refactor: simplify header navigation"
```

### Task 3: Cleanup Footer (Bonus/Integrity)

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Remove broken links from Footer**
Remove the "Produit", "Entreprise", and "Légal" sections that link to deleted pages. Keep only the logo and description.

- [ ] **Step 2: Commit footer changes**

```bash
git add components/Footer.tsx
git commit -m "refactor: remove broken links from footer"
```
