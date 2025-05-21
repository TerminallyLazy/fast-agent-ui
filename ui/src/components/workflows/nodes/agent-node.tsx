"use client"

import { Handle, Position, NodeProps } from '@xyflow/react'
import { Bot } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function AgentNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="rounded-md border bg-card p-3 shadow-sm w-64">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <Bot className="h-5 w-5 text-primary" />
        <div className="font-semibold">{data.label}</div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-2">
        <div className="mb-1">
          <span className="font-medium">Instruction:</span> {data.instruction}
        </div>
        <div className="mb-1">
          <span className="font-medium">Model:</span> {data.model}
        </div>
        {data.servers && data.servers.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="font-medium">Servers:</span>
            {data.servers.map((server: string) => (
              <Badge key={server} variant="outline" className="text-xs">
                {server}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
    </div>
  )
}