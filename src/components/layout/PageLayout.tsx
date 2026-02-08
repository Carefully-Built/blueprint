import { Footer } from './Footer';
import { SiteHeader } from './site-header';

import type { LayoutProps } from '@/types';


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
