"use client"

import { Handle, Position, NodeProps } from '@xyflow/react'
import { GitFork } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function ParallelNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="rounded-md border bg-card p-3 shadow-sm w-64">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <GitFork className="h-5 w-5 text-primary" />
        <div className="font-semibold">{data.label}</div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-2">
        <div className="mb-1">
          <span className="font-medium">Fan Out:</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {data.fan_out && data.fan_out.length > 0 ? (
            data.fan_out.map((agent: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {agent}
              </Badge>
            ))
          ) : (
            <span className="text-xs italic">No fan-out agents</span>
          )}
        </div>
        
        <div className="mt-2 mb-1">
          <span className="font-medium">Fan In:</span> {data.fan_in || 'None'}
        </div>
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