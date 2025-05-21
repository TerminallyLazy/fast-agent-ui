import { Handle, Position } from '@xyflow/react'

import { AgentNode } from './agent-node'
import { ChainNode } from './chain-node'
import { ParallelNode } from './parallel-node'
import { RouterNode } from './router-node'
import { EvaluatorOptimizerNode } from './evaluator-optimizer-node'
import { OrchestratorNode } from './orchestrator-node'
import { ServerNode } from './server-node'

export function FastNode(props: any) {
  const { data } = props as any
  switch (data.nodeType) {
    case 'agent':
      return <AgentNode {...props} />
    case 'chain':
      return <ChainNode {...props} />
    case 'parallel':
      return <ParallelNode {...props} />
    case 'router':
      return <RouterNode {...props} />
    case 'evaluatorOptimizer':
      return <EvaluatorOptimizerNode {...props} />
    case 'orchestrator':
      return <OrchestratorNode {...props} />
    case 'server':
      return <ServerNode {...props} />
    default:
      // Fallback simple node
      return (
        <div className="rounded-md px-4 py-2 bg-card text-card-foreground border border-border shadow-[0_0_8px_hsl(var(--accent))]">
          <span className="whitespace-nowrap text-sm font-medium">{data.label}</span>
          <Handle type="source" position={Position.Right} id="r" className="!bg-accent" />
          <Handle type="target" position={Position.Left} id="l" className="!bg-primary" />
        </div>
      )
  }
} 