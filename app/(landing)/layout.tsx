import type { LayoutProps } from '@/types';

const LandingLayout = ({ children }: LayoutProps): React.ReactElement => (
  <div className="relative flex min-h-screen flex-col">
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-xl">Blueprint</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </a>
          <a
            href="/sign-in"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign In
          </a>
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
