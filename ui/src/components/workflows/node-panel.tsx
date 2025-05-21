"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { GitBranch, Server, Bot, Router, GitMerge, GitFork, Brain } from 'lucide-react'

interface NodePanelProps {
  onAddNode: (nodeType: string, nodeData: any) => void
}

export function NodePanel({ onAddNode }: NodePanelProps) {
  const [activeTab, setActiveTab] = useState('agents')

  const agentNodes = [
    {
      type: 'agent',
      label: 'Basic Agent',
      description: 'A simple agent that responds to user queries',
      icon: Bot,
      data: {
        nodeType: 'agent',
        label: 'Basic Agent',
        instruction: '',
        model: '',
        servers: [] as string[],
      }
    }
  ]

  const workflowNodes = [
    {
      type: 'chain',
      label: 'Chain',
      description: 'Chain multiple agents together in sequence',
      icon: GitBranch,
      data: {
        nodeType: 'chain',
        label: 'Chain Workflow',
        sequence: [] as string[],
      }
    },
    {
      type: 'router',
      label: 'Router',
      description: 'Route messages to different agents based on content',
      icon: Router,
      data: {
        nodeType: 'router',
        label: 'Router Workflow',
        agents: [] as string[],
      }
    },
    {
      type: 'parallel',
      label: 'Parallel',
      description: 'Run multiple agents in parallel and combine results',
      icon: GitFork,
      data: {
        nodeType: 'parallel',
        label: 'Parallel Workflow',
        fan_out: [] as string[],
        fan_in: '',
      }
    },
    {
      type: 'evaluatorOptimizer',
      label: 'Evaluator-Optimizer',
      description: 'Generate and evaluate content with feedback loop',
      icon: GitMerge,
      data: {
        nodeType: 'evaluatorOptimizer',
        label: 'Evaluator-Optimizer',
        generator: '',
        evaluator: '',
        min_rating: '',
        max_refinements: 0,
      }
    },
    {
      type: 'orchestrator',
      label: 'Orchestrator',
      description: 'Coordinate complex tasks across multiple agents',
      icon: Brain,
      data: {
        nodeType: 'orchestrator',
        label: 'Orchestrator',
        plan_type: 'full',
        agents: [] as string[],
      }
    }
  ]

  const serverNodes = [
    {
      type: 'server',
      label: 'MCP Server',
      description: 'Connect to an MCP server for additional capabilities',
      icon: Server,
      data: {
        nodeType: 'server',
        label: 'MCP Server',
        name: '',
        transport: '',
        url: '',
      }
    }
  ]

  return (
    <Card className="w-64">
      <CardHeader className="pb-3">
        <CardTitle>Add Nodes</CardTitle>
        <CardDescription>
          Drag and drop nodes to build your workflow
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="agents" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="servers">Servers</TabsTrigger>
        </TabsList>
        <TabsContent value="agents" className="p-0">
          <CardContent className="space-y-2 pt-3">
            {agentNodes.map((node) => (
              <Button
                key={node.type}
                variant="outline"
                className="w-full justify-start"
                onClick={() => onAddNode(node.type, node.data)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', JSON.stringify(node))
                  e.dataTransfer.effectAllowed = 'move'
                }}
              >
                <node.icon className="mr-2 h-4 w-4" />
                {node.label}
              </Button>
            ))}
          </CardContent>
        </TabsContent>
        <TabsContent value="workflows" className="p-0">
          <CardContent className="space-y-2 pt-3">
            {workflowNodes.map((node) => (
              <Button
                key={node.type}
                variant="outline"
                className="w-full justify-start"
                onClick={() => onAddNode(node.type, node.data)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', JSON.stringify(node))
                  e.dataTransfer.effectAllowed = 'move'
                }}
              >
                <node.icon className="mr-2 h-4 w-4" />
                {node.label}
              </Button>
            ))}
          </CardContent>
        </TabsContent>
        <TabsContent value="servers" className="p-0">
          <CardContent className="space-y-2 pt-3">
            {serverNodes.map((node) => (
              <Button
                key={node.type}
                variant="outline"
                className="w-full justify-start"
                onClick={() => onAddNode(node.type, node.data)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', JSON.stringify(node))
                  e.dataTransfer.effectAllowed = 'move'
                }}
              >
                <node.icon className="mr-2 h-4 w-4" />
                {node.label}
              </Button>
            ))}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}