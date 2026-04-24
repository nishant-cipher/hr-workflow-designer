import { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
  type ReactFlowInstance,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '../../store/workflowStore';
import { createDefaultNodeData } from '../../lib/nodeDefaults';
import type { NodeType } from '../../types';
import StartNode from '../nodes/StartNode';
import TaskNode from '../nodes/TaskNode';
import ApprovalNode from '../nodes/ApprovalNode';
import { AutomatedNode, EndNode } from '../nodes/OtherNodes';

const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

let dropIdCounter = 1;

export function WorkflowCanvas() {
  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    setSelectedNodeId, addNode,
  } = useWorkflowStore();

  const rfInstance = useRef<ReactFlowInstance | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onNodeClick = useCallback((_: React.MouseEvent, node: { id: string }) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType') as NodeType;
    if (!type || !rfInstance.current || !wrapperRef.current) return;

    const bounds = wrapperRef.current.getBoundingClientRect();
    const position = rfInstance.current.project({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });

    const id = `node_${Date.now()}_${dropIdCounter++}`;
    addNode({ id, type, position, data: createDefaultNodeData(type) });
    setSelectedNodeId(id);
  }, [addNode, setSelectedNodeId]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Keyboard: Delete selected node
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && e.target === document.body) {
        // ReactFlow handles this natively
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div ref={wrapperRef} style={{ flex: 1, height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={(instance) => { rfInstance.current = instance; }}
        fitView
        deleteKeyCode="Delete"
        style={{ background: '#f8fafc' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#cbd5e1" />
        <Controls style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
        <MiniMap
          nodeStrokeWidth={3}
          style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 }}
          nodeColor={(n) => {
            const colorMap: Record<string, string> = {
              start: '#10b981', task: '#3b82f6', approval: '#f59e0b', automated: '#8b5cf6', end: '#f43f5e'
            };
            return colorMap[n.type || ''] || '#94a3b8';
          }}
        />
        {nodes.length === 0 && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗂️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#64748b', fontFamily: '"DM Sans", sans-serif' }}>Drop nodes here to start</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>Drag from the sidebar or click a node type to add</div>
          </div>
        )}
      </ReactFlow>
    </div>
  );
}
