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
