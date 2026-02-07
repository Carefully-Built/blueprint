import { ChartAreaInteractive } from './_components/chart-area-interactive';
import { SectionCards } from './_components/section-cards';

export default function DashboardPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
      <SectionCards />
      <ChartAreaInteractive />
    </div>
  );
}
