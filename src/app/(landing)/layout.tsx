import type { LayoutProps } from '@/types';

import { SiteHeader } from '@/components/layout/site-header';

const LandingLayout = ({ children }: LayoutProps): React.ReactElement => (
  <div className="relative flex min-h-screen flex-col">
    <SiteHeader />
    <main className="flex-1">{children}</main>
    <footer className="border-t py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <p>© 2026 Blueprint. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

export default LandingLayout;
