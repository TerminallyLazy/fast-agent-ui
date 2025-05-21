"use client"

import { Handle, Position, NodeProps } from '@xyflow/react'
import { GitMerge } from 'lucide-react'

export function EvaluatorOptimizerNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="rounded-md border bg-card p-3 shadow-sm w-64">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <GitMerge className="h-5 w-5 text-primary" />
        <div className="font-semibold">{data.label}</div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-2">
        <div className="mb-1">
          <span className="font-medium">Generator:</span> {data.generator || 'None'}
        </div>
        <div className="mb-1">
          <span className="font-medium">Evaluator:</span> {data.evaluator || 'None'}
        </div>
        <div className="mb-1">
          <span className="font-medium">Min Rating:</span> {data.min_rating}
        </div>
        <div className="mb-1">
          <span className="font-medium">Max Refinements:</span> {data.max_refinements}
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