"use client"

import { useCallback, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowInstance,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { NodePanel } from './node-panel'
import { FastNode } from './nodes/FastNode'
import { NodePropertiesPanel } from './node-properties-panel'
import type { FastNodeData } from './node-types'

// Type-only imports
import type { Connection, Node, Edge } from '@xyflow/react'

// Define initial nodes and edges for different workflows
const getInitialNodes = (workflowId: string): Node[] => {
  switch (workflowId) {
    case 'workflow-1':
      return [
        {
          id: '1',
          type: 'fast',
          data: { label: 'Basic Agent', nodeType: 'agent' },
          position: { x: 250, y: 100 }
        }
      ]
    case 'workflow-2':
      return [
        {
          id: '1',
          type: 'fast',
          data: { label: 'Agent 1', nodeType: 'agent' },
          position: { x: 100, y: 100 }
        },
        {
          id: '2',
          type: 'fast',
          data: { label: 'Agent 2', nodeType: 'agent' },
          position: { x: 400, y: 100 }
        },
        {
          id: '3',
          type: 'fast',
          data: { label: 'Chain Workflow', nodeType: 'chain' },
          position: { x: 250, y: 300 }
        }
      ]
    case 'new':
    default:
      return [
        {
          id: '1',
          type: 'fast',
          data: { label: 'Start Here', nodeType: 'chain' },
          position: { x: 250, y: 100 }
        }
      ]
  }
}

const getInitialEdges = (workflowId: string): Edge[] => {
  let edges: Edge[] = []
  switch (workflowId) {
    case 'workflow-2':
      edges = [
        { id: 'e1-3', source: '1', target: '3' },
        { id: 'e2-3', source: '2', target: '3' }
      ]
      break
    default:
      edges = []
  }
  // Apply accent styling to initial edges
  return edges.map((e) => ({
    ...e,
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 2 }
  }))
}

interface WorkflowEditorProps {
  workflowId: string
}

export function WorkflowEditor({ workflowId }: WorkflowEditorProps) {
  // Initialize nodes and edges based on workflow ID
  const initialNodes = getInitialNodes(workflowId)
  const initialEdges = getInitialEdges(workflowId)

  // Set up state for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Track selected node for properties editing
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Wrapper ref to calculate drop position
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)
  // Keep a reference to the ReactFlow instance so we can convert screen coords to flow coords
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<Node, Edge> | null>(null)

  // Handle connections between nodes with styled edges
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) =>
      addEdge({
        ...params,
        style: { stroke: 'hsl(var(--accent))', strokeWidth: 2 }
      }, eds)
    ),
    [setEdges]
  )

  // Add a new node to the canvas with correct handles and type metadata
  const onAddNode = useCallback((nodeType: string, nodeData: any) => {
    console.log('Adding node:', nodeType, nodeData)

    const mappedType = 'fast'
    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      type: mappedType,
      data: {
        ...nodeData,
        nodeType: nodeData.nodeType ?? nodeType,
      },
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50,
      },
    }

    setNodes((nds) => [...nds, newNode])
  }, [nodes, setNodes])

  // Allow dropping external nodes onto the canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()

    if (!reactFlowInstance || !reactFlowWrapper.current) return

    const bounds = reactFlowWrapper.current.getBoundingClientRect()
    const data = event.dataTransfer.getData('application/reactflow')
    if (!data) return

    try {
      const parsed = JSON.parse(data) as { type: string; data: any }
      const position = (reactFlowInstance as any).project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })

      const newNode: Node = {
        id: `node-${nodes.length + 1}`,
        type: 'fast',
        position,
        data: {
          ...parsed.data,
          nodeType: parsed.data.nodeType ?? parsed.type,
        },
      }

      setNodes((nds) => nds.concat(newNode))
    } catch (err) {
      console.error('Error parsing dropped node data', err)
    }
  }, [reactFlowInstance, nodes.length, setNodes])

  // Handle node click to select for editing
  const onNodeClick = useCallback((_event: any, node: Node) => {
    setSelectedNodeId(node.id)
  }, [])

  // Update node data when edited in properties panel
  const handleNodeDataUpdate = useCallback((updatedData: Partial<FastNodeData>) => {
    if (!selectedNodeId) return
    setNodes((nds) => nds.map((n) => n.id === selectedNodeId ? { ...n, data: { ...n.data, ...updatedData } } : n))
  }, [selectedNodeId, setNodes])

  return (
    <div className="reactflow-gradient-border w-full h-full">
      <div
        ref={reactFlowWrapper}
        className="reactflow-inner"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <ReactFlow
          style={{ background: 'transparent' }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onNodeClick={onNodeClick}
          onPaneClick={() => setSelectedNodeId(null)}
          // Only allow valid Fast Agent connections
          isValidConnection={(connection) => {
            const sourceNode = nodes.find((n) => n.id === connection.source)
            const targetNode = nodes.find((n) => n.id === connection.target)
            if (!sourceNode || !targetNode) return false
            const sourceType = sourceNode.data.nodeType as string
            const targetType = targetNode.data.nodeType as string
            const outgoingAllowed = ['agent', 'chain', 'parallel', 'router', 'evaluatorOptimizer', 'orchestrator'].includes(sourceType)
            const incomingAllowed = ['chain', 'parallel', 'router', 'evaluatorOptimizer', 'orchestrator', 'server'].includes(targetType)
            return outgoingAllowed && incomingAllowed
          }}
          connectionLineStyle={{ stroke: 'hsl(var(--accent))', strokeWidth: 2 }}
          fitView
          nodeTypes={{ fast: FastNode }}
        >
          <Controls />
          <MiniMap
            nodeStrokeColor="hsl(var(--border))"
            nodeColor={() => 'hsl(var(--card))'}
            maskColor="rgba(0, 0, 0, 0.6)"
          />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Panel position="top-left">
            <NodePanel onAddNode={onAddNode} />
          </Panel>
          {selectedNodeId && (
            <Panel position="top-right">
              <NodePropertiesPanel
                node={nodes.find((n) => n.id === selectedNodeId) as Node<any>}
                onChange={handleNodeDataUpdate}
              />
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  )
}