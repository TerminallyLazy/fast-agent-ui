"use client"

import { useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ServerType = "stdio" | "http" | "sse"

interface ServerConfig {
  name: string
  status: "running" | "stopped" | "error"
  command?: string
  args?: string[]
  url?: string
  type: ServerType
  error?: string
  lastRestart?: Date
}

interface AddServerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddServer: (server: Omit<ServerConfig, "id">) => void
}

export function AddServerDialog({ open, onOpenChange, onAddServer }: AddServerDialogProps) {
  const [serverType, setServerType] = useState<ServerType>("stdio")
  const [name, setName] = useState("")
  const [command, setCommand] = useState("npx")
  const [args, setArgs] = useState("")
  const [url, setUrl] = useState("")
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name) return
    
    if (serverType === "stdio") {
      if (!command || !args) return
      
      onAddServer({
        name,
        type: serverType,
        command,
        args: args.split(" "),
        status: "running"
      })
    } else {
      if (!url) return
      
      onAddServer({
        name,
        type: serverType,
        url,
        status: "running"
      })
    }
    
    // Reset form
    setName("")
    setCommand("npx")
    setArgs("")
    setUrl("")
    setServerType("stdio")
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add MCP Server</DialogTitle>
            <DialogDescription>
              Configure a new Model Context Protocol server.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., filesystem"
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Type</Label>
              <Select value={serverType} onValueChange={(value) => setServerType(value as ServerType)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select server type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stdio">STDIO</SelectItem>
                  <SelectItem value="http">HTTP</SelectItem>
                  <SelectItem value="sse">SSE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs value={serverType} className="mt-2">
              <TabsContent value="stdio" className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="command" className="text-right">
                    Command
                  </Label>
                  <Input
                    id="command"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="e.g., npx"
                    className="col-span-3"
                    required={serverType === "stdio"}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="args" className="text-right">
                    Arguments
                  </Label>
                  <Input
                    id="args"
                    value={args}
                    onChange={(e) => setArgs(e.target.value)}
                    placeholder="e.g., -y @modelcontextprotocol/server-filesystem"
                    className="col-span-3"
                    required={serverType === "stdio"}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="http" className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="e.g., http://localhost:8080/mcp"
                    className="col-span-3"
                    required={serverType === "http" || serverType === "sse"}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="sse" className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url-sse" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="url-sse"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="e.g., http://localhost:8080/sse"
                    className="col-span-3"
                    required={serverType === "http" || serverType === "sse"}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Server</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}