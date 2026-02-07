'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { LayoutProps } from '@/types';

import { dashboardNav } from '@/config/site';
import { cn } from '@/lib/utils';


const DashboardLayout = ({ children }: LayoutProps): React.ReactElement => {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-muted/30 lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="text-lg font-semibold">
            Blueprint
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {dashboardNav.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t p-4">
          {dashboardNav.secondary?.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <button type="button" className="lg:hidden">
            Menu
          </button>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-muted-foreground">User</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
