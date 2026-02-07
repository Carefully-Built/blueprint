"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up" as const,
  },
  {
    title: "Subscriptions",
    value: "2,350",
    change: "+180",
    trend: "up" as const,
  },
  {
    title: "Active Users",
    value: "12,234",
    change: "+19%",
    trend: "up" as const,
  },
  {
    title: "Conversion",
    value: "3.2%",
    change: "-0.4%",
    trend: "down" as const,
  },
]

export function SectionCards() {
  return (
    <div className="grid gap-4 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`mt-1 text-xs ${
              stat.trend === "up" 
                ? "text-emerald-600 dark:text-emerald-400" 
                : "text-red-600 dark:text-red-400"
            }`}>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
