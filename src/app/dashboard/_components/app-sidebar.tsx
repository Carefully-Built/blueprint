"use client"

import { LayoutDashboard, ListTodo, Settings, PanelLeftClose, PanelLeft, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, createContext, useContext } from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SidebarOrgSwitcher } from "@/components/workos"

const SIDEBAR_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 64

// Context to share sidebar state with layout
export const SidebarContext = createContext<{
  isCollapsed: boolean
  setIsCollapsed: (v: boolean) => void
}>({ isCollapsed: false, setIsCollapsed: () => {} })

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

interface UserInfo {
  email: string
  name: string
  imageUrl?: string
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed, setIsCollapsed } = useSidebar()
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    fetch('/api/auth/user')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setUser({
            email: data.user.email,
            name: `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || data.user.email,
            imageUrl: data.user.profilePictureUrl,
          })
        }
      })
      .catch(() => setUser(null))
  }, [])

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/')
  }

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    const content = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
          isActive 
            ? "bg-primary/10 text-primary font-medium" 
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Icon className="size-5 shrink-0" />
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
      <div className="flex h-14 items-center gap-2 border-b px-3">
        <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
          <Image
            src="/images/blue_logo.svg"
            alt="Blueprint"
            width={32}
            height={32}
            className="size-8 shrink-0"
          />
          {!isCollapsed && (
            <span className="text-lg font-semibold truncate">Blueprint</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-8 shrink-0", isCollapsed ? "mx-auto" : "ml-auto")}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
      </div>

      {/* Org Switcher - always visible */}
      <div className="border-b p-2">
        <SidebarOrgSwitcher collapsed={isCollapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t p-2 space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>

      {/* User Profile */}
      <div className="border-t p-2">
        <div className={cn(
          "flex items-center gap-3 rounded-lg p-2",
          isCollapsed && "justify-center"
        )}>
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || 'Loading...'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
              </div>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={handleSignOut}>
                    <LogOut className="size-4" />
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
  
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}
