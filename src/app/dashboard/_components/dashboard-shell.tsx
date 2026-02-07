'use client';

import { cn } from '@/lib/utils';
import { AppSidebar, SidebarProvider, useSidebar } from './app-sidebar';

function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <main 
      className={cn(
        "min-h-screen transition-all duration-200 ease-in-out",
        isCollapsed ? "pl-16" : "pl-60"
      )}
    >
      <div className="p-4 lg:p-6">
        {children}
      </div>
    </main>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <AppSidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
