import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from 'reactflow';
import type { WorkflowNodeData, SimulationResult, AutomationAction } from '../types';

export type WorkflowNode = Node<WorkflowNodeData>;

interface WorkflowStore {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
  automations: AutomationAction[];
  showSandbox: boolean;
  history: Array<{ nodes: WorkflowNode[]; edges: Edge[] }>;
  historyIndex: number;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setSelectedNodeId: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  addNode: (node: WorkflowNode) => void;
  deleteNode: (id: string) => void;
  setSimulationResult: (result: SimulationResult | null) => void;
  setIsSimulating: (v: boolean) => void;
  setAutomations: (actions: AutomationAction[]) => void;
  setShowSandbox: (v: boolean) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;
}

const MAX_HISTORY = 50;

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationResult: null,
  isSimulating: false,
  automations: [],
  showSandbox: false,
  history: [],
  historyIndex: -1,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[] });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    get().pushHistory();
    set({ edges: addEdge({ ...connection, animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }, get().edges) });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map(n =>
        n.id === id ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ) as WorkflowNode[],
    });
  },

  addNode: (node) => {
    get().pushHistory();
    set({ nodes: [...get().nodes, node] });
  },

  deleteNode: (id) => {
    get().pushHistory();
    set({
      nodes: get().nodes.filter(n => n.id !== id),
      edges: get().edges.filter(e => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  setSimulationResult: (result) => set({ simulationResult: result }),
  setIsSimulating: (v) => set({ isSimulating: v }),
  setAutomations: (actions) => set({ automations: actions }),
  setShowSandbox: (v) => set({ showSandbox: v }),

  pushHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    set({ nodes: prev.nodes, edges: prev.edges, historyIndex: historyIndex - 1 });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    set({ nodes: next.nodes, edges: next.edges, historyIndex: historyIndex + 1 });
  },

  exportWorkflow: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  importWorkflow: (json) => {
    try {
      const { nodes, edges } = JSON.parse(json);
      get().pushHistory();
      set({ nodes, edges });
    } catch {
      console.error('Invalid workflow JSON');
    }
  },
}));
