"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, MoreVertical, Trash2, Download, MessageSquare, Calendar, Filter } from "lucide-react"

interface Conversation {
  id: string
  title: string
  date: string
  preview: string
  messages: number
  model?: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Data Analysis Task",
      date: "2023-06-15",
      preview: "Can you help me analyze this dataset?",
      messages: 12,
      model: "openai.gpt-4.1"
    },
    {
      id: "2",
      title: "Code Review",
      date: "2023-06-14",
      preview: "Please review this Python function",
      messages: 8,
      model: "anthropic.claude-3-7-sonnet-latest"
    },
    {
      id: "3",
      title: "Research on ML Models",
      date: "2023-06-12",
      preview: "What are the latest developments in transformer models?",
      messages: 15,
      model: "openai.gpt-4.1"
    },
    {
      id: "4",
      title: "Project Planning",
      date: "2023-06-10",
      preview: "Help me create a project plan for my new app",
      messages: 20,
      model: "anthropic.claude-3-5-sonnet-latest"
    },
    {
      id: "5",
      title: "Bug Troubleshooting",
      date: "2023-06-08",
      preview: "I'm getting this error in my React component",
      messages: 10,
      model: "openai.gpt-4.1-mini"
    }
  ])
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "longest">("newest")
  
  // Load conversations from localStorage on initial render
  useEffect(() => {
    const savedConversations = localStorage.getItem('fastAgentConversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fastAgentConversations', JSON.stringify(conversations));
  }, [conversations]);
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => 
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort conversations based on sort order
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return b.messages - a.messages;
    }
  });
  
  // Continue conversation
  const continueConversation = (id: string) => {
    // In a real app, this would load the conversation into the chat page
    router.push(`/chat?conversation=${id}`);
  };
  
  // Delete conversation
  const deleteConversation = () => {
    if (selectedConversation) {
      const conversationToDelete = conversations.find(c => c.id === selectedConversation);
      
      setConversations(prev => prev.filter(c => c.id !== selectedConversation));
      setSelectedConversation(null);
      setIsDeleteDialogOpen(false);
      
      if (conversationToDelete) {
        toast({
          title: "Conversation deleted",
          description: `"${conversationToDelete.title}" has been deleted.`,
          variant: "destructive",
        });
      }
    }
  };
  
  // Download conversation
  const downloadConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    
    if (conversation) {
      // In a real app, this would download the actual conversation content
      const content = `Title: ${conversation.title}\nDate: ${conversation.date}\nModel: ${conversation.model}\nMessages: ${conversation.messages}\n\nPreview: ${conversation.preview}`;
      
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `conversation-${conversation.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Conversation downloaded",
        description: `"${conversation.title}" has been downloaded.`,
        variant: "default",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Conversation History</h1>
          <p className="text-muted-foreground">View and continue your past conversations</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("longest")}>
                Most Messages
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedConversations.map((conversation) => (
            <Card 
              key={conversation.id} 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => continueConversation(conversation.id)}
            >
              <CardHeader className="pb-2 flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="line-clamp-1">{conversation.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {conversation.date}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      continueConversation(conversation.id);
                    }}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Continue
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      downloadConversation(conversation.id);
                    }}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedConversation(conversation.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{conversation.preview}</p>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {conversation.messages} messages
                  </div>
                  {conversation.model && (
                    <div className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                      {conversation.model.split('.')[0]}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No conversations found</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery ? `No conversations matching "${searchQuery}"` : "Start a new conversation to see it here"}
            </p>
            <Button 
              className="mt-4" 
              onClick={() => router.push('/chat')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              New Conversation
            </Button>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteConversation}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}