import { useCallback } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { createDefaultNodeData } from '../../lib/nodeDefaults';
import { NODE_COLORS } from '../../lib/nodeDefaults';
import type { NodeType } from '../../types';
import { Play, ClipboardList, CheckSquare, Zap, Flag, FlaskConical, Download, Upload, Undo2, Redo2 } from 'lucide-react';

const NODE_TYPES: Array<{ type: NodeType; label: string; description: string; icon: React.ReactNode }> = [
  { type: 'start', label: 'Start', description: 'Workflow entry point', icon: <Play size={15} /> },
  { type: 'task', label: 'Task', description: 'Human task step', icon: <ClipboardList size={15} /> },
  { type: 'approval', label: 'Approval', description: 'Manager approval step', icon: <CheckSquare size={15} /> },
  { type: 'automated', label: 'Automated', description: 'System-triggered action', icon: <Zap size={15} /> },
  { type: 'end', label: 'End', description: 'Workflow completion', icon: <Flag size={15} /> },
];

let nodeIdCounter = 1;

export function Sidebar() {
  const { addNode, setShowSandbox, exportWorkflow, importWorkflow, undo, redo } = useWorkflowStore();

  const onDragStart = useCallback((e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleAddNode = useCallback((type: NodeType) => {
    const id = `node_${Date.now()}_${nodeIdCounter++}`;
    addNode({
      id,
      type,
      position: { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: createDefaultNodeData(type),
    });
  }, [addNode]);

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => importWorkflow(ev.target?.result as string);
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div style={{
      width: 220,
      background: '#0f172a',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"DM Sans", sans-serif',
      overflow: 'hidden',
    }}>
      {/* Logo area */}
      <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
         HR Workflow
        </div>
        <div style={{ fontSize: 10, color: '#64748b', marginTop: 2, fontWeight: 500 }}>Designer — Tredence Studio</div>
      </div>

      {/* Node palette */}
      <div style={{ padding: '12px 12px 8px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Node Types</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {NODE_TYPES.map(({ type, label, description, icon }) => {
            const colors = NODE_COLORS[type];
            return (
              <div
                key={type}
                draggable
                onDragStart={(e) => onDragStart(e, type)}
                onClick={() => handleAddNode(type)}
                style={{
                  background: '#1e293b',
                  border: `1px solid #334155`,
                  borderRadius: 10,
                  padding: '10px 12px',
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.15s',
                  userSelect: 'none',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#334155'; (e.currentTarget as HTMLDivElement).style.borderColor = colors.border; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = '#1e293b'; (e.currentTarget as HTMLDivElement).style.borderColor = '#334155'; }}
              >
                <div style={{ width: 30, height: 30, borderRadius: 8, background: colors.bg, color: colors.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{label}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>{description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ marginTop: 'auto', padding: 12, borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Actions</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <ActionBtn icon={<Undo2 size={13} />} label="Undo" onClick={undo} />
          <ActionBtn icon={<Redo2 size={13} />} label="Redo" onClick={redo} />
        </div>
        <ActionBtn icon={<FlaskConical size={13} />} label="Run Simulation" onClick={() => setShowSandbox(true)} accent />
        <div style={{ display: 'flex', gap: 6 }}>
          <ActionBtn icon={<Download size={13} />} label="Export" onClick={handleExport} />
          <ActionBtn icon={<Upload size={13} />} label="Import" onClick={handleImport} />
        </div>
        <div style={{ fontSize: 10, color: '#334155', marginTop: 4, lineHeight: 1.4 }}>Drag nodes to canvas or click to add</div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, accent }: { icon: React.ReactNode; label: string; onClick: () => void; accent?: boolean }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: accent ? '#6366f1' : '#1e293b',
      border: `1px solid ${accent ? '#6366f1' : '#334155'}`, borderRadius: 8, padding: '7px 10px', cursor: 'pointer',
      color: accent ? '#fff' : '#94a3b8', fontSize: 11, fontWeight: 600, transition: 'all 0.15s', fontFamily: '"DM Sans", sans-serif'
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = accent ? '#4f46e5' : '#334155'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = accent ? '#6366f1' : '#1e293b'; }}
    >
      {icon}{label}
    </button>
  );
}
