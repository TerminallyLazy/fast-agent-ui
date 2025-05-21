"use client"

import { useState, FormEvent, KeyboardEvent, useRef, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, X, Mic, Image } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if ((message.trim() || files.length > 0) && !isLoading) {
      onSendMessage(message, files.length > 0 ? files : undefined)
      setMessage("")
      setFiles([])
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const toggleRecording = () => {
    // This would be implemented with actual Web Audio API
    setIsRecording(!isRecording)
    if (isRecording) {
      // Stop recording and process audio
      setIsRecording(false)
      // Simulate adding transcribed text
      setMessage(prev => prev + " [Transcribed audio would appear here]")
    } else {
      // Start recording
      setIsRecording(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div 
              key={index} 
              className="flex items-center gap-1 bg-secondary rounded-full pl-2 pr-1 py-1 text-xs"
            >
              <span className="truncate max-w-[150px]">{file.name}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 rounded-full"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline" 
                  className="rounded-full h-9 w-9 flex-shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
            multiple 
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  size="icon" 
                  variant={isRecording ? "default" : "outline"}
                  className={cn(
                    "rounded-full h-9 w-9 flex-shrink-0",
                    isRecording && "bg-destructive text-destructive-foreground"
                  )}
                  onClick={toggleRecording}
                >
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Record audio</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRecording ? "Stop recording" : "Record audio"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-10 resize-none"
          disabled={isLoading}
        />
        
        <Button 
          type="submit" 
          size="icon" 
          disabled={(!message.trim() && files.length === 0) || isLoading}
          className="rounded-full h-9 w-9 flex-shrink-0"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  )
}