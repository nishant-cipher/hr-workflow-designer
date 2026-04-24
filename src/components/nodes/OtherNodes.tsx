import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { AutomatedNodeData, EndNodeData } from '../../types';
import { NODE_COLORS } from '../../lib/nodeDefaults';
import { Zap, Flag } from 'lucide-react';

export const AutomatedNode = memo(({ data, selected }: NodeProps<AutomatedNodeData>) => {
  const colors = NODE_COLORS.automated;
  return (
    <div style={{ background: colors.bg, border: `2px solid ${selected ? '#6366f1' : colors.border}`, borderRadius: 12, padding: '12px 16px', minWidth: 200, boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.2)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.15s', fontFamily: '"DM Sans", sans-serif' }}>
      <Handle type="target" position={Position.Top} style={{ background: colors.border, width: 10, height: 10, border: '2px solid #fff' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{ background: colors.border, borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={14} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: colors.border, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Automated</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{data.title || 'Automated Action'}</div>
        </div>
      </div>
      {data.actionId && (
        <div style={{ background: colors.border + '18', borderRadius: 6, padding: '3px 8px', fontSize: 10, color: colors.border, fontWeight: 600 }}>
          ⚡ {data.actionId.replace('_', ' ').toUpperCase()}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: colors.border, width: 10, height: 10, border: '2px solid #fff' }} />
    </div>
  );
});

export const EndNode = memo(({ data, selected }: NodeProps<EndNodeData>) => {
  const colors = NODE_COLORS.end;
  return (
    <div style={{ background: colors.bg, border: `2px solid ${selected ? '#6366f1' : colors.border}`, borderRadius: 12, padding: '12px 16px', minWidth: 180, boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.2)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.15s', fontFamily: '"DM Sans", sans-serif' }}>
      <Handle type="target" position={Position.Top} style={{ background: colors.border, width: 10, height: 10, border: '2px solid #fff' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ background: colors.border, borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Flag size={14} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: colors.border, textTransform: 'uppercase', letterSpacing: '0.08em' }}>End</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{data.endMessage || 'Workflow Complete'}</div>
        </div>
      </div>
      {data.summaryFlag && <div style={{ marginTop: 6, fontSize: 10, color: colors.border, background: colors.border + '18', padding: '2px 8px', borderRadius: 8, display: 'inline-block' }}>Summary Enabled</div>}
    </div>
  );
});
