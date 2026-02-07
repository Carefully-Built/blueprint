import { ChartAreaInteractive } from './_components/chart-area-interactive';
import { SectionCards } from './_components/section-cards';

export default function DashboardPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business metrics</p>
      </div>
      <SectionCards />
      <ChartAreaInteractive />
    </div>
  );
}
