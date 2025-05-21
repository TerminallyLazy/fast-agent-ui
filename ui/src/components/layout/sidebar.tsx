"use client"

import { cn } from "@/lib/utils"
import {
  Home,
  MessageSquare,
  Settings,
  History,
  FileText,
  Server,
  Database,
  ChevronLeft,
  ChevronRight,
  Zap,
  GitBranch
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      name: "Dashboard",
      path: "/",
      icon: Home
    },
    {
      name: "Chat",
      path: "/chat",
      icon: MessageSquare
    },
    {
      name: "Workflows",
      path: "/workflows",
      icon: GitBranch
    },
    {
      name: "History",
      path: "/history",
      icon: History
    },
    {
      name: "Files",
      path: "/files",
      icon: FileText
    },
    {
      name: "Servers",
      path: "/servers",
      icon: Server
    },
    {
      name: "Models",
      path: "/models",
      icon: Database
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings
    }
  ]

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-card transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
        )}
      >
        <div className={cn(
          "flex h-16 items-center border-b px-6",
          !isOpen && "md:justify-center md:px-0"
        )}>
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            {isOpen && <h2 className="text-lg font-semibold">Fast Agent</h2>}
          </div>
        </div>
        <nav className="flex-1 overflow-auto p-4">
          <ul className="space-y-2">
            {routes.map((route) => {
              const Icon = route.icon
              const isActive = pathname === route.path

              return (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      !isOpen && "md:justify-center md:px-0"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                    {isOpen && <span>{route.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="border-t p-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex w-full justify-center"
            onClick={onToggle}
          >
            {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  )
}