"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Check } from "lucide-react"

// Define the settings interface
interface Settings {
  apiKey: string;
  defaultModel: string;
  showProgress: boolean;
  showChat: boolean;
  showTools: boolean;
  temperature: string;
  humanInput: boolean;
}

export default function SettingsPage() {
  // Initialize settings with default values
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    defaultModel: "openai.gpt-4.1",
    showProgress: true,
    showChat: true,
    showTools: true,
    temperature: "0.7",
    humanInput: true
  });
  
  const [isSaved, setIsSaved] = useState(false);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('fastAgentSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Handle input changes
  const handleChange = (key: keyof Settings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setIsSaved(false);
  };

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('fastAgentSettings', JSON.stringify(settings));
    setIsSaved(true);
    
    // Reset the saved indicator after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your Fast Agent configuration</p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your Fast Agent environment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">OpenAI API Key</Label>
                  <Input 
                    id="api-key" 
                    type="password" 
                    placeholder="sk-..." 
                    value={settings.apiKey}
                    onChange={(e) => handleChange('apiKey', e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="human-input">Human Input</Label>
                    <p className="text-sm text-muted-foreground">Allow agent to request human input</p>
                  </div>
                  <Switch 
                    id="human-input" 
                    checked={settings.humanInput}
                    onCheckedChange={(checked) => handleChange('humanInput', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="models">
            <Card>
              <CardHeader>
                <CardTitle>Model Settings</CardTitle>
                <CardDescription>Configure model preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-model">Default Model</Label>
                  <Select 
                    value={settings.defaultModel} 
                    onValueChange={(value) => handleChange('defaultModel', value)}
                  >
                    <SelectTrigger id="default-model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai.gpt-4.1">OpenAI GPT-4.1</SelectItem>
                      <SelectItem value="openai.gpt-4.1-mini">OpenAI GPT-4.1 Mini</SelectItem>
                      <SelectItem value="anthropic.claude-3-7-sonnet-latest">Claude 3.7 Sonnet</SelectItem>
                      <SelectItem value="anthropic.claude-3-5-sonnet-latest">Claude 3.5 Sonnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input 
                    id="temperature" 
                    type="number" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={settings.temperature}
                    onChange={(e) => handleChange('temperature', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls randomness: 0 is deterministic, 1 is maximum creativity
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Configure UI preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-progress">Progress Display</Label>
                    <p className="text-sm text-muted-foreground">Show progress indicators</p>
                  </div>
                  <Switch 
                    id="show-progress" 
                    checked={settings.showProgress}
                    onCheckedChange={(checked) => handleChange('showProgress', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-chat">Show Chat</Label>
                    <p className="text-sm text-muted-foreground">Display chat messages in console</p>
                  </div>
                  <Switch 
                    id="show-chat" 
                    checked={settings.showChat}
                    onCheckedChange={(checked) => handleChange('showChat', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-tools">Show Tools</Label>
                    <p className="text-sm text-muted-foreground">Display tool calls in console</p>
                  </div>
                  <Switch 
                    id="show-tools" 
                    checked={settings.showTools}
                    onCheckedChange={(checked) => handleChange('showTools', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button 
            onClick={saveSettings}
            className="relative"
          >
            {isSaved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : "Save Settings"}
            
            {isSaved && (
              <span className="absolute inset-0 animate-ping bg-primary/20 rounded-md" />
            )}
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}