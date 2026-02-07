"use client"

import { LayoutDashboard, ListTodo, Settings, ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SidebarOrgSwitcher } from "@/components/workos"

const SIDEBAR_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 72

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Items",
    href: "/dashboard/items",
    icon: ListTodo,
  },
]

const bottomNavItems = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface UserInfo {
  email: string
  name: string
  imageUrl?: string
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)

  const shouldShowExpanded = !isCollapsed || isHovered

  // Fetch user info
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
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive 
            ? "bg-primary/10 text-primary font-medium" 
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          !shouldShowExpanded && "justify-center px-2"
        )}
      >
        <Icon className="size-5 shrink-0" />
        {shouldShowExpanded && <span>{item.title}</span>}
      </Link>
    )

    if (!shouldShowExpanded) {
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-200",
      )}
      style={{ width: shouldShowExpanded ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH }}
    >
      {/* Header */}
      <div className="flex h-14 items-center border-b px-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/images/blue_logo.svg"
            alt="Blueprint"
            width={32}
            height={32}
            className="size-8 shrink-0"
          />
          {shouldShowExpanded && (
            <span className="text-lg font-semibold">Blueprint</span>
          )}
        </Link>
        {shouldShowExpanded && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto size-8"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        )}
      </div>

      {/* Org Switcher */}
      <div className="border-b p-2">
        {shouldShowExpanded ? (
          <SidebarOrgSwitcher />
        ) : (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-full">
                <div className="size-6 rounded bg-primary/20 flex items-center justify-center text-xs font-medium">
                  O
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Organization</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
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
          !shouldShowExpanded && "justify-center"
        )}>
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {shouldShowExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Loading...'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
            </div>
          )}
          {shouldShowExpanded && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={handleSignOut}>
                  <LogOut className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sign out</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </aside>
  )
}
