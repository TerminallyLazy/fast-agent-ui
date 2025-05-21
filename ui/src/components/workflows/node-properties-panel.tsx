"use client"

import React, { ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Node } from '@xyflow/react'

import type {
  FastNodeData,
  AgentNodeData,
  ChainNodeData,
  ParallelNodeData,
  RouterNodeData,
  EvaluatorOptimizerNodeData,
  OrchestratorNodeData,
  ServerNodeData,
} from './node-types'

interface NodePropertiesPanelProps {
  node: Node<any>
  onChange: (updatedData: Partial<FastNodeData>) => void
}

// Helper to render a basic text input
function TextField({
  label,
  value,
  name,
  onChange,
}: {
  label: string
  value?: string | number
  name: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium leading-none" htmlFor={name}>
        {label}
      </label>
      <Input
        id={name}
        name={name}
        value={value === undefined ? '' : value}
        onChange={onChange}
      />
    </div>
  )
}

// Helper to render textarea for array values (comma separated)
function ListField({
  label,
  value,
  name,
  onChange,
}: {
  label: string
  value?: string[]
  name: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium leading-none" htmlFor={name}>
        {label}
      </label>
      <Textarea
        id={name}
        name={name}
        rows={3}
        value={value && value.length > 0 ? value.join(', ') : ''}
        onChange={onChange}
        placeholder="comma, separated, values"
      />
    </div>
  )
}

export function NodePropertiesPanel({ node, onChange }: NodePropertiesPanelProps) {
  if (!node) return null

  const data = node.data

  // Generic change handler
  const handleInputChange = (
    field: string,
    parser: (value: string) => any = (v) => v,
  ) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = e.target.value
      onChange({ [field]: parser(raw) } as Partial<FastNodeData>)
    }

  // For numeric fields
  const numberParser = (v: string) => (v === '' ? '' : Number(v))
  // For array fields
  const listParser = (v: string) =>
    v === '' ? [] : v.split(',').map((s) => s.trim()).filter(Boolean)

  switch (data.nodeType) {
    case 'agent': {
      const agentData = data as AgentNodeData
      return (
        <div className="p-4 w-64 space-y-4 bg-card rounded-md border shadow-md">
          <h3 className="font-semibold">Agent Properties</h3>
          <TextField
            label="Label"
            name="label"
            value={agentData.label}
            onChange={handleInputChange('label')}
          />
          <TextField
            label="Instruction"
            name="instruction"
            value={agentData.instruction}
            onChange={handleInputChange('instruction')}
          />
          <TextField
            label="Model"
            name="model"
            value={agentData.model ?? ''}
            onChange={handleInputChange('model')}
          />
          <ListField
            label="Servers"
            name="servers"
            value={agentData.servers}
            onChange={handleInputChange('servers', listParser) as any}
          />
        </div>
      )
    }
    case 'chain': {
      const chainData = data as ChainNodeData
      return (
        <div className="p-4 w-64 space-y-4 bg-card rounded-md border shadow-md">
          <h3 className="font-semibold">Chain Properties</h3>
          <TextField
            label="Label"
            name="label"
            value={chainData.label}
            onChange={handleInputChange('label')}
          />
          <ListField
            label="Sequence"
            name="sequence"
            value={chainData.sequence}
            onChange={handleInputChange('sequence', listParser) as any}
          />
        </div>
      )
    }
    case 'parallel': {
      const parallelData = data as ParallelNodeData
      return (
        <div className="p-4 w-64 space-y-4 bg-card rounded-md border shadow-md">
          <h3 className="font-semibold">Parallel Properties</h3>
          <TextField
            label="Label"
            name="label"
            value={parallelData.label}
            onChange={handleInputChange('label')}
          />
          <ListField
            label="Fan Out"
            name="fan_out"
            value={parallelData.fan_out}
            onChange={handleInputChange('fan_out', listParser) as any}
          />
          <TextField
            label="Fan In"
            name="fan_in"
            value={parallelData.fan_in ?? ''}
            onChange={handleInputChange('fan_in')}
          />
        </div>
      )
    }
    case 'router': {
      const routerData = data as RouterNodeData
      return (
        <div className="p-4 w-64 space-y-4 bg-card rounded-md border shadow-md">
          <h3 className="font-semibold">Router Properties</h3>
          <TextField
            label="Label"
            name="label"
            value={routerData.label}
            onChange={handleInputChange('label')}
          />
          <ListField
            label="Agents"
            name="agents"
            value={routerData.agents}
            onChange={handleInputChange('agents', listParser) as any}
          />
        </div>
      )
    }
    case 'evaluatorOptimizer': {
      const evalData = data as EvaluatorOptimizerNodeData
      return (
        <div className="p-4 w-64 space-y-4 bg-card rounded-md border shadow-md">
          <h3 className="font-semibold">Evaluator & Optimizer Properties</h3>
          <TextField
            label="Label"
            name="label"
            value={evalData.label}
            onChange={handleInputChange('label')}
          />
          <TextField
            label="Generator"
            name="generator"
            value={evalData.generator}
            onChange={handleInputChange('generator')}
          />
          <TextField
            label="Evaluator"
            name="evaluator"
            value={evalData.evaluator}
            onChange={handleInputChange('evaluator')}
          />
          <TextField
            label="Min Rating"
            name="min_rating"
            value={evalData.min_rating}
            onChange={handleInputChange('min_rating')}
          />
          <TextField
            label="Max Refinements"
            name="max_refinements"
            value={evalData.max_refinements}
            onChange={handleInputChange('max_refinements', numberParser)}
          />
        </div>
      )
    }
    case 'orchestrator': {
      const orchData = data as OrchestratorNodeData
      return (
        <div className="p-4 w-64 space-y-4 bg-card rounded-md border shadow-md">
          <h3 className="font-semibold">Orchestrator Properties</h3>
          <TextField
            label="Label"
            name="label"
            value={orchData.label}
            onChange={handleInputChange('label')}
          />
          {/* Plan type select */}
          <div className="space-y-1">
            <label className="text-sm font-medium leading-none" htmlFor="plan_type">
              Plan Type
            </label>
            <Select
              value={orchData.plan_type}
              onValueChange={(v) => onChange({ plan_type: v as OrchestratorNodeData['plan_type'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">full</SelectItem>
                <SelectItem value="iterative">iterative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ListField
            label="Agents"
            name="agents"
            value={orchData.agents}
            onChange={handleInputChange('agents', listParser) as any}
          />
        </div>
      )
    }
    case 'server': {
      const serverData = data as ServerNodeData
      return (
        <div className="p-4 w-64 space-y-4 bg-card rounded-md border shadow-md">
          <h3 className="font-semibold">Server Properties</h3>
          <TextField
            label="Label"
            name="label"
            value={serverData.label}
            onChange={handleInputChange('label')}
          />
          <TextField
            label="Name"
            name="name"
            value={serverData.name}
            onChange={handleInputChange('name')}
          />
          <TextField
            label="Transport"
            name="transport"
            value={serverData.transport}
            onChange={handleInputChange('transport')}
          />
          <TextField
            label="URL"
            name="url"
            value={serverData.url ?? ''}
            onChange={handleInputChange('url')}
          />
        </div>
      )
    }
    default:
      return null
  }
} 