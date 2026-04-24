# HR Workflow Designer — Tredence Studio Case Study

A visual, drag-and-drop HR workflow builder built with React, TypeScript, React Flow, and Zustand.

---

## 🚀 How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Architecture

```
src/
├── types/          # All TypeScript interfaces (WorkflowNodeData, SimulationResult, etc.)
├── store/          # Zustand global store (nodes, edges, selection, simulation state)
├── mocks/          # Mock API layer (getAutomations, simulateWorkflow)
├── lib/            # Utilities: node defaults, color constants
└── components/
    ├── nodes/      # Custom React Flow node components (Start, Task, Approval, Automated, End)
    ├── forms/      # Node config forms (controlled, typed, dynamic)
    ├── panels/     # WorkflowCanvas, NodeConfigPanel, SandboxPanel
    └── sidebar/    # Node palette + action bar
```

### Key Design Decisions

**Zustand for state**: Single flat store manages all workflow state — nodes, edges, selection, simulation results, and undo/redo history. This avoids prop drilling and React context overhead.

**Discriminated unions for node data**: `WorkflowNodeData` is a discriminated union type (`type: 'start' | 'task' | ...`), enabling exhaustive type checking in forms and simulations.

**Mock API abstraction**: `src/mocks/api.ts` simulates async network calls with artificial delays. The `simulateWorkflow` function performs real graph validation (topological sort, cycle detection, connectivity checks) before returning execution steps.

**React Flow custom nodes**: Each node type is a memoized functional component receiving typed `data` props. Visual feedback (selection highlight, colors) is handled via inline styles driven by the `NODE_COLORS` config map.

**Node forms are extensible**: `NodeForms.tsx` exports one form per node type. Adding a new node type requires adding a type to the discriminated union, a default factory in `nodeDefaults.ts`, a node component, and a form component — nothing else needs to change.

---

## ✅ What's Implemented

- [x] React Flow canvas with drag-and-drop from sidebar
- [x] 5 custom node types: Start, Task, Approval, Automated Step, End
- [x] Node config panel with fully typed, controlled forms per node type
- [x] Dynamic Automated Step form (params change based on selected action)
- [x] Key-value metadata editor (Start node, Task custom fields)
- [x] Mock API: `GET /automations` + `POST /simulate`
- [x] Workflow Simulation / Sandbox Panel with step-by-step execution log
- [x] Graph validation: start/end presence, connectivity, cycle detection
- [x] Undo / Redo (history stack, max 50 states)
- [x] Export / Import workflow as JSON
- [x] MiniMap + Controls
- [x] Delete nodes/edges (Delete key or trash icon)
- [x] Visual validation errors in simulation results

## 🔜 What I'd Add With More Time

- Node validation errors shown visually on canvas nodes (red border badges)
- Auto-layout (Dagre/ELK algorithm for automatic arrangement)
- Node templates (pre-built workflow starters: Onboarding, Leave Approval, etc.)
- Version history per node (track config changes)
- Real backend (FastAPI + PostgreSQL persistence)
- Unit tests (Jest + React Testing Library for forms and store)
- E2E tests (Playwright for drag-drop and simulation flows)
- Conditional edges (e.g. Approval Approved / Rejected branches)
- Role-based access (HR Admin vs Viewer)

---

## 📐 Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript (strict) |
| Canvas | React Flow v11 |
| State | Zustand |
| Icons | Lucide React |
| Styling | Inline styles + CSS variables |
| Mock API | Local async functions (simulates MSW) |
