"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PlusCircle, Play, Save, Download, Upload } from "lucide-react"

export default function WorkflowsPage() {
  // Sample workflows for demonstration
  const sampleWorkflows = [
    {
      id: "workflow-1",
      name: "Basic Agent",
      description: "A simple agent that responds to user queries",
      lastModified: "2023-05-15T10:30:00Z"
    },
    {
      id: "workflow-2",
      name: "Chain Workflow",
      description: "A chain of agents that process data sequentially",
      lastModified: "2023-05-14T14:45:00Z"
    },
    {
      id: "workflow-3",
      name: "Router Example",
      description: "Routes messages to different agents based on content",
      lastModified: "2023-05-13T09:20:00Z"
    }
  ]

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Agent Workflows</h1>
            <p className="text-muted-foreground mt-1">
              Create, edit, and deploy agent workflows with a visual editor
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/workflows/editor/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Workflow
              </Link>
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleWorkflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <CardTitle>{workflow.name}</CardTitle>
                <CardDescription>{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Last modified: {new Date(workflow.lastModified).toLocaleString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/workflows/editor/${workflow.id}`}>
                    Edit
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}