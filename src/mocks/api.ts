import type { AutomationAction, SimulationResult, WorkflowGraph, NodeType } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary', 'priority'] },
  { id: 'send_slack', label: 'Send Slack Notification', params: ['channel', 'message'] },
  { id: 'update_hris', label: 'Update HRIS Record', params: ['employee_id', 'field', 'value'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'duration', 'title'] },
];

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300);
  return MOCK_AUTOMATIONS;
}

function getNodeLabel(type: NodeType): string {
  const labels: Record<NodeType, string> = {
    start: 'Start',
    task: 'Task',
    approval: 'Approval',
    automated: 'Automated Step',
    end: 'End',
  };
  return labels[type];
}

function detectCycle(nodes: WorkflowGraph['nodes'], edges: WorkflowGraph['edges']): boolean {
  const adj: Record<string, string[]> = {};
  nodes.forEach(n => (adj[n.id] = []));
  edges.forEach(e => adj[e.source]?.push(e.target));

  const visited = new Set<string>();
  const stack = new Set<string>();

  function dfs(id: string): boolean {
    visited.add(id);
    stack.add(id);
    for (const neighbor of adj[id] || []) {
      if (!visited.has(neighbor) && dfs(neighbor)) return true;
      if (stack.has(neighbor)) return true;
    }
    stack.delete(id);
    return false;
  }

  return nodes.some(n => !visited.has(n.id) && dfs(n.id));
}

function topologicalSort(nodes: WorkflowGraph['nodes'], edges: WorkflowGraph['edges']): string[] {
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};
  nodes.forEach(n => { inDegree[n.id] = 0; adj[n.id] = []; });
  edges.forEach(e => { adj[e.source].push(e.target); inDegree[e.target]++; });

  const queue = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
  const result: string[] = [];

  while (queue.length > 0) {
    const id = queue.shift()!;
    result.push(id);
    for (const neighbor of adj[id]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  return result;
}

export async function simulateWorkflow(graph: WorkflowGraph): Promise<SimulationResult> {
  await delay(800);

  const errors: string[] = [];
  const steps: SimulationResult['steps'] = [];

  // Validation
  const startNodes = graph.nodes.filter(n => n.data.type === 'start');
  const endNodes = graph.nodes.filter(n => n.data.type === 'end');

  if (startNodes.length === 0) errors.push('Workflow must have a Start node.');
  if (startNodes.length > 1) errors.push('Workflow can only have one Start node.');
  if (endNodes.length === 0) errors.push('Workflow must have an End node.');

  const connectedTargets = new Set(graph.edges.map(e => e.target));
  const connectedSources = new Set(graph.edges.map(e => e.source));
  graph.nodes.forEach(n => {
    if (n.data.type !== 'start' && !connectedTargets.has(n.id)) {
      errors.push(`Node "${n.data.label}" has no incoming connection.`);
    }
    if (n.data.type !== 'end' && !connectedSources.has(n.id)) {
      errors.push(`Node "${n.data.label}" has no outgoing connection.`);
    }
  });

  if (detectCycle(graph.nodes, graph.edges)) {
    errors.push('Workflow contains a cycle. Please remove circular connections.');
  }

  if (errors.length > 0) {
    return { success: false, steps: [], summary: 'Validation failed.', errors };
  }

  // Simulate execution in topological order
  const order = topologicalSort(graph.nodes, graph.edges);
  const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));

  const actionMessages: Record<string, string> = {
    send_email: 'Email dispatched successfully to recipient.',
    generate_doc: 'Document generated from template and delivered.',
    create_ticket: 'JIRA ticket created and assigned.',
    send_slack: 'Slack notification sent to channel.',
    update_hris: 'HRIS record updated in system.',
    schedule_meeting: 'Meeting invite sent to all attendees.',
  };

  for (const id of order) {
    const node = nodeMap.get(id);
    if (!node) continue;
    const type = node.data.type as NodeType;
    const now = new Date().toISOString();

    if (type === 'start') {
      steps.push({ nodeId: id, nodeType: type, label: node.data.label, status: 'success', message: `Workflow initiated: "${(node.data as any).title || 'Start'}"`, timestamp: now });
    } else if (type === 'task') {
      const d = node.data as any;
      steps.push({ nodeId: id, nodeType: type, label: node.data.label, status: 'success', message: `Task assigned to "${d.assignee || 'Unassigned'}": ${d.title}`, timestamp: now });
    } else if (type === 'approval') {
      const d = node.data as any;
      const approved = Math.random() > 0.2;
      steps.push({ nodeId: id, nodeType: type, label: node.data.label, status: approved ? 'success' : 'warning', message: approved ? `Approved by ${d.approverRole || 'Approver'}.` : `Pending approval from ${d.approverRole || 'Approver'}.`, timestamp: now });
    } else if (type === 'automated') {
      const d = node.data as any;
      const msg = actionMessages[d.actionId] || 'Automated action executed.';
      steps.push({ nodeId: id, nodeType: type, label: node.data.label, status: 'success', message: msg, timestamp: now });
    } else if (type === 'end') {
      const d = node.data as any;
      steps.push({ nodeId: id, nodeType: type, label: node.data.label, status: 'success', message: d.endMessage || 'Workflow completed successfully.', timestamp: now });
    }
  }

  return {
    success: true,
    steps,
    summary: `Workflow executed ${steps.length} step(s) successfully.`,
    errors: [],
  };
}
