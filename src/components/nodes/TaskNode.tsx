import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { TaskNodeData } from '../../types';
import { NODE_COLORS } from '../../lib/nodeDefaults';
import { ClipboardList, User, Calendar } from 'lucide-react';

const TaskNode = memo(({ data, selected }: NodeProps<TaskNodeData>) => {
  const colors = NODE_COLORS.task;
  return (
    <div style={{ background: colors.bg, border: `2px solid ${selected ? '#6366f1' : colors.border}`, borderRadius: 12, padding: '12px 16px', minWidth: 200, boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.2)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.15s', fontFamily: '"DM Sans", sans-serif' }}>
      <Handle type="target" position={Position.Top} style={{ background: colors.border, width: 10, height: 10, border: '2px solid #fff' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ background: colors.border, borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ClipboardList size={14} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: colors.border, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Task</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{data.title || 'New Task'}</div>
        </div>
      </div>
      {data.description && <div style={{ fontSize: 11, color: colors.text, opacity: 0.7, marginBottom: 6, lineHeight: 1.4 }}>{data.description}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {data.assignee && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: colors.text }}><User size={10} />{data.assignee}</div>}
        {data.dueDate && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: colors.text }}><Calendar size={10} />{data.dueDate}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: colors.border, width: 10, height: 10, border: '2px solid #fff' }} />
    </div>
  );
});

export default TaskNode;
