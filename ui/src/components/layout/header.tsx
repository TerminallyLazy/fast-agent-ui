"use client"

import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  Bell, 
  User, 
  Search,
  Zap,
  LogOut,
  Settings,
  UserCircle,
  Key
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  toggleSidebar: () => void
}

interface Notification {
  id: string
  title: string
  description: string
  time: Date
  read: boolean
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Welcome to Fast Agent UI",
      description: "Thanks for trying out the Fast Agent UI. We hope you enjoy it!",
      time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false
    },
    {
      id: "2",
      title: "New model available",
      description: "Claude 3.7 Sonnet is now available for use in the Fast Agent UI.",
      time: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: false
    },
    {
      id: "3",
      title: "Server status",
      description: "All MCP servers are running correctly.",
      time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true
    }
  ]);
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read.",
      variant: "default",
    });
  };
  
  // Mark a single notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    setIsNotificationsOpen(false);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been removed.",
      variant: "default",
    });
  };
  
  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };
  
  // Handle logout
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
      variant: "default",
    });
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="hidden md:flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Fast Agent UI</h1>
        </div>
        <div className="hidden md:flex ml-6">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-8 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => setIsNotificationsOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
        
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Key className="mr-2 h-4 w-4" />
              API Keys
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Notifications Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              {notifications.length > 0 
                ? "Your recent notifications are shown below." 
                : "You have no notifications."}
            </DialogDescription>
          </DialogHeader>
          
          {notifications.length > 0 ? (
            <>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg border ${notification.read ? 'bg-background' : 'bg-secondary/50'}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(notification.time)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
                <Button variant="destructive" onClick={clearNotifications}>
                  Clear all
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notifications to display</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </header>
  )
}