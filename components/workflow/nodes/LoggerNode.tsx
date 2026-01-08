"use client";

import { memo, useCallback } from "react";
import { Handle, Position, NodeProps, Node, useReactFlow } from "@xyflow/react";
import { FileText } from "lucide-react";
import { LoggerNodeData } from "@/types";
import { BaseNode } from "./BaseNode";
import { Label } from "@/components/ui/label";

type LoggerNodeType = Node<LoggerNodeData, "logger">;

function LoggerNodeComponent({ id, data, selected }: NodeProps<LoggerNodeType>) {
    const { setNodes } = useReactFlow();

    const handleMessageChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setNodes((nodes) =>
                nodes.map((node) =>
                    node.id === id ? { ...node, data: { ...node.data, message: e.target.value } } : node,
                ),
            );
        },
        [id, setNodes],
    );

    return (
        <BaseNode
            selected={selected}
            executing={data.executing}
            headerColor="bg-orange-100 dark:bg-orange-950"
            icon={<FileText className="h-3 w-3 text-orange-600" />}
            title={data.label || "Logger"}
        >
            <Handle type="target" position={Position.Top} className="!bg-orange-500 !w-2 !h-2" />
            <div className="space-y-1">
                <Label htmlFor={`message-${id}`} className="text-[10px]">
                    Message
                </Label>
                <textarea
                    id={`message-${id}`}
                    value={data.message || ""}
                    onChange={handleMessageChange}
                    placeholder="Log message..."
                    rows={2}
                    className="w-full rounded-md border bg-background px-2 py-1 text-[10px] resize-none nodrag"
                />
            </div>
            <Handle type="source" position={Position.Bottom} className="!bg-orange-500 !w-2 !h-2" />
        </BaseNode>
    );
}

export const LoggerNode = memo(LoggerNodeComponent);
