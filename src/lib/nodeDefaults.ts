import type { WorkflowNodeData, NodeType } from '../types';

export function createDefaultNodeData(type: NodeType): WorkflowNodeData {
  switch (type) {
    case 'start':
      return { type: 'start', label: 'Start', title: 'Workflow Start', metadata: {} };
    case 'task':
      return { type: 'task', label: 'Task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: {} };
    case 'approval':
      return { type: 'approval', label: 'Approval', title: 'Approval Step', approverRole: 'Manager', autoApproveThreshold: 0 };
    case 'automated':
      return { type: 'automated', label: 'Automated Step', title: 'Automated Action', actionId: '', actionParams: {} };
    case 'end':
      return { type: 'end', label: 'End', endMessage: 'Workflow completed.', summaryFlag: false };
  }
}

export const NODE_COLORS: Record<NodeType, { bg: string; border: string; icon: string; text: string }> = {
  start: { bg: '#ecfdf5', border: '#10b981', icon: '#10b981', text: '#064e3b' },
  task: { bg: '#eff6ff', border: '#3b82f6', icon: '#3b82f6', text: '#1e3a5f' },
  approval: { bg: '#fef9c3', border: '#f59e0b', icon: '#f59e0b', text: '#713f12' },
  automated: { bg: '#f5f3ff', border: '#8b5cf6', icon: '#8b5cf6', text: '#3b0764' },
  end: { bg: '#fff1f2', border: '#f43f5e', icon: '#f43f5e', text: '#881337' },
};
