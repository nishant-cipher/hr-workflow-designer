<div align="center">

# ⚡ HR Workflow Designer

### A visual, drag-and-drop HR workflow builder — built as a case study for Tredence Studio's AI Engineering Internship

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Flow](https://img.shields.io/badge/React_Flow-11.11-FF0072?style=flat-square)](https://reactflow.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-4.5-orange?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br/>

> Design, configure, and simulate HR workflows visually — no backend required.

<br/>

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Node Types](#-node-types)
- [Mock API](#-mock-api)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Design Decisions](#-design-decisions)
- [What I'd Add With More Time](#-what-id-add-with-more-time)
- [Assessment Criteria Coverage](#-assessment-criteria-coverage)

---

## 🧠 Overview

This project is a **full-featured prototype** of an HR Workflow Designer module, built as part of the **Tredence Studio Full Stack Engineering Internship Case Study**.

HR admins can:
- Visually **design workflows** (onboarding, leave approval, document verification) using a drag-and-drop canvas
- **Configure every node** through dynamic, type-safe forms
- **Simulate workflow execution** with real graph validation (cycle detection, connectivity checks, topological sort)
- **Export / Import** workflow definitions as JSON

The entire application runs **client-side** — no authentication or backend persistence required.

---

## ✨ Features

| Feature | Status |
|---|---|
| Drag-and-drop canvas (React Flow) | ✅ |
| 5 custom node types with distinct visuals | ✅ |
| Per-node configuration forms (controlled, typed) | ✅ |
| Dynamic Automated Step params (driven by API response) | ✅ |
| Key-value metadata editor (Start + Task nodes) | ✅ |
| Mock API layer (`/automations` + `/simulate`) | ✅ |
| Workflow simulation with step-by-step execution log | ✅ |
| Graph validation (start/end, connectivity, cycles) | ✅ |
| Undo / Redo (50-step history stack) | ✅ |
| Export / Import workflow as JSON | ✅ |
| MiniMap + Zoom Controls | ✅ |
| Delete nodes/edges (UI button + keyboard Delete) | ✅ |

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | React 18 + Vite | Fast HMR, modern JSX transform |
| **Language** | TypeScript (strict mode) | Full type safety, discriminated unions |
| **Canvas** | React Flow v11 | Production-grade graph UI, custom nodes |
| **State** | Zustand | Minimal boilerplate, no context hell |
| **Icons** | Lucide React | Consistent, tree-shakeable icon set |
| **Mock API** | Local async functions | Simulates network latency, replaceable with MSW |

---

## 🏗 Architecture

The app is structured around **four clean layers** that are fully decoupled:

```
┌─────────────────────────────────────────────────────────────────┐
│                          UI Layer                               │
│   Sidebar  │  WorkflowCanvas  │  NodeConfigPanel  │  Sandbox   │
└────────────────────────┬────────────────────────────────────────┘
                         │ reads / dispatches
┌────────────────────────▼────────────────────────────────────────┐
│                      State Layer (Zustand)                      │
│   nodes · edges · selectedNodeId · simulationResult · history  │
└────────────────────────┬────────────────────────────────────────┘
                         │ calls
┌────────────────────────▼────────────────────────────────────────┐
│                     Mock API Layer                              │
│          getAutomations()  ·  simulateWorkflow(graph)          │
└────────────────────────┬────────────────────────────────────────┘
                         │ validates using
┌────────────────────────▼────────────────────────────────────────┐
│                    Graph Algorithms                             │
│     Topological Sort  ·  Cycle Detection (DFS)  ·  In-degree   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User drags node → Zustand addNode()
       ↓
User clicks node → selectedNodeId set → NodeConfigPanel renders
       ↓
User edits form → updateNodeData() → node re-renders live
       ↓
User clicks "Run Simulation"
       ↓
Graph serialized → simulateWorkflow(graph) called
       ↓
Validation → Topological Sort → Step-by-step execution
       ↓
SimulationResult stored in Zustand → SandboxPanel renders log
```

---

## 📁 Project Structure

```
hr-workflow-designer/
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
│
└── src/
    │
    ├── main.tsx                        # React entry point
    ├── App.tsx                         # Root layout, provider setup
    │
    ├── types/
    │   └── index.ts                    # All TypeScript interfaces
    │                                   # WorkflowNodeData (discriminated union)
    │                                   # AutomationAction, SimulationResult, etc.
    │
    ├── store/
    │   └── workflowStore.ts            # Zustand store
    │                                   # nodes, edges, selection, history
    │                                   # undo/redo, export/import
    │
    ├── mocks/
    │   └── api.ts                      # Mock API layer
    │                                   # getAutomations() → AutomationAction[]
    │                                   # simulateWorkflow() → SimulationResult
    │                                   # (includes cycle detection + topo sort)
    │
    ├── lib/
    │   └── nodeDefaults.ts             # createDefaultNodeData() factory
    │                                   # NODE_COLORS config map
    │
    └── components/
        │
        ├── nodes/
        │   ├── StartNode.tsx           # ▶ Green — entry point
        │   ├── TaskNode.tsx            # 📋 Blue — human task
        │   ├── ApprovalNode.tsx        # ✅ Amber — approval step
        │   └── OtherNodes.tsx          # ⚡ Purple (Automated) + 🏁 Red (End)
        │
        ├── forms/
        │   └── NodeForms.tsx           # One typed form per node type
        │                               # StartForm, TaskForm, ApprovalForm,
        │                               # AutomatedForm, EndForm
        │                               # + reusable KVEditor component
        │
        ├── panels/
        │   ├── WorkflowCanvas.tsx      # React Flow canvas + drag-drop handler
        │   ├── NodeConfigPanel.tsx     # Right-side panel, renders correct form
        │   └── SandboxPanel.tsx        # Simulation modal + execution log
        │
        └── sidebar/
            └── Sidebar.tsx             # Node palette, undo/redo, export/import
```

---

## 🔷 Node Types

Each node type has its own **visual style**, **TypeScript interface**, and **configuration form**.

### 1. 🟢 Start Node
```ts
interface StartNodeData {
  type: 'start';
  title: string;
  metadata: Record<string, string>; // dynamic key-value pairs
}
```
- Workflow entry point. Only source handle (no incoming edges).
- Supports arbitrary metadata key-value fields.

---

### 2. 🔵 Task Node
```ts
interface TaskNodeData {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
}
```
- Human task step (e.g. "Collect Documents", "Fill Onboarding Form").
- Full handle pair (target + source).

---

### 3. 🟡 Approval Node
```ts
interface ApprovalNodeData {
  type: 'approval';
  title: string;
  approverRole: 'Manager' | 'HRBP' | 'Director' | 'VP' | 'CEO' | 'Legal';
  autoApproveThreshold: number; // 0 = disabled
}
```
- Represents a human approval gate.
- Auto-approve threshold allows skipping approval for low-stakes cases.

---

### 4. 🟣 Automated Step Node
```ts
interface AutomatedNodeData {
  type: 'automated';
  title: string;
  actionId: string;              // selected from /automations API
  actionParams: Record<string, string>; // dynamic based on action
}
```
- Action list is fetched from `getAutomations()` on mount.
- Param fields are **dynamically rendered** based on the chosen action's `params` array.

---

### 5. 🔴 End Node
```ts
interface EndNodeData {
  type: 'end';
  endMessage: string;
  summaryFlag: boolean; // toggle: generate workflow summary
}
```
- Workflow termination point. Only target handle (no outgoing edges).

---

## 🔌 Mock API

Defined in `src/mocks/api.ts`. Simulates async network calls with artificial delays.

### `GET /automations`
```ts
getAutomations(): Promise<AutomationAction[]>

// Returns:
[
  { id: "send_email",      label: "Send Email",              params: ["to", "subject", "body"] },
  { id: "generate_doc",    label: "Generate Document",       params: ["template", "recipient"] },
  { id: "create_ticket",   label: "Create JIRA Ticket",      params: ["project", "summary", "priority"] },
  { id: "send_slack",      label: "Send Slack Notification", params: ["channel", "message"] },
  { id: "update_hris",     label: "Update HRIS Record",      params: ["employee_id", "field", "value"] },
  { id: "schedule_meeting",label: "Schedule Meeting",        params: ["attendees", "duration", "title"] }
]
```

### `POST /simulate`
```ts
simulateWorkflow(graph: WorkflowGraph): Promise<SimulationResult>
```

**Validation pipeline:**
```
1. Check: exactly one Start node exists
2. Check: at least one End node exists
3. Check: all non-Start nodes have incoming edges
4. Check: all non-End nodes have outgoing edges
5. Check: no cycles (DFS-based cycle detection)
6. If valid → Topological Sort → execute each node in order
7. Return step-by-step SimulationResult
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher — [Download here](https://nodejs.org/)
- **npm** v9 or higher (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/nishant-cipher/hr-workflow-designer.git

# 2. Navigate to the project
cd hr-workflow-designer

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Commands

```bash
npm run build     # Production build → ./dist
npm run preview   # Preview production build locally
```

---

## 📖 Usage Guide

### Building a Workflow

```
1. Drag a "Start" node from the sidebar onto the canvas
        ↓
2. Drag any intermediate nodes (Task, Approval, Automated)
        ↓
3. Connect nodes by dragging from the bottom handle of one
   node to the top handle of the next
        ↓
4. Click any node to open its configuration panel on the right
        ↓
5. Fill in the form fields — the node updates live on the canvas
        ↓
6. Drag an "End" node and connect the final step to it
        ↓
7. Click "Run Simulation" in the sidebar to test your workflow
```

### Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Delete selected node/edge | `Delete` key |
| Undo | Sidebar button |
| Redo | Sidebar button |

### Export / Import

- **Export** — Downloads `workflow.json` with full node + edge definitions
- **Import** — Load any previously exported workflow JSON file

---

## 🎯 Design Decisions

### Discriminated Union for Node Data
```ts
// WorkflowNodeData is a discriminated union on `type`
type WorkflowNodeData = StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData;
```
This enables **exhaustive type checking** in forms and the simulation engine. TypeScript will error if a new node type is added but not handled.

### Zustand Over Context
React Context re-renders all consumers on every state update. Zustand's selector-based subscriptions mean each component only re-renders when **its specific slice** of state changes — critical for a canvas with potentially many nodes.

### Flat History Stack for Undo/Redo
Rather than tracking diffs (complex), the store snapshots `{ nodes, edges }` before each destructive action. Max 50 states are kept to bound memory usage.

### Mock API as a Real Abstraction
`src/mocks/api.ts` exports the same function signatures a real API client would. Swapping in a real backend (Axios, fetch with a base URL) requires changing **only this file** — no component code changes.

### Extensibility for New Node Types
Adding a new node type requires touching exactly 4 files:
1. `types/index.ts` — add a new `interface` and extend the union
2. `lib/nodeDefaults.ts` — add default data and color config
3. `components/nodes/` — add a new node visual component
4. `components/forms/NodeForms.tsx` — add a new form component

Nothing in the canvas, store, or sidebar needs to change.

---

## 🔜 What I'd Add With More Time

- **Visual validation errors on nodes** — red border/badge on nodes with missing required fields
- **Conditional edges** — Approval nodes with "Approved" and "Rejected" branches
- **Node templates** — pre-built workflow starters (Onboarding, Leave Approval, Exit Formalities)
- **Auto-layout** — Dagre/ELK algorithm to auto-arrange nodes neatly
- **Real backend** — FastAPI + PostgreSQL for workflow persistence
- **Unit tests** — Jest + React Testing Library for forms and Zustand store
- **E2E tests** — Playwright for drag-drop, connection, and simulation flows
- **Role-based access** — HR Admin vs Viewer permissions
- **Node version history** — Track config changes per node over time

---

## 📊 Assessment Criteria Coverage

| Criteria | Approach |
|---|---|
| **React Flow proficiency** | Custom memoized node components per type, typed `NodeProps<T>`, handle placement, edge styling |
| **React architecture** | Zustand store, component decomposition, separation of canvas/node/API logic |
| **Complex form handling** | Controlled components, discriminated union typing, dynamic KV editor, dynamic action params |
| **Mock API interaction** | Async abstraction with artificial delay, real graph algorithms in simulate |
| **Scalability** | Extensible node type system, selector-based state subscriptions, history bounded at 50 |
| **Communication** | This README, inline code comments, design decisions documented |
| **Delivery speed** | Full working prototype with all required features in one session |

---

## 👤 Author

Built by **Nishant kr.** for the Tredence Studio AI Engineering Internship .

- GitHub: [@your-username](https://github.com/nishant-cipher)
- LinkedIn: [your-linkedin](https://www.linkedin.com/in/nishcipher/)

---

<div align="center">

Made with ❤️ and TypeScript

</div>
