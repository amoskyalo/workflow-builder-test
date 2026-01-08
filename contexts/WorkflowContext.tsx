"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Workflow, WorkflowStats, CreateWorkflowInput, UpdateWorkflowInput } from "@/types";
import { getWorkflows, getWorkflow, saveWorkflow, updateWorkflow, deleteWorkflow, calculateStats } from "@/lib/storage";

interface WorkflowContextType {
    workflows: Workflow[];
    stats: WorkflowStats;
    isLoading: boolean;
    createWorkflow: (input: CreateWorkflowInput) => Workflow;
    updateWorkflowById: (id: string, updates: UpdateWorkflowInput) => Workflow | null;
    deleteWorkflowById: (id: string) => boolean;
    getWorkflowById: (id: string) => Workflow | null;
    refreshWorkflows: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);
interface WorkflowProviderProps {
    children: ReactNode;
}

export function WorkflowProvider({ children }: WorkflowProviderProps) {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [stats, setStats] = useState<WorkflowStats>({
        totalWorkflows: 0,
        totalNodes: 0,
        recentWorkflows: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadWorkflows();
    }, []);

    useEffect(() => {
        const newStats = calculateStats(workflows);
        setStats(newStats);
    }, [workflows]);

    /**
     * Load workflows from localStorage
     */
    const loadWorkflows = () => {
        setIsLoading(true);
        try {
            const data = getWorkflows();
            setWorkflows(data);
        } catch (error) {
            console.error("Failed to load workflows:", error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Create a new workflow
     */
    const createWorkflow = (input: CreateWorkflowInput): Workflow => {
        const newWorkflow = saveWorkflow(input);
        setWorkflows((prev) => [...prev, newWorkflow]);
        return newWorkflow;
    };

    /**
     * Update an existing workflow
     */
    const updateWorkflowById = (id: string, updates: UpdateWorkflowInput): Workflow | null => {
        const updated = updateWorkflow(id, updates);
        if (updated) {
            setWorkflows((prev) => prev.map((w) => (w.id === id ? updated : w)));
        }
        return updated;
    };

    /**
     * Delete a workflow
     */
    const deleteWorkflowById = (id: string): boolean => {
        const success = deleteWorkflow(id);
        if (success) {
            setWorkflows((prev) => prev.filter((w) => w.id !== id));
        }
        return success;
    };

    /**
     * Get a single workflow by ID
     */
    const getWorkflowById = (id: string): Workflow | null => {
        return getWorkflow(id);
    };

    /**
     * Manually refresh workflows from localStorage
     */
    const refreshWorkflows = () => {
        loadWorkflows();
    };

    const value: WorkflowContextType = {
        workflows,
        stats,
        isLoading,
        createWorkflow,
        updateWorkflowById,
        deleteWorkflowById,
        getWorkflowById,
        refreshWorkflows,
    };

    return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

/**
 * Hook to use WorkflowContext
 * Must be used within WorkflowProvider
 */
export function useWorkflows() {
    const context = useContext(WorkflowContext);

    if (context === undefined) {
        throw new Error("useWorkflows must be used within a WorkflowProvider");
    }

    return context;
}
