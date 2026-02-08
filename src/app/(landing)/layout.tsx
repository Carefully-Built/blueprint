import type { LayoutProps } from '@/types';

import { PageLayout } from '@/components/layout/PageLayout';

export default function LandingLayout({ children }: LayoutProps): React.ReactElement {
  return <PageLayout>{children}</PageLayout>;
}
