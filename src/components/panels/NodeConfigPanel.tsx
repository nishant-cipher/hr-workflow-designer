import { useWorkflowStore } from '../../store/workflowStore';
import { StartForm, TaskForm, ApprovalForm, AutomatedForm, EndForm } from '../forms/NodeForms';
import { NODE_COLORS } from '../../lib/nodeDefaults';
import { Trash2, X } from 'lucide-react';
import type { WorkflowNodeData } from '../../types';

const TYPE_LABELS: Record<string, string> = {
  start: 'Start Node', task: 'Task Node', approval: 'Approval Node', automated: 'Automated Step', end: 'End Node'
};

export function NodeConfigPanel() {
  const { nodes, selectedNodeId, setSelectedNodeId, deleteNode } = useWorkflowStore();
  const node = nodes.find(n => n.id === selectedNodeId);

  if (!node) return null;

  const data = node.data as WorkflowNodeData;
  const colors = NODE_COLORS[data.type];

  return (
    <div style={{
      width: 300,
      background: '#fff',
      borderLeft: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"DM Sans", sans-serif',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        background: colors.bg,
        borderBottom: `3px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.border, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{TYPE_LABELS[data.type]}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginTop: 2 }}>{data.label}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => deleteNode(node.id)} style={{ background: '#fee2e2', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
            <Trash2 size={14} />
          </button>
          <button onClick={() => setSelectedNodeId(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 14, fontWeight: 500 }}>ID: {node.id}</div>
        {data.type === 'start' && <StartForm id={node.id} data={data} />}
        {data.type === 'task' && <TaskForm id={node.id} data={data} />}
        {data.type === 'approval' && <ApprovalForm id={node.id} data={data} />}
        {data.type === 'automated' && <AutomatedForm id={node.id} data={data} />}
        {data.type === 'end' && <EndForm id={node.id} data={data} />}
      </div>
    </div>
  );
}
