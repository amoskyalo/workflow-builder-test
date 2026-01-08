import dayjs from "dayjs";
import { Workflow, WorkflowStats, UserSession, STORAGE_KEYS, CreateWorkflowInput, UpdateWorkflowInput } from "@/types";

const isBrowser = typeof window !== "undefined";

/**
 * Get all workflows from localStorage
 */
export const getWorkflows = (): Workflow[] => {
    if (!isBrowser) return [];

    try {
        const data = localStorage.getItem(STORAGE_KEYS.WORKFLOWS);
        if (!data) return [];

        const workflows = JSON.parse(data) as Workflow[];
        return workflows;
    } catch (error) {
        console.error("Error reading workflows from localStorage:", error);
        return [];
    }
};

/**
 * Get a single workflow by ID
 */
export const getWorkflow = (id: string): Workflow | null => {
    if (!isBrowser) return null;

    const workflows = getWorkflows();
    return workflows.find((w) => w.id === id) || null;
};

/**
 * Save a new workflow or update an existing one
 */
export const saveWorkflow = (input: CreateWorkflowInput & { id?: string }): Workflow => {
    if (!isBrowser) {
        throw new Error("Cannot save workflow in non-browser environment");
    }

    const workflows = getWorkflows();
    const now = dayjs().toISOString();

    const existingIndex = input.id ? workflows.findIndex((w) => w.id === input.id) : -1;

    if (existingIndex >= 0) {
        const updated: Workflow = {
            ...workflows[existingIndex],
            ...input,
            updatedAt: now,
        };
        workflows[existingIndex] = updated;
        localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(workflows));
        return updated;
    } else {
        const newWorkflow: Workflow = {
            id: input.id || generateId(),
            name: input.name,
            description: input.description,
            nodes: input.nodes || [],
            edges: input.edges || [],
            createdAt: now,
            updatedAt: now,
        };
        workflows.push(newWorkflow);
        localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(workflows));
        return newWorkflow;
    }
};

/**
 * Update an existing workflow
 */
export const updateWorkflow = (id: string, updates: UpdateWorkflowInput): Workflow | null => {
    if (!isBrowser) {
        throw new Error("Cannot update workflow in non-browser environment");
    }

    const workflows = getWorkflows();
    const index = workflows.findIndex((w) => w.id === id);

    if (index === -1) return null;

    const updated: Workflow = {
        ...workflows[index],
        ...updates,
        updatedAt: dayjs().toISOString(),
    };

    workflows[index] = updated;
    localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(workflows));
    return updated;
};

/**
 * Delete a workflow by ID
 */
export const deleteWorkflow = (id: string): boolean => {
    if (!isBrowser) {
        throw new Error("Cannot delete workflow in non-browser environment");
    }

    const workflows = getWorkflows();
    const filtered = workflows.filter((w) => w.id !== id);

    if (filtered.length === workflows.length) return false; // Not found

    localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(filtered));
    return true;
};

/**
 * Calculate dashboard statistics from workflows
 */
export const calculateStats = (workflows: Workflow[]): WorkflowStats => {
    const totalWorkflows = workflows.length;
    const totalNodes = workflows.reduce((sum, workflow) => sum + workflow.nodes.length, 0);

    // Get 5 most recent workflows
    const recentWorkflows = [...workflows]
        .sort((a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf())
        .slice(0, 5);

    return {
        totalWorkflows,
        totalNodes,
        recentWorkflows,
    };
};

/**
 * Get current user session
 */
export const getUserSession = (): UserSession | null => {
    if (!isBrowser) return null;

    try {
        const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
        if (!data) return null;

        return JSON.parse(data) as UserSession;
    } catch (error) {
        console.error("Error reading user session from localStorage:", error);
        return null;
    }
};

/**
 * Save user session
 */
export const saveUserSession = (session: UserSession): void => {
    if (!isBrowser) {
        throw new Error("Cannot save session in non-browser environment");
    }

    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
};

/**
 * Clear user session (logout)
 */
export const clearUserSession = (): void => {
    if (!isBrowser) {
        throw new Error("Cannot clear session in non-browser environment");
    }

    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return getUserSession() !== null;
};

/**
 * Generate a unique ID for workflows
 */
export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Clear all data (for testing/demo purposes)
 */
export const clearAllData = (): void => {
    if (!isBrowser) {
        throw new Error("Cannot clear data in non-browser environment");
    }

    localStorage.removeItem(STORAGE_KEYS.WORKFLOWS);
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
};

/**
 * Seed demo data for testing
 */
export const seedDemoData = (): void => {
    if (!isBrowser) {
        throw new Error("Cannot seed data in non-browser environment");
    }

    if (getWorkflows().length > 0) return;

    const demoWorkflows: Workflow[] = [
        {
            id: generateId(),
            name: "Welcome Workflow",
            description: "A simple workflow to get you started",
            createdAt: dayjs().subtract(2, "days").toISOString(),
            updatedAt: dayjs().subtract(1, "day").toISOString(),
            nodes: [
                {
                    id: "1",
                    type: "start",
                    position: { x: 100, y: 100 },
                    data: { type: "start", label: "Start" },
                },
                {
                    id: "2",
                    type: "logger",
                    position: { x: 100, y: 200 },
                    data: { type: "logger", label: "Log Welcome", message: "Welcome to Workflow Builder!" },
                },
                {
                    id: "3",
                    type: "end",
                    position: { x: 100, y: 300 },
                    data: { type: "end", label: "End" },
                },
            ],
            edges: [
                { id: "e1-2", source: "1", target: "2" },
                { id: "e2-3", source: "2", target: "3" },
            ],
        },
    ];

    localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(demoWorkflows));
};
