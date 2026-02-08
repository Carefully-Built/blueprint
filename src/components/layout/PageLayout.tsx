import type { LayoutProps } from '@/types';

import { SiteHeader } from './site-header';
import { Footer } from './Footer';

interface PageLayoutProps extends LayoutProps {
  /** Whether to show the footer. Defaults to true. */
  showFooter?: boolean;
}

export function PageLayout({ 
  children, 
  showFooter = true 
}: PageLayoutProps): React.ReactElement {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
