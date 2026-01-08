"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkflows } from "@/contexts/WorkflowContext";
import { WorkflowNode, WorkflowEdge, Workflow } from "@/types";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditWorkflowPage() {
    const params = useParams();
    const router = useRouter();
    const { getWorkflowById, updateWorkflowById } = useWorkflows();
    const [workflow, setWorkflow] = useState<Workflow | null>(null);
    const [name, setName] = useState("");
    const [nodes, setNodes] = useState<WorkflowNode[]>([]);
    const [edges, setEdges] = useState<WorkflowEdge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            const id = params.id as string;
            const foundWorkflow = getWorkflowById(id);
            if (foundWorkflow) {
                setWorkflow(foundWorkflow);
                setName(foundWorkflow.name);
                setNodes(foundWorkflow.nodes);
                setEdges(foundWorkflow.edges);
            } else {
                router.push("/dashboard/workflows");
            }
            setIsLoading(false);
        }
    }, [params.id, getWorkflowById, router]);

    const handleNodesChange = useCallback((newNodes: WorkflowNode[]) => {
        setNodes(newNodes);
    }, []);

    const handleEdgesChange = useCallback((newEdges: WorkflowEdge[]) => {
        setEdges(newEdges);
    }, []);

    const handleSave = async () => {
        if (!workflow) return;
        setIsSaving(true);
        try {
            updateWorkflowById(workflow.id, {
                name,
                nodes,
                edges,
            });
            router.push("/dashboard/workflows");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!workflow) {
        return null;
    }

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
                        className="h-8 w-64 bg-transparent text-xs focus-visible:ring-0"
                        placeholder="Workflow name"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button size="xs" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Save className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        Save
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex">
                <WorkflowCanvas
                    initialNodes={nodes}
                    initialEdges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={handleEdgesChange}
                />
            </div>
        </div>
    );
}
