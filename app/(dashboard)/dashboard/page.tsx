import type { Metadata } from 'next';

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
        <div key={stat.label} className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold">{stat.value}</p>
            <span className="text-sm text-green-600">{stat.change}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Content Grid */}
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 font-semibold">Recent Activity</h2>
        <p className="text-sm text-muted-foreground">Chart placeholder</p>
      </div>
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 font-semibold">Quick Actions</h2>
        <p className="text-sm text-muted-foreground">Actions placeholder</p>
      </div>
    </div>
  </div>
);

export default DashboardPage;
