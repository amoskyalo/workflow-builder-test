import { Node as ReactFlowNode, Edge as ReactFlowEdge } from "@xyflow/react";

export const STORAGE_KEYS = {
    USER_SESSION: "workflow_user_session",
    WORKFLOWS: "workflow_workflows",
} as const;

export type NodeType = "start" | "condition" | "delay" | "webhook" | "logger" | "end";

export type DurationUnit = "seconds" | "minutes" | "hours";

interface BaseNodeData {
    label?: string;
    executing?: boolean;
    [key: string]: unknown;
}

export interface StartNodeData extends BaseNodeData {
    type: "start";
}

export interface ConditionNodeData extends BaseNodeData {
    type: "condition";
    condition?: string;
}

export interface DelayNodeData extends BaseNodeData {
    type: "delay";
    duration?: number;
    durationUnit?: DurationUnit;
}

export interface WebhookNodeData extends BaseNodeData {
    type: "webhook";
    url?: string;
    payload?: string;
}

export interface LoggerNodeData extends BaseNodeData {
    type: "logger";
    message?: string;
}

export interface EndNodeData extends BaseNodeData {
    type: "end";
}

export type WorkflowNodeData =
    | StartNodeData
    | ConditionNodeData
    | DelayNodeData
    | WebhookNodeData
    | LoggerNodeData
    | EndNodeData;

export type WorkflowNode = ReactFlowNode<WorkflowNodeData> & {
    type: NodeType;
};

export type WorkflowEdge = ReactFlowEdge;

export interface Workflow {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}

export interface WorkflowStats {
    totalWorkflows: number;
    totalNodes: number;
    recentWorkflows: Workflow[];
}

export interface UserSession {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface SignupFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface WorkflowFormValues {
    name: string;
    description?: string;
}

export type CreateWorkflowInput = Omit<Workflow, "id" | "createdAt" | "updatedAt">;

export type UpdateWorkflowInput = Partial<Omit<Workflow, "id" | "createdAt">>;

export interface NodePaletteItem {
    type: NodeType;
    label: string;
    description: string;
    icon?: string;
}
