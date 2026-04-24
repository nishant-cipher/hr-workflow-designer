import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { StartNodeData } from '../../types';
import { NODE_COLORS } from '../../lib/nodeDefaults';
import { Play } from 'lucide-react';

const StartNode = memo(({ data, selected }: NodeProps<StartNodeData>) => {
  const colors = NODE_COLORS.start;
  return (
    <div
      style={{
        background: colors.bg,
        border: `2px solid ${selected ? '#6366f1' : colors.border}`,
        borderRadius: 12,
        padding: '12px 16px',
        minWidth: 180,
        boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.2)' : '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.15s',
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ background: colors.border, borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Play size={14} color="#fff" fill="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: colors.border, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Start</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginTop: 1 }}>{data.title || 'Workflow Start'}</div>
        </div>
      </div>
      {Object.keys(data.metadata || {}).length > 0 && (
        <div style={{ marginTop: 8, borderTop: `1px solid ${colors.border}22`, paddingTop: 6 }}>
          {Object.entries(data.metadata).map(([k, v]) => (
            <div key={k} style={{ fontSize: 10, color: colors.text, opacity: 0.7 }}>{k}: {v}</div>
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: colors.border, width: 10, height: 10, border: '2px solid #fff' }} />
    </div>
  );
});

export default StartNode;
