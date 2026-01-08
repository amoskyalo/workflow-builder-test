# Workflow Builder

A visual workflow builder application built with Next.js and ReactFlow.

## Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS + shadcn/ui
-   **Workflow Visualization**: ReactFlow (@xyflow/react)
-   **State Management**: React Context API
-   **Forms**: Formik + Yup
-   **Data Persistence**: localStorage

## Getting Started

### Prerequisites

-   Node.js 18+
-   pnpm (recommended) or npm

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd workflow-builder

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Authentication

Mock authentication with login UI. User sessions stored in localStorage.

### Dashboard

-   Workflow statistics (total workflows, nodes, connections)
-   Recent workflows table with quick actions

### Workflow Management

-   Create, edit, duplicate, and delete workflows
-   Search and filter workflows
-   Auto-save to localStorage

### Visual Workflow Editor

Full-screen drag-and-drop editor powered by ReactFlow with the following node types:

| Node          | Purpose                                | Outputs        |
| ------------- | -------------------------------------- | -------------- |
| **Start**     | Entry point (one per workflow)         | 1              |
| **Condition** | Branching logic with expression        | 2 (True/False) |
| **Delay**     | Wait for specified duration            | 1              |
| **Webhook**   | Mock HTTP request with URL and payload | 1              |
| **Logger**    | Output message to execution log        | 1              |
| **End**       | Workflow termination                   | 0              |

### Workflow Execution

Run workflows with visual execution highlighting and real-time logging panel.

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```
