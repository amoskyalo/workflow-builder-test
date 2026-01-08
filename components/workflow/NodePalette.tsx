"use client";

import { DragEvent, useState } from "react";
import { NodeType, NodePaletteItem } from "@/types";
import { cn } from "@/lib/utils";
import { Play, GitBranch, Clock, Globe, FileText, Square, Star } from "lucide-react";

const paletteItems: NodePaletteItem[] = [
    {
        type: "start",
        label: "Start",
        description: "Entry point for workflow",
    },
    {
        type: "condition",
        label: "Condition",
        description: "Branch based on logic",
    },
    {
        type: "delay",
        label: "Delay",
        description: "Wait for specified time",
    },
    {
        type: "webhook",
        label: "Webhook",
        description: "Make HTTP API calls",
    },
    {
        type: "logger",
        label: "Logger",
        description: "Log messages for debugging",
    },
    {
        type: "end",
        label: "End",
        description: "Workflow termination point",
    },
];

const iconMap: Record<NodeType, React.ElementType> = {
    start: Play,
    condition: GitBranch,
    delay: Clock,
    webhook: Globe,
    logger: FileText,
    end: Square,
};

const iconColorMap: Record<NodeType, string> = {
    start: "text-green-600",
    condition: "text-yellow-600",
    delay: "text-blue-600",
    webhook: "text-purple-600",
    logger: "text-orange-600",
    end: "text-red-600",
};

interface NodePaletteProps {
    className?: string;
}

export function NodePalette({ className }: NodePaletteProps) {
    const [favorites, setFavorites] = useState<Set<NodeType>>(new Set());

    const onDragStart = (event: DragEvent, nodeType: NodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    const toggleFavorite = (type: NodeType, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(type)) {
                next.delete(type);
            } else {
                next.add(type);
            }
            return next;
        });
    };

    return (
        <div className={cn("p-4 pt-2", className)}>
            <div className="mb-3">
                <h3 className="font-semibold text-sm">Node Types</h3>
                <p className="text-xs text-muted-foreground">Drag and drop to add nodes to the canvas</p>
            </div>

            <div className="space-y-2">
                {paletteItems.map((item) => {
                    const Icon = iconMap[item.type];
                    const isFavorite = favorites.has(item.type);
                    return (
                        <div
                            key={item.type}
                            className="flex items-center gap-3 p-3 rounded-md border bg-card cursor-grab"
                            draggable
                            onDragStart={(e) => onDragStart(e, item.type)}
                        >
                            <div className={cn("shrink-0", iconColorMap[item.type])}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{item.label}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                            <button
                                onClick={(e) => toggleFavorite(item.type, e)}
                                className="shrink-0 p-1 hover:bg-muted rounded transition-colors"
                            >
                                <Star
                                    className={cn(
                                        "h-4 w-4",
                                        isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/50",
                                    )}
                                />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
