import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface StatCardWidgetProps {
  title: string
  value: string | number
  icon: ReactNode
}

export function StatCardWidget({ title, value, icon }: StatCardWidgetProps) {
  return (
    <Card className="h-full border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-[#1DB954]">{value}</p>
      </CardContent>
    </Card>
  )
}
