'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { LayoutProps } from '@/types';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { dashboardNav } from '@/config/site';


const NavItems = ({ pathname }: { pathname: string }): React.ReactElement => (
  <>
    {dashboardNav.main.map((item) => (
      <Button
        key={item.href}
        variant={pathname === item.href ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        asChild
      >
        <Link href={item.href}>{item.title}</Link>
      </Button>
    ))}
  </>
);

const DashboardLayout = ({ children }: LayoutProps): React.ReactElement => {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-muted/30 lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="text-lg font-semibold">
            Blueprint
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          <NavItems pathname={pathname} />
        </nav>
        <Separator />
        <div className="p-4">
          {dashboardNav.secondary?.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              asChild
            >
              <Link href={item.href}>{item.title}</Link>
            </Button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <span className="sr-only">Open menu</span>
                ☰
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="border-b px-6 py-4">
                <SheetTitle>Blueprint</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                <NavItems pathname={pathname} />
              </nav>
            </SheetContent>
          </Sheet>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
