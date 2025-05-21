"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { useParams } from "next/navigation"
import { WorkflowEditor } from "@/components/workflows/workflow-editor"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Play, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function WorkflowEditorPage() {
  const params = useParams()
  const workflowId = params.id as string
  const isNewWorkflow = workflowId === "new"
  const [isTesting, setIsTesting] = useState(false)

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/workflows">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">
              {isNewWorkflow ? "Create New Workflow" : "Edit Workflow"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsTesting(!isTesting)}>
              <Play className="mr-2 h-4 w-4" />
              Test
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0" style={{ height: 'calc(100vh - 10rem)' }}>
          {isTesting ? (
            <ChatInterface />
          ) : (
            <WorkflowEditor workflowId={workflowId} />
          )}
        </div>
      </div>
    </MainLayout>
  )
}