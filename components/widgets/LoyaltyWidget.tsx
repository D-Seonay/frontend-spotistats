import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award } from "lucide-react";
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
