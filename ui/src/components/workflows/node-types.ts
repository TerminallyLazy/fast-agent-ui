export type NodeType =
  | 'agent'
  | 'chain'
  | 'parallel'
  | 'router'
  | 'evaluatorOptimizer'
  | 'orchestrator'
  | 'server'

export interface BaseNodeData {
  nodeType: NodeType
  label: string
}

export interface AgentNodeData extends BaseNodeData {
  nodeType: 'agent'
  instruction: string
  model?: string
  servers: string[]
}

export interface ChainNodeData extends BaseNodeData {
  nodeType: 'chain'
  sequence: string[]
}

export interface ParallelNodeData extends BaseNodeData {
  nodeType: 'parallel'
  fan_out: string[]
  fan_in?: string
}

export interface RouterNodeData extends BaseNodeData {
  nodeType: 'router'
  agents: string[]
}

export interface EvaluatorOptimizerNodeData extends BaseNodeData {
  nodeType: 'evaluatorOptimizer'
  generator: string
  evaluator: string
  min_rating: string | number
  max_refinements: number
}

export interface OrchestratorNodeData extends BaseNodeData {
  nodeType: 'orchestrator'
  plan_type: 'full' | 'iterative'
  agents: string[]
}

export interface ServerNodeData extends BaseNodeData {
  nodeType: 'server'
  name: string
  transport: string
  url?: string
}

export type FastNodeData =
  | AgentNodeData
  | ChainNodeData
  | ParallelNodeData
  | RouterNodeData
  | EvaluatorOptimizerNodeData
  | OrchestratorNodeData
  | ServerNodeData 