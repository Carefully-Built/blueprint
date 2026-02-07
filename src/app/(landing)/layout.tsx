import Link from 'next/link';

import type { LayoutProps } from '@/types';

import { Button } from '@/components/ui/button';


const LandingLayout = ({ children }: LayoutProps): React.ReactElement => (
  <div className="relative flex min-h-screen flex-col">
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">Blueprint</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </nav>
      </div>
    </header>
    <main className="flex-1">{children}</main>
    <footer className="border-t py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <p>© 2026 Blueprint. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

export default LandingLayout;
