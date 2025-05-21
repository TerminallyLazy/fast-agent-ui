"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Message } from "./chat-interface"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  
  const isUser = message.role === "user"
  const isSystem = message.role === "system"
  const isTool = message.role === "tool"
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className={cn(
      "group relative",
      isUser ? "justify-end text-right ml-12" : "justify-start mr-12"
    )}>
      <div className="flex items-start gap-3">
        {!isUser && (
          <Avatar className="h-8 w-8 mt-1">
            {isTool ? (
              <AvatarImage src="/tool-avatar.png" alt="Tool" />
            ) : (
              <AvatarImage src="/bot-avatar.png" alt="Agent" />
            )}
            <AvatarFallback className={isTool ? "bg-info text-info-foreground" : "bg-primary text-primary-foreground"}>
              {isTool ? "T" : "A"}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {isUser ? "You" : isTool ? message.toolName : "Assistant"}
            </span>
            {isTool && (
              <Badge variant="outline" className="text-xs bg-info/10 text-info border-info/20">
                Tool
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
          
          <div className={cn(
            "rounded-lg px-4 py-2",
            isUser 
              ? "bg-primary text-primary-foreground" 
              : isSystem
                ? "bg-muted text-muted-foreground"
                : isTool
                  ? "bg-info/10 text-foreground border border-info/20"
                  : "bg-card text-card-foreground border"
          )}>
            <div className="break-words whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        </div>
        
        {isUser && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src="/user-avatar.png" alt="User" />
            <AvatarFallback className="bg-accent text-accent-foreground">U</AvatarFallback>
          </Avatar>
        )}
      </div>
      
      {!isSystem && (
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy message"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}