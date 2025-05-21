"use client"

import { Handle, Position, NodeProps } from '@xyflow/react'
import { Server } from 'lucide-react'

export function ServerNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="rounded-md border bg-card p-3 shadow-sm w-64">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <Server className="h-5 w-5 text-primary" />
        <div className="font-semibold">{data.label}</div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-2">
        <div className="mb-1">
          <span className="font-medium">Name:</span> {data.name}
        </div>
        <div className="mb-1">
          <span className="font-medium">Transport:</span> {data.transport}
        </div>
        {data.url && (
          <div className="mb-1">
            <span className="font-medium">URL:</span> {data.url}
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