import { useWorkflowStore } from '../../store/workflowStore';
import type {
  StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData
} from '../../types';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0',
  fontSize: 13, outline: 'none', background: '#fff', boxSizing: 'border-box',
  fontFamily: '"DM Sans", sans-serif', transition: 'border 0.15s',
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, display: 'block'
};
const fieldStyle: React.CSSProperties = { marginBottom: 14 };

function KVEditor({ value, onChange, label }: { value: Record<string, string>; onChange: (v: Record<string, string>) => void; label: string }) {
  const entries = Object.entries(value);
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      {entries.map(([k, v], i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <input style={{ ...inputStyle, flex: 1 }} placeholder="key" value={k} onChange={e => {
            const next = { ...value };
            delete next[k];
            next[e.target.value] = v;
            onChange(next);
          }} />
          <input style={{ ...inputStyle, flex: 1 }} placeholder="value" value={v} onChange={e => onChange({ ...value, [k]: e.target.value })} />
          <button onClick={() => { const next = { ...value }; delete next[k]; onChange(next); }}
            style={{ background: '#fee2e2', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#ef4444', fontSize: 14 }}>×</button>
        </div>
      ))}
      <button onClick={() => onChange({ ...value, '': '' })}
        style={{ fontSize: 11, color: '#6366f1', background: '#eef2ff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontWeight: 600 }}>+ Add Field</button>
    </div>
  );
}

export function StartForm({ id, data }: { id: string; data: StartNodeData }) {
  const update = useWorkflowStore(s => s.updateNodeData);
  return (
    <div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Start Title</label>
        <input style={inputStyle} value={data.title} onChange={e => update(id, { title: e.target.value, label: e.target.value } as Partial<StartNodeData>)} />
      </div>
      <KVEditor label="Metadata" value={data.metadata} onChange={v => update(id, { metadata: v } as Partial<StartNodeData>)} />
    </div>
  );
}

export function TaskForm({ id, data }: { id: string; data: TaskNodeData }) {
  const update = useWorkflowStore(s => s.updateNodeData);
  return (
    <div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Title *</label>
        <input style={inputStyle} value={data.title} onChange={e => update(id, { title: e.target.value, label: e.target.value } as Partial<TaskNodeData>)} />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }} value={data.description} onChange={e => update(id, { description: e.target.value } as Partial<TaskNodeData>)} />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Assignee</label>
        <input style={inputStyle} placeholder="e.g. John Doe / HR Team" value={data.assignee} onChange={e => update(id, { assignee: e.target.value } as Partial<TaskNodeData>)} />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Due Date</label>
        <input style={inputStyle} type="date" value={data.dueDate} onChange={e => update(id, { dueDate: e.target.value } as Partial<TaskNodeData>)} />
      </div>
      <KVEditor label="Custom Fields" value={data.customFields} onChange={v => update(id, { customFields: v } as Partial<TaskNodeData>)} />
    </div>
  );
}

export function ApprovalForm({ id, data }: { id: string; data: ApprovalNodeData }) {
  const update = useWorkflowStore(s => s.updateNodeData);
  const roles = ['Manager', 'HRBP', 'Director', 'VP', 'CEO', 'Legal'];
  return (
    <div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Title</label>
        <input style={inputStyle} value={data.title} onChange={e => update(id, { title: e.target.value, label: e.target.value } as Partial<ApprovalNodeData>)} />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Approver Role</label>
        <select style={inputStyle} value={data.approverRole} onChange={e => update(id, { approverRole: e.target.value } as Partial<ApprovalNodeData>)}>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Auto-Approve Threshold</label>
        <input style={inputStyle} type="number" min={0} value={data.autoApproveThreshold}
          onChange={e => update(id, { autoApproveThreshold: parseInt(e.target.value) || 0 } as Partial<ApprovalNodeData>)} />
        <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, display: 'block' }}>Set to 0 to disable auto-approve</span>
      </div>
    </div>
  );
}

export function AutomatedForm({ id, data }: { id: string; data: AutomatedNodeData }) {
  const update = useWorkflowStore(s => s.updateNodeData);
  const automations = useWorkflowStore(s => s.automations);
  const selectedAction = automations.find(a => a.id === data.actionId);

  return (
    <div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Title</label>
        <input style={inputStyle} value={data.title} onChange={e => update(id, { title: e.target.value, label: e.target.value } as Partial<AutomatedNodeData>)} />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Action</label>
        <select style={inputStyle} value={data.actionId} onChange={e => update(id, { actionId: e.target.value, actionParams: {} } as Partial<AutomatedNodeData>)}>
          <option value="">Select an action...</option>
          {automations.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </div>
      {selectedAction && selectedAction.params.length > 0 && (
        <div>
          <label style={labelStyle}>Action Parameters</label>
          {selectedAction.params.map(param => (
            <div key={param} style={{ ...fieldStyle, marginBottom: 10 }}>
              <label style={{ ...labelStyle, fontSize: 10 }}>{param}</label>
              <input style={inputStyle} placeholder={`Enter ${param}...`} value={data.actionParams[param] || ''}
                onChange={e => update(id, { actionParams: { ...data.actionParams, [param]: e.target.value } } as Partial<AutomatedNodeData>)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function EndForm({ id, data }: { id: string; data: EndNodeData }) {
  const update = useWorkflowStore(s => s.updateNodeData);
  return (
    <div>
      <div style={fieldStyle}>
        <label style={labelStyle}>End Message</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={data.endMessage}
          onChange={e => update(id, { endMessage: e.target.value } as Partial<EndNodeData>)} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <label style={{ ...labelStyle, margin: 0 }}>Generate Summary</label>
        <div onClick={() => update(id, { summaryFlag: !data.summaryFlag } as Partial<EndNodeData>)}
          style={{ width: 38, height: 20, borderRadius: 10, background: data.summaryFlag ? '#6366f1' : '#cbd5e1', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
          <div style={{ position: 'absolute', top: 2, left: data.summaryFlag ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
        </div>
      </div>
    </div>
  );
}
