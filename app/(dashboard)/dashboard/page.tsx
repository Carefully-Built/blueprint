import type { Metadata } from 'next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';


export const metadata: Metadata = {
  title: 'Dashboard',
};

const stats = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%' },
  { label: 'Subscriptions', value: '2,350', change: '+180.1%' },
  { label: 'Active Users', value: '12,234', change: '+19%' },
  { label: 'Conversion Rate', value: '3.2%', change: '+4.3%' },
];

const DashboardPage = (): React.ReactElement => (
  <div className="space-y-8">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
    </div>

    {/* Stats Grid */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardDescription>{stat.label}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-green-600">{stat.change}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Content Grid */}
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Chart placeholder</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Actions placeholder</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default DashboardPage;
