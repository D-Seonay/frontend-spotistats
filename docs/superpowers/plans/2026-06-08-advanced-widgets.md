# Advanced Widgets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create three new widgets (`ListeningHabitsWidget`, `LoyaltyWidget`, `TemporalTrendsWidget`) in `components/widgets/`.

**Architecture:** Functional React components using Tailwind CSS and `recharts` for visualization.

**Tech Stack:** React, Tailwind CSS, Recharts, TypeScript.

---

### Task 1: ListeningHabitsWidget

**Files:**
- Create: `components/widgets/ListeningHabitsWidget.tsx`
- Test: `lib/widgets.test.tsx` (or new test file)

- [ ] **Step 1: Implement `ListeningHabitsWidget.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, SkipForward } from "lucide-react";
import { AdvancedStats } from "@/lib/types";

interface ListeningHabitsWidgetProps {
  stats: AdvancedStats;
}

export function ListeningHabitsWidget({ stats }: ListeningHabitsWidgetProps) {
  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Habitudes d'écoute</CardTitle>
        <CardDescription>Ton comportement d'écoute</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg">
          <Clock className="h-6 w-6 text-[#1DB954] mb-2" />
          <span className="text-2xl font-bold">{stats.peakListeningHour}h</span>
          <span className="text-xs text-gray-400">Heure de pointe</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg">
          <SkipForward className="h-6 w-6 text-[#1DB954] mb-2" />
          <span className="text-2xl font-bold">{stats.skipIndex.toFixed(2)}</span>
          <span className="text-xs text-gray-400">Indice de saut</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/widgets/ListeningHabitsWidget.tsx
git commit -m "feat: add ListeningHabitsWidget"
```

### Task 2: LoyaltyWidget

**Files:**
- Create: `components/widgets/LoyaltyWidget.tsx`

- [ ] **Step 1: Implement `LoyaltyWidget.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, Calendar } from "lucide-react";
import { AdvancedStats } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

interface LoyaltyWidgetProps {
  stats: AdvancedStats;
}

export function LoyaltyWidget({ stats }: LoyaltyWidgetProps) {
  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Fidélité</CardTitle>
        <CardDescription>Ton engagement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
          <Award className="h-8 w-8 text-[#1DB954]" />
          <div>
            <p className="text-sm text-gray-400">Artiste préféré</p>
            <p className="font-bold">{stats.topLoyalArtist.name || "N/A"}</p>
            <p className="text-xs text-gray-500">{stats.topLoyalArtist.plays} écoutes</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Ratio week-end</span>
            <span>{(stats.weekendListenRatio * 100).toFixed(0)}%</span>
          </div>
          <Progress value={stats.weekendListenRatio * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/widgets/LoyaltyWidget.tsx
git commit -m "feat: add LoyaltyWidget"
```

### Task 3: TemporalTrendsWidget

**Files:**
- Create: `components/widgets/TemporalTrendsWidget.tsx`

- [ ] **Step 1: Implement `TemporalTrendsWidget.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ParsedStats } from "@/lib/types";

interface TemporalTrendsWidgetProps {
  dailyData: ParsedStats["dailyData"];
}

export function TemporalTrendsWidget({ dailyData }: TemporalTrendsWidgetProps) {
  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Tendances</CardTitle>
        <CardDescription>Ton écoute au fil du temps</CardDescription>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyData}>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip contentStyle={{ backgroundColor: '#181818', border: 'none' }} />
            <Line type="monotone" dataKey="minutes" stroke="#1DB954" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/widgets/TemporalTrendsWidget.tsx
git commit -m "feat: add TemporalTrendsWidget"
```

### Task 4: Export Widgets

**Files:**
- Create: `components/widgets/index.ts`

- [ ] **Step 1: Create index file**

```tsx
export * from './ListeningHabitsWidget';
export * from './LoyaltyWidget';
export * from './TemporalTrendsWidget';
```

- [ ] **Step 2: Commit**

```bash
git add components/widgets/index.ts
git commit -m "chore: export widgets"
```
