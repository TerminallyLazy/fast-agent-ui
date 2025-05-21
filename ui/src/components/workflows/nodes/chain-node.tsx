"use client"

import { Handle, Position, NodeProps } from '@xyflow/react'
import { GitBranch } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function ChainNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="rounded-md border bg-card p-3 shadow-sm w-64">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="h-5 w-5 text-primary" />
        <div className="font-semibold">{data.label}</div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-2">
        <div className="mb-1">
          <span className="font-medium">Sequence:</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {data.sequence && data.sequence.length > 0 ? (
            data.sequence.map((agent: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {agent}
              </Badge>
            ))
          ) : (
            <span className="text-xs italic">No agents in sequence</span>
          )}
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