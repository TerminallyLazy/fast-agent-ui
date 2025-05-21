"use client"

import { useState, useRef, useEffect } from "react"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  RefreshCw, 
  Download, 
  Trash2,
  ChevronDown,
  Info
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { sendMessageToAgent, startNewConversation } from "@/services/agent-service"
import { useSearchParams } from "next/navigation"

export type Message = {
  id: string
  role: "user" | "assistant" | "system" | "tool"
  content: string
  timestamp: Date
  toolName?: string
}

export function ChatInterface() {
  const searchParams = useSearchParams()
  const conversationId = searchParams.get('conversation')
  
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("openai.gpt-4.1")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settings, setSettings] = useState({
    streamResponse: true,
    showThinking: true,
    temperature: 0.7,
    maxTokens: 4000
  })

  // Initialize messages or load from localStorage
  useEffect(() => {
    // If there's a conversation ID, try to load that conversation
    if (conversationId) {
      const savedConversations = localStorage.getItem('fastAgentConversations')
      if (savedConversations) {
        const conversations = JSON.parse(savedConversations)
        const conversation = conversations.find((c: any) => c.id === conversationId)
        if (conversation) {
          // In a real app, we would load the actual conversation messages
          // For now, we'll just create a new conversation with the title
          const initialMessages = startNewConversation()
          initialMessages.push({
            id: Date.now().toString(),
            role: "system",
            content: `Continuing conversation: ${conversation.title}`,
            timestamp: new Date()
          })
          setMessages(initialMessages)
          
          // Set the model if available
          if (conversation.model) {
            setSelectedModel(conversation.model)
          }
          
          return
        }
      }
    }
    
    // Otherwise, load from localStorage or start new conversation
    const savedMessages = localStorage.getItem('fastAgentMessages')
    if (savedMessages) {
      try {
        // Parse the saved messages and convert string timestamps back to Date objects
        const parsedMessages = JSON.parse(savedMessages, (key, value) => {
          if (key === 'timestamp') return new Date(value)
          return value
        })
        setMessages(parsedMessages)
      } catch (error) {
        console.error('Failed to parse saved messages:', error)
        setMessages(startNewConversation())
      }
    } else {
      setMessages(startNewConversation())
    }
    
    // Load selected model from localStorage
    const savedModel = localStorage.getItem('fastAgentDefaultModel')
    if (savedModel) {
      setSelectedModel(savedModel)
    }
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('fastAgentSettings')
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        if (parsedSettings.temperature !== undefined) {
          setSettings(prev => ({
            ...prev,
            temperature: parsedSettings.temperature,
            maxTokens: parsedSettings.maxTokens || prev.maxTokens,
            streamResponse: parsedSettings.streamResponse !== undefined ? parsedSettings.streamResponse : prev.streamResponse,
            showThinking: parsedSettings.showThinking !== undefined ? parsedSettings.showThinking : prev.showThinking
          }))
        }
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
  }, [conversationId])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fastAgentMessages', JSON.stringify(messages))
  }, [messages])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content || (files && files.length > 0 ? `[Uploaded ${files.length} file(s)]` : ""),
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    
    try {
      // Send message to agent
      const response = await sendMessageToAgent({
        message: content,
        model: selectedModel,
        history: messages,
        settings: {
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          streamResponse: settings.streamResponse
        }
      })
      
      // Add response to messages
      setMessages(prev => [...prev, response])
      
      // If this was a tool response, simulate an assistant response after
      if (response.role === "tool") {
        setTimeout(async () => {
          const assistantResponse = await sendMessageToAgent({
            message: `Tool response: ${response.content}`,
            model: selectedModel,
            history: [...messages, userMessage, response],
            settings: {
              temperature: settings.temperature,
              maxTokens: settings.maxTokens,
              streamResponse: settings.streamResponse
            }
          })
          
          setMessages(prev => [...prev, {
            ...assistantResponse,
            role: "assistant"
          }])
        }, 1000)
      }
    } catch (error) {
      console.error("Error sending message to agent:", error)
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "system",
        content: "There was an error communicating with the agent. Please try again.",
        timestamp: new Date()
      }])
      
      toast({
        title: "Error",
        description: "Failed to communicate with the agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearConversation = () => {
    setMessages(startNewConversation())
    
    toast({
      title: "Conversation cleared",
      description: "All messages have been removed.",
      variant: "default",
    })
  }

  const downloadConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.role.toUpperCase()} (${msg.timestamp.toLocaleString()}): ${msg.content}`)
      .join("\n\n")
    
    const blob = new Blob([conversationText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fast-agent-conversation-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Conversation downloaded",
      description: "Your conversation has been saved as a text file.",
      variant: "default",
    })
    
    // Also save to conversation history
    const savedConversations = localStorage.getItem('fastAgentConversations')
    let conversations = savedConversations ? JSON.parse(savedConversations) : []
    
    // Find the first user message to use as preview
    const firstUserMessage = messages.find(m => m.role === "user")
    
    // Add to conversations if not already there
    if (!conversationId) {
      const newConversation = {
        id: Date.now().toString(),
        title: firstUserMessage ? firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "") : "New Conversation",
        date: new Date().toISOString().split('T')[0],
        preview: firstUserMessage ? firstUserMessage.content : "Empty conversation",
        messages: messages.filter(m => m.role !== "system").length,
        model: selectedModel
      }
      
      conversations.unshift(newConversation)
      localStorage.setItem('fastAgentConversations', JSON.stringify(conversations))
    }
  }

  const regenerateResponse = async () => {
    // Find the last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === "user")
    
    if (lastUserMessageIndex !== -1) {
      // Get the actual index in the original array
      const actualIndex = messages.length - 1 - lastUserMessageIndex
      const userMessage = messages[actualIndex]
      
      // Remove all messages after the user message
      const newMessages = messages.slice(0, actualIndex + 1)
      setMessages(newMessages)
      
      // Set loading state
      setIsLoading(true)
      
      try {
        // Send message to agent again
        const response = await sendMessageToAgent({
          message: userMessage.content,
          model: selectedModel,
          history: newMessages,
          settings: {
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
            streamResponse: settings.streamResponse
          }
        })
        
        // Add response to messages
        setMessages(prev => [...prev, response])
        
        toast({
          title: "Response regenerated",
          description: "A new response has been generated.",
          variant: "default",
        })
      } catch (error) {
        console.error("Error regenerating response:", error)
        
        // Add error message
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "system",
          content: "There was an error regenerating the response. Please try again.",
          timestamp: new Date()
        }])
        
        toast({
          title: "Error",
          description: "Failed to regenerate response. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const saveSettings = () => {
    // Save settings to localStorage
    const savedSettings = localStorage.getItem('fastAgentSettings') || '{}'
    const parsedSettings = JSON.parse(savedSettings)
    
    const updatedSettings = {
      ...parsedSettings,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      streamResponse: settings.streamResponse,
      showThinking: settings.showThinking
    }
    
    localStorage.setItem('fastAgentSettings', JSON.stringify(updatedSettings))
    setIsSettingsOpen(false)
    
    toast({
      title: "Settings saved",
      description: "Your chat settings have been updated.",
      variant: "default",
    })
  }

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai.gpt-4.1">OpenAI GPT-4.1</SelectItem>
              <SelectItem value="openai.gpt-4.1-mini">OpenAI GPT-4.1 Mini</SelectItem>
              <SelectItem value="anthropic.claude-3-7-sonnet-latest">Claude 3.7 Sonnet</SelectItem>
              <SelectItem value="anthropic.claude-3-5-sonnet-latest">Claude 3.5 Sonnet</SelectItem>
            </SelectContent>
          </Select>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Current model: {selectedModel}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chat settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={regenerateResponse}
                  disabled={isLoading || messages.filter(m => m.role === "assistant").length === 0}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Regenerate response</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={downloadConversation}
                  disabled={messages.length <= 1}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearConversation}
                  disabled={messages.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && settings.showThinking && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="flex space-x-1">
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
            </div>
            <div>Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-1 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full flex items-center justify-center text-xs text-muted-foreground"
          onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
        >
          <ChevronDown className="h-3 w-3 mr-1" />
          Scroll to bottom
        </Button>
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      
      {/* Chat Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat Settings</DialogTitle>
            <DialogDescription>
              Configure how the chat interface behaves
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="stream-response">Stream Response</Label>
                <p className="text-sm text-muted-foreground">Show response as it's being generated</p>
              </div>
              <Switch 
                id="stream-response" 
                checked={settings.streamResponse}
                onCheckedChange={(checked) => setSettings({...settings, streamResponse: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-thinking">Show Thinking</Label>
                <p className="text-sm text-muted-foreground">Display thinking indicators while generating</p>
              </div>
              <Switch 
                id="show-thinking" 
                checked={settings.showThinking}
                onCheckedChange={(checked) => setSettings({...settings, showThinking: checked})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <div className="flex items-center gap-2">
                <input 
                  id="temperature" 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={settings.temperature}
                  onChange={(e) => setSettings({...settings, temperature: parseFloat(e.target.value)})}
                  className="flex-1"
                />
                <span className="w-10 text-center">{settings.temperature}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Controls randomness: 0 is deterministic, 1 is maximum creativity
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-tokens">Max Tokens</Label>
              <div className="flex items-center gap-2">
                <input 
                  id="max-tokens" 
                  type="range" 
                  min="1000" 
                  max="8000" 
                  step="1000" 
                  value={settings.maxTokens}
                  onChange={(e) => setSettings({...settings, maxTokens: parseInt(e.target.value)})}
                  className="flex-1"
                />
                <span className="w-16 text-center">{settings.maxTokens}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum number of tokens in the response
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSettings}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}