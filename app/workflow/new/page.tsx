"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWorkflows } from "@/contexts/WorkflowContext";
import { WorkflowNode, WorkflowEdge } from "@/types";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewWorkflowPage() {
    const router = useRouter();
    const { createWorkflow } = useWorkflows();
    const [name, setName] = useState("Untitled Workflow");
    const [nodes, setNodes] = useState<WorkflowNode[]>([]);
    const [edges, setEdges] = useState<WorkflowEdge[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const handleNodesChange = useCallback((newNodes: WorkflowNode[]) => {
        setNodes(newNodes);
    }, []);

    const handleEdgesChange = useCallback((newEdges: WorkflowEdge[]) => {
        setEdges(newEdges);
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const workflow = createWorkflow({
                name,
                nodes,
                edges,
            });
            router.push(`/workflow/${workflow.id}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b bg-background px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/workflows">
                        <Button variant="outline" size="xs">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Exit
                        </Button>
                    </Link>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-7 w-64 bg-transparent text-xs border-none rounded-none shadow-none focus-visible:ring-0"
                        placeholder="Workflow name"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/workflows">
                        <Button variant="ghost" size="xs">
                            Cancel
                        </Button>
                    </Link>
                    <Button size="xs" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-3 animate-spin" /> : <Save className="h-1 w-1" />}
                        Save
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <WorkflowCanvas onNodesChange={handleNodesChange} onEdgesChange={handleEdgesChange} />
            </div>
        </div>
    );
}
