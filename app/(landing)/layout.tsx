import Link from 'next/link';

import type { LayoutProps } from '@/types';

import { Button } from '@/components/ui/button';


const LandingLayout = ({ children }: LayoutProps): React.ReactElement => (
  <div className="relative flex min-h-screen flex-col">
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
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
      <div className="container flex items-center justify-between text-sm text-muted-foreground">
        <p>© 2026 Blueprint. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

export default LandingLayout;
