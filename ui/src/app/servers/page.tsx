"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Server, Plus, RefreshCw, Trash2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { AddServerDialog } from "@/components/servers/add-server-dialog"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"

type ServerType = "stdio" | "http" | "sse"

interface ServerConfig {
  id: string
  name: string
  status: "running" | "stopped" | "error"
  command?: string
  args?: string[]
  url?: string
  type: ServerType
  error?: string
  lastRestart?: Date
}

export default function ServersPage() {
  const [servers, setServers] = useState<ServerConfig[]>([
    {
      id: "1",
      name: "filesystem",
      status: "running",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/lazy/Projects/", "/home/lazy/Downloads/"],
      type: "stdio"
    },
    {
      id: "2",
      name: "brave",
      status: "running",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-brave-search"],
      type: "stdio"
    },
    {
      id: "3",
      name: "context7",
      status: "running",
      command: "npx",
      args: ["-y", "@upstash/context7-mcp@latest"],
      type: "stdio"
    },
    {
      id: "4",
      name: "memory",
      status: "error",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-memory"],
      type: "stdio",
      error: "Failed to start server: Command not found"
    },
    {
      id: "5",
      name: "remote-api",
      status: "running",
      url: "http://api.example.com/mcp",
      type: "http"
    }
  ])
  
  const [isAddServerOpen, setIsAddServerOpen] = useState(false)
  const [serverToDelete, setServerToDelete] = useState<string | null>(null)

  // Load servers from localStorage on initial render
  useEffect(() => {
    const savedServers = localStorage.getItem('fastAgentServers');
    if (savedServers) {
      setServers(JSON.parse(savedServers));
    }
  }, []);

  // Save servers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fastAgentServers', JSON.stringify(servers));
  }, [servers]);

  const toggleServerStatus = (id: string) => {
    setServers(prev => prev.map(server => {
      if (server.id === id) {
        const newStatus = server.status === "running" ? "stopped" : "running";
        
        // Show toast notification
        toast({
          title: newStatus === "running" ? "Server started" : "Server stopped",
          description: `${server.name} server has been ${newStatus === "running" ? "started" : "stopped"}.`,
          variant: newStatus === "running" ? "default" : "destructive",
        });
        
        return {
          ...server,
          status: newStatus,
          lastRestart: newStatus === "running" ? new Date() : server.lastRestart
        };
      }
      return server;
    }));
  }

  const restartServer = (id: string) => {
    setServers(prev => prev.map(server => {
      if (server.id === id) {
        // Show toast notification
        toast({
          title: "Server restarted",
          description: `${server.name} server has been restarted.`,
          variant: "default",
        });
        
        return {
          ...server,
          status: "running",
          error: undefined,
          lastRestart: new Date()
        };
      }
      return server;
    }));
  }

  const deleteServer = () => {
    if (serverToDelete) {
      const serverToRemove = servers.find(s => s.id === serverToDelete);
      
      setServers(prev => prev.filter(server => server.id !== serverToDelete));
      setServerToDelete(null);
      
      // Show toast notification
      if (serverToRemove) {
        toast({
          title: "Server removed",
          description: `${serverToRemove.name} server has been removed.`,
          variant: "destructive",
        });
      }
    }
  }

  const addServer = (server: Omit<ServerConfig, "id">) => {
    const newServer: ServerConfig = {
      ...server,
      id: Date.now().toString(),
      status: "running",
      lastRestart: new Date()
    };
    
    setServers(prev => [...prev, newServer]);
    setIsAddServerOpen(false);
    
    // Show toast notification
    toast({
      title: "Server added",
      description: `${newServer.name} server has been added.`,
      variant: "default",
    });
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">MCP Servers</h1>
            <p className="text-muted-foreground">Manage your Model Context Protocol servers</p>
          </div>
          <Button onClick={() => setIsAddServerOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Server
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {servers.map((server) => (
            <Card key={server.id} className={server.status === "error" ? "border-destructive/50" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Server className="mr-2 h-5 w-5" />
                    {server.name}
                  </CardTitle>
                  <Switch 
                    checked={server.status === "running"} 
                    onCheckedChange={() => toggleServerStatus(server.id)}
                    disabled={server.status === "error"}
                  />
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {server.type}
                  </Badge>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${
                      server.status === "running" ? "bg-success" : 
                      server.status === "error" ? "bg-destructive" : 
                      "bg-warning"
                    }`} />
                    <span className="text-xs capitalize">{server.status}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {server.type === "stdio" && server.command && (
                    <>
                      <div className="font-medium">Command:</div>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {server.command} {server.args?.join(" ")}
                      </code>
                    </>
                  )}
                  
                  {server.type !== "stdio" && server.url && (
                    <>
                      <div className="font-medium">URL:</div>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {server.url}
                      </code>
                    </>
                  )}
                  
                  {server.error && (
                    <div className="mt-2 text-xs text-destructive flex items-start gap-1">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{server.error}</span>
                    </div>
                  )}
                  
                  {server.lastRestart && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Last restart: {new Date(server.lastRestart).toLocaleString()}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => restartServer(server.id)}
                      >
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Restart
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Restart server</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Dialog open={serverToDelete === server.id} onOpenChange={(open) => {
                  if (!open) setServerToDelete(null);
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive"
                      onClick={() => setServerToDelete(server.id)}
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Remove
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Remove Server</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to remove the "{server.name}" server? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setServerToDelete(null)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={deleteServer}>
                        Remove
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <AddServerDialog 
        open={isAddServerOpen} 
        onOpenChange={setIsAddServerOpen}
        onAddServer={addServer}
      />
    </MainLayout>
  )
}