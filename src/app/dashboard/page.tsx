import { ChartAreaInteractive } from './_components/chart-area-interactive';
import { DataTable } from './_components/data-table';
import { SectionCards } from './_components/section-cards';
import data from './data.json';

export default function DashboardPage(): React.ReactElement {
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={data} />
    </>
  );
}
