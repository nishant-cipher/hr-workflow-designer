import { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './components/sidebar/Sidebar';
import { WorkflowCanvas } from './components/panels/WorkflowCanvas';
import { NodeConfigPanel } from './components/panels/NodeConfigPanel';
import { SandboxPanel } from './components/panels/SandboxPanel';
import { useWorkflowStore } from './store/workflowStore';
import { getAutomations } from './mocks/api';

export default function App() {
  const { setAutomations, selectedNodeId } = useWorkflowStore();

  useEffect(() => {
    getAutomations().then(setAutomations);
  }, [setAutomations]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: "DM Sans", sans-serif; overflow: hidden; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .react-flow__attribution { display: none !important; }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Sidebar />
        <ReactFlowProvider>
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <WorkflowCanvas />
            {selectedNodeId && <NodeConfigPanel />}
          </div>
        </ReactFlowProvider>
        <SandboxPanel />
      </div>
    </>
  );
}
