"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Star, StarOff, Info, Settings, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface ModelConfig {
  id: string
  name: string
  provider: string
  alias: string
  capabilities: string[]
  favorite: boolean
  description?: string
  apiKey?: string
}

export default function ModelsPage() {
  const [models, setModels] = useState<ModelConfig[]>([
    {
      id: "1",
      name: "GPT-4.1",
      provider: "openai",
      alias: "gpt-4.1",
      capabilities: ["text", "vision", "tools"],
      favorite: true,
      description: "OpenAI's most advanced model, capable of understanding images and using tools."
    },
    {
      id: "2",
      name: "GPT-4.1 Mini",
      provider: "openai",
      alias: "gpt-4.1-mini",
      capabilities: ["text", "vision", "tools"],
      favorite: false,
      description: "A smaller, faster version of GPT-4.1 with similar capabilities."
    },
    {
      id: "3",
      name: "Claude 3.7 Sonnet",
      provider: "anthropic",
      alias: "sonnet",
      capabilities: ["text", "vision", "tools"],
      favorite: true,
      description: "Anthropic's advanced model with strong reasoning capabilities."
    },
    {
      id: "4",
      name: "Claude 3.5 Sonnet",
      provider: "anthropic",
      alias: "sonnet35",
      capabilities: ["text", "vision", "tools"],
      favorite: false,
      description: "A balanced model offering strong performance and efficiency."
    },
    {
      id: "5",
      name: "Claude 3.5 Haiku",
      provider: "anthropic",
      alias: "haiku35",
      capabilities: ["text", "vision", "tools"],
      favorite: false,
      description: "A fast, efficient model for quick responses and simple tasks."
    },
    {
      id: "6",
      name: "Playback",
      provider: "internal",
      alias: "playback",
      capabilities: ["text"],
      favorite: false,
      description: "An internal model that replays the first conversation sent to it."
    }
  ])
  
  const [defaultModel, setDefaultModel] = useState("openai.gpt-4.1")
  const [selectedModel, setSelectedModel] = useState<ModelConfig | null>(null)
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")
  
  // Load models and default model from localStorage on initial render
  useEffect(() => {
    const savedModels = localStorage.getItem('fastAgentModels');
    if (savedModels) {
      setModels(JSON.parse(savedModels));
    }
    
    const savedDefaultModel = localStorage.getItem('fastAgentDefaultModel');
    if (savedDefaultModel) {
      setDefaultModel(savedDefaultModel);
    }
  }, []);
  
  // Save models to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fastAgentModels', JSON.stringify(models));
  }, [models]);
  
  // Save default model to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fastAgentDefaultModel', defaultModel);
  }, [defaultModel]);
  
  const toggleFavorite = (id: string) => {
    setModels(prev => prev.map(model => {
      if (model.id === id) {
        return { ...model, favorite: !model.favorite }
      }
      return model
    }));
    
    // Show toast notification
    const model = models.find(m => m.id === id);
    if (model) {
      const isFavorite = !model.favorite;
      toast({
        title: isFavorite ? "Added to favorites" : "Removed from favorites",
        description: `${model.name} has been ${isFavorite ? "added to" : "removed from"} your favorites.`,
        variant: isFavorite ? "default" : "destructive",
      });
    }
  }
  
  const setAsDefault = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (model) {
      const newDefaultModel = `${model.provider}.${model.alias}`;
      setDefaultModel(newDefaultModel);
      
      // Show toast notification
      toast({
        title: "Default model updated",
        description: `${model.name} is now your default model.`,
        variant: "default",
      });
    }
  }
  
  const saveApiKey = () => {
    if (selectedModel && apiKey) {
      setModels(prev => prev.map(model => {
        if (model.id === selectedModel.id) {
          return { ...model, apiKey }
        }
        return model
      }));
      
      // Show toast notification
      toast({
        title: "API Key saved",
        description: `API key for ${selectedModel.name} has been saved.`,
        variant: "default",
      });
      
      setApiKey("");
      setSelectedModel(null);
      setIsApiKeyDialogOpen(false);
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Models</h1>
            <p className="text-muted-foreground">Manage your LLM models</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Default model:</span>
            <Badge variant="outline" className="font-mono">
              {defaultModel}
            </Badge>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Models</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
            <TabsTrigger value="internal">Internal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {models.map((model) => (
                <ModelCard 
                  key={model.id} 
                  model={model} 
                  isDefault={defaultModel === `${model.provider}.${model.alias}`}
                  onToggleFavorite={() => toggleFavorite(model.id)}
                  onSetDefault={() => setAsDefault(model.id)}
                  onConfigureApiKey={() => {
                    setSelectedModel(model)
                    setApiKey(model.apiKey || "")
                    setIsApiKeyDialogOpen(true)
                  }}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {models.filter(model => model.favorite).map((model) => (
                <ModelCard 
                  key={model.id} 
                  model={model} 
                  isDefault={defaultModel === `${model.provider}.${model.alias}`}
                  onToggleFavorite={() => toggleFavorite(model.id)}
                  onSetDefault={() => setAsDefault(model.id)}
                  onConfigureApiKey={() => {
                    setSelectedModel(model)
                    setApiKey(model.apiKey || "")
                    setIsApiKeyDialogOpen(true)
                  }}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="openai" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {models.filter(model => model.provider === "openai").map((model) => (
                <ModelCard 
                  key={model.id} 
                  model={model} 
                  isDefault={defaultModel === `${model.provider}.${model.alias}`}
                  onToggleFavorite={() => toggleFavorite(model.id)}
                  onSetDefault={() => setAsDefault(model.id)}
                  onConfigureApiKey={() => {
                    setSelectedModel(model)
                    setApiKey(model.apiKey || "")
                    setIsApiKeyDialogOpen(true)
                  }}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="anthropic" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {models.filter(model => model.provider === "anthropic").map((model) => (
                <ModelCard 
                  key={model.id} 
                  model={model} 
                  isDefault={defaultModel === `${model.provider}.${model.alias}`}
                  onToggleFavorite={() => toggleFavorite(model.id)}
                  onSetDefault={() => setAsDefault(model.id)}
                  onConfigureApiKey={() => {
                    setSelectedModel(model)
                    setApiKey(model.apiKey || "")
                    setIsApiKeyDialogOpen(true)
                  }}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="internal" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {models.filter(model => model.provider === "internal").map((model) => (
                <ModelCard 
                  key={model.id} 
                  model={model} 
                  isDefault={defaultModel === `${model.provider}.${model.alias}`}
                  onToggleFavorite={() => toggleFavorite(model.id)}
                  onSetDefault={() => setAsDefault(model.id)}
                  onConfigureApiKey={() => {
                    setSelectedModel(model)
                    setApiKey(model.apiKey || "")
                    setIsApiKeyDialogOpen(true)
                  }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure API Key</DialogTitle>
            <DialogDescription>
              {selectedModel && `Set the API key for ${selectedModel.name} (${selectedModel.provider})`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="api-key" className="text-right">
                API Key
              </Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API key"
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApiKeyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveApiKey}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}

interface ModelCardProps {
  model: ModelConfig
  isDefault: boolean
  onToggleFavorite: () => void
  onSetDefault: () => void
  onConfigureApiKey: () => void
}

function ModelCard({ model, isDefault, onToggleFavorite, onSetDefault, onConfigureApiKey }: ModelCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            {model.name}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={model.favorite ? "text-yellow-500" : ""}
                  onClick={onToggleFavorite}
                >
                  {model.favorite ? <Star className="h-5 w-5" /> : <StarOff className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{model.favorite ? "Remove from favorites" : "Add to favorites"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="flex items-center gap-2">
          <span className="capitalize">{model.provider}</span>
          {isDefault && (
            <Badge variant="secondary" className="text-xs">
              Default
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-sm">
          <div className="font-medium mb-1">Alias:</div>
          <code className="bg-muted px-1 py-0.5 rounded text-xs">
            {model.alias}
          </code>
        </div>
        
        {model.description && (
          <div className="mt-3 text-sm text-muted-foreground">
            {model.description}
          </div>
        )}
        
        <div className="mt-3">
          <div className="text-sm font-medium mb-1">Capabilities:</div>
          <div className="flex flex-wrap gap-1">
            {model.capabilities.map((capability) => (
              <Badge key={capability} variant="outline" className="capitalize">
                {capability}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onConfigureApiKey}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure API key</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          variant={isDefault ? "secondary" : "outline"} 
          size="sm"
          onClick={onSetDefault}
          disabled={isDefault}
        >
          {isDefault ? (
            <>
              <Check className="mr-2 h-3 w-3" />
              Default
            </>
          ) : "Set as Default"}
        </Button>
      </CardFooter>
    </Card>
  )
}