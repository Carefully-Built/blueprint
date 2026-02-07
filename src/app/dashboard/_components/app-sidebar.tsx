"use client"

import { LayoutDashboard, ListTodo, Settings, ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, createContext, useContext } from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SidebarOrgSwitcher } from "@/components/workos"
import { signOutAction } from "@/app/(auth)/actions"

const SIDEBAR_WIDTH = 220
const SIDEBAR_COLLAPSED_WIDTH = 56

// Context to share sidebar state with layout
export const SidebarContext = createContext<{
  isCollapsed: boolean
  setIsCollapsed: (v: boolean) => void
  refreshOrg: () => void
}>({ isCollapsed: false, setIsCollapsed: () => undefined, refreshOrg: () => undefined })

export function useSidebar() {
  return useContext(SidebarContext)
}

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Items", href: "/dashboard/items", icon: ListTodo },
]

const bottomNavItems = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]


export interface UserInfo {
  email: string
  name: string
  imageUrl?: string
}

interface AppSidebarProps {
  user: UserInfo | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed } = useSidebar()

  const handleSignOut = async () => {
    await signOutAction();
  }

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    const content = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
          isActive 
            ? "bg-accent text-accent-foreground" 
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Icon className="size-4 shrink-0" />
        {!isCollapsed && <span>{item.title}</span>}
      </Link>
    )

    if (isCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
      )
    }

    return content
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-200 ease-in-out",
      )}
      style={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
    >
      {/* Header */}
      <div className="flex h-12 items-center gap-2 px-2">
        <Link href="/dashboard" className="flex items-center gap-2 min-w-0 flex-1">
          <Image
            src="/images/blue_logo.svg"
            alt="Blueprint"
            width={28}
            height={28}
            className="size-7 shrink-0"
          />
          {!isCollapsed && (
            <span className="text-base font-semibold truncate">Blueprint</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>

      {/* Org Switcher */}
      <div className="px-2 pb-2">
        <SidebarOrgSwitcher collapsed={isCollapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-2 py-2 space-y-0.5">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>

      {/* User Profile */}
      <div className="border-t px-2 py-2">
        <div className={cn(
          "flex items-center gap-2.5 rounded-md p-1.5",
          isCollapsed && "justify-center"
        )}>
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate leading-tight">{user?.name || 'Loading...'}</p>
                <p className="text-xs text-muted-foreground truncate leading-tight">{user?.email || ''}</p>
              </div>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={() => { void handleSignOut() }}>
                    <LogOut className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sign out</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}

// Provider component
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const refreshOrg = () => {
    window.dispatchEvent(new CustomEvent('org-updated'));
  }
  
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, refreshOrg }}>
      {children}
    </SidebarContext.Provider>
  )
}
