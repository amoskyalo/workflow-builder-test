"use client";

import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Workflow } from "@/types";
import { Button } from "@/components/ui/button";
import { Check, Clock, Pencil, Copy, Trash2 } from "lucide-react";

dayjs.extend(relativeTime);

interface WorkflowCardProps {
    workflow: Workflow;
    onDelete: (id: string) => void;
    onDuplicate: (workflow: Workflow) => void;
}

export function WorkflowCard({ workflow, onDelete, onDuplicate }: WorkflowCardProps) {
    const isActive = workflow.nodes.length > 0;
    const nodeTypes = [...new Set(workflow.nodes.map((n) => n.type))];

    return (
        <div className="flex flex-col rounded-xl border bg-card p-4">
            <div className="mb-2">
                {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-600 bg-green-50 rounded-full">
                        <Check className="h-3 w-3" />
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Draft
                    </span>
                )}
            </div>

            <h3 className="font-semibold text-sm truncate">{workflow.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{workflow.description || "No description"}</p>

            <div className="flex items-center gap-6 mt-2">
                <div>
                    <p className="text-lg font-semibold">{workflow.nodes.length}</p>
                    <p className="text-xs text-muted-foreground">Nodes</p>
                </div>
                <div>
                    <p className="text-lg font-semibold">{workflow.edges.length}</p>
                    <p className="text-xs text-muted-foreground">Connections</p>
                </div>
            </div>

            <div className="border-t mt-4 space-y-4">
                <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-2">Node Types</p>
                    <div className="flex flex-wrap gap-1.5">
                        {nodeTypes.length > 0 ? (
                            nodeTypes.map((type) => (
                                <span
                                    key={type}
                                    className="inline-flex px-2 py-0.5 text-xs rounded-full border border-dashed border-border text-muted-foreground capitalize"
                                >
                                    {type}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-muted-foreground/60">No nodes yet</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <Link href={`/workflow/${workflow.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon-sm" onClick={() => onDuplicate(workflow)} className="shrink-0">
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(workflow.id)}
                        className="shrink-0 text-muted-foreground hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
