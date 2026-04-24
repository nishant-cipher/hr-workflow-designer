export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData {
  type: NodeType;
  label: string;
}

export interface StartNodeData extends BaseNodeData {
  type: 'start';
  title: string;
  metadata: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: 'automated';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  label: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  summary: string;
  errors: string[];
}

export interface WorkflowGraph {
  nodes: Array<{ id: string; type: string; data: WorkflowNodeData }>;
  edges: Array<{ id: string; source: string; target: string }>;
}
