import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { ApprovalNodeData } from '../../types';
import { NODE_COLORS } from '../../lib/nodeDefaults';
import { CheckSquare, Shield } from 'lucide-react';

const ApprovalNode = memo(({ data, selected }: NodeProps<ApprovalNodeData>) => {
  const colors = NODE_COLORS.approval;
  return (
    <div style={{ background: colors.bg, border: `2px solid ${selected ? '#6366f1' : colors.border}`, borderRadius: 12, padding: '12px 16px', minWidth: 200, boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.2)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.15s', fontFamily: '"DM Sans", sans-serif' }}>
      <Handle type="target" position={Position.Top} style={{ background: colors.border, width: 10, height: 10, border: '2px solid #fff' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ background: colors.border, borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckSquare size={14} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: colors.border, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Approval</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{data.title || 'Approval Step'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: colors.text }}>
        <Shield size={10} />
        <span>{data.approverRole || 'Manager'}</span>
        {data.autoApproveThreshold > 0 && <span style={{ marginLeft: 4, background: colors.border + '22', padding: '1px 6px', borderRadius: 10, fontSize: 10 }}>Auto ≥ {data.autoApproveThreshold}</span>}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: colors.border, width: 10, height: 10, border: '2px solid #fff' }} />
    </div>
  );
});

export default ApprovalNode;
