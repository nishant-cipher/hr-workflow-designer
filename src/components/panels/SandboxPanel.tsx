import { useWorkflowStore } from '../../store/workflowStore';
import { simulateWorkflow } from '../../mocks/api';
import { X, CheckCircle2, AlertTriangle, XCircle, Loader2, FlaskConical } from 'lucide-react';
import type { SimulationStep, NodeType } from '../../types';
import { NODE_COLORS } from '../../lib/nodeDefaults';

const TYPE_ICONS: Record<NodeType, string> = {
  start: '▶', task: '📋', approval: '✅', automated: '⚡', end: '🏁'
};

function StepCard({ step, index }: { step: SimulationStep; index: number }) {
  const colors = NODE_COLORS[step.nodeType];
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '10px 0',
      borderBottom: '1px solid #f1f5f9', animation: `fadeIn 0.3s ease ${index * 0.08}s both`
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: step.status === 'success' ? colors.bg : step.status === 'warning' ? '#fef9c3' : '#fee2e2',
          border: `2px solid ${step.status === 'success' ? colors.border : step.status === 'warning' ? '#f59e0b' : '#ef4444'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12
        }}>{TYPE_ICONS[step.nodeType]}</div>
        <div style={{ width: 2, flex: 1, background: '#e2e8f0', marginTop: 4 }} />
      </div>
      <div style={{ flex: 1, paddingTop: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{step.label}</span>
          {step.status === 'success' && <CheckCircle2 size={12} color="#10b981" />}
          {step.status === 'warning' && <AlertTriangle size={12} color="#f59e0b" />}
          {step.status === 'error' && <XCircle size={12} color="#ef4444" />}
        </div>
        <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.4 }}>{step.message}</div>
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>{new Date(step.timestamp).toLocaleTimeString()}</div>
      </div>
    </div>
  );
}

export function SandboxPanel() {
  const { showSandbox, setShowSandbox, nodes, edges, simulationResult, setSimulationResult, isSimulating, setIsSimulating } = useWorkflowStore();

  if (!showSandbox) return null;

  const runSimulation = async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const graph = {
        nodes: nodes.map(n => ({ id: n.id, type: n.type || '', data: n.data })),
        edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
      };
      const result = await simulateWorkflow(graph);
      setSimulationResult(result);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: 520, maxHeight: '80vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)', fontFamily: '"DM Sans", sans-serif',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FlaskConical size={18} color="#818cf8" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Workflow Simulation</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{nodes.length} nodes · {edges.length} edges</div>
            </div>
          </div>
          <button onClick={() => setShowSandbox(false)} style={{ background: '#1e293b', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {/* Controls */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <button onClick={runSimulation} disabled={isSimulating || nodes.length === 0}
            style={{
              background: '#6366f1', border: 'none', borderRadius: 10, padding: '10px 20px',
              color: '#fff', fontSize: 13, fontWeight: 700, cursor: isSimulating ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, opacity: nodes.length === 0 ? 0.5 : 1,
              transition: 'background 0.15s',
            }}>
            {isSimulating ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Simulating...</> : '▶ Run Simulation'}
          </button>
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {isSimulating && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
              <Loader2 size={30} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
              <div style={{ fontSize: 13 }}>Executing workflow steps...</div>
            </div>
          )}

          {simulationResult && !isSimulating && (
            <div>
              {/* Summary banner */}
              <div style={{
                margin: '14px 0 10px',
                padding: '10px 14px',
                borderRadius: 10,
                background: simulationResult.success ? '#ecfdf5' : '#fee2e2',
                border: `1px solid ${simulationResult.success ? '#10b981' : '#ef4444'}`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {simulationResult.success ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}
                <span style={{ fontSize: 12, fontWeight: 600, color: simulationResult.success ? '#064e3b' : '#7f1d1d' }}>
                  {simulationResult.summary}
                </span>
              </div>

              {/* Errors */}
              {simulationResult.errors.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  {simulationResult.errors.map((err, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 10px', background: '#fff1f2', borderRadius: 8, marginBottom: 6, fontSize: 12, color: '#9f1239', alignItems: 'flex-start' }}>
                      <XCircle size={14} style={{ marginTop: 1, flexShrink: 0 }} />{err}
                    </div>
                  ))}
                </div>
              )}

              {/* Steps */}
              {simulationResult.steps.map((step, i) => <StepCard key={step.nodeId} step={step} index={i} />)}
            </div>
          )}

          {!simulationResult && !isSimulating && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🧪</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Run simulation to see workflow execution</div>
              <div style={{ fontSize: 11, marginTop: 4 }}>Build your workflow on the canvas first</div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
