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
