"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useWorkflows } from "@/contexts/WorkflowContext";
import { Workflow } from "@/types";
import { WorkflowCard } from "@/components/workflow/WorkflowCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Workflow as WorkflowIcon } from "lucide-react";

export default function WorkflowsPage() {
    const { workflows, isLoading, deleteWorkflowById, createWorkflow } = useWorkflows();
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);

    const filteredWorkflows = useMemo(() => {
        if (!searchQuery.trim()) return workflows;
        const query = searchQuery.toLowerCase();
        return workflows.filter(
            (w) => w.name.toLowerCase().includes(query) || w.description?.toLowerCase().includes(query),
        );
    }, [workflows, searchQuery]);

    const handleDelete = (id: string) => {
        setWorkflowToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (workflowToDelete) {
            deleteWorkflowById(workflowToDelete);
            setDeleteDialogOpen(false);
            setWorkflowToDelete(null);
        }
    };

    const handleDuplicate = (workflow: Workflow) => {
        createWorkflow({
            name: `${workflow.name} (Copy)`,
            description: workflow.description,
            nodes: workflow.nodes.map((node) => ({
                ...node,
                id: `${node.id}-copy-${Date.now()}`,
            })),
            edges: workflow.edges.map((edge) => ({
                ...edge,
                id: `${edge.id}-copy-${Date.now()}`,
                source: `${edge.source}-copy-${Date.now()}`,
                target: `${edge.target}-copy-${Date.now()}`,
            })),
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold">Workflows</h1>
                    <p className="text-muted-foreground text-sm">Create and manage your workflow automations</p>
                </div>
                <div className="flex items-center gap-2">
                    {workflows.length > 0 && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-8 w-56 text-xs"
                            />
                        </div>
                    )}
                    <Link href="/workflow/new">
                        <Button size="sm">
                            <Plus className="h-4 w-4" />
                            New
                        </Button>
                    </Link>
                </div>
            </div>

            {workflows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <WorkflowIcon className="size-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No workflows yet</h3>
                    <p className="text-muted-foreground text-sm">Get started by creating your first workflow</p>
                    <Link href="/workflow/new" className="mt-3">
                        <Button size="xs">
                            <Plus className="h-4 w-4" />
                            Create Workflow
                        </Button>
                    </Link>
                </div>
            ) : filteredWorkflows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="text-lg font-semibold">No workflows found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your search query</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredWorkflows.map((workflow) => (
                        <WorkflowCard
                            key={workflow.id}
                            workflow={workflow}
                            onDelete={handleDelete}
                            onDuplicate={handleDuplicate}
                        />
                    ))}
                </div>
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Workflow</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this workflow? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
