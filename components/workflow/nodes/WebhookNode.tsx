"use client";

import { memo, useCallback } from "react";
import { Handle, Position, NodeProps, Node, useReactFlow } from "@xyflow/react";
import { Globe } from "lucide-react";
import { WebhookNodeData } from "@/types";
import { BaseNode } from "./BaseNode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type WebhookNodeType = Node<WebhookNodeData, "webhook">;

function WebhookNodeComponent({ id, data, selected }: NodeProps<WebhookNodeType>) {
    const { setNodes } = useReactFlow();

    const handleUrlChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setNodes((nodes) =>
                nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, url: e.target.value } } : node)),
            );
        },
        [id, setNodes],
    );

    const handlePayloadChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setNodes((nodes) =>
                nodes.map((node) =>
                    node.id === id ? { ...node, data: { ...node.data, payload: e.target.value } } : node,
                ),
            );
        },
        [id, setNodes],
    );

    return (
        <BaseNode
            selected={selected}
            executing={data.executing}
            headerColor="bg-purple-100 dark:bg-purple-950"
            icon={<Globe className="h-3 w-3 text-purple-600" />}
            title={data.label || "Webhook"}
        >
            <Handle type="target" position={Position.Top} className="!bg-purple-500 !w-2 !h-2" />
            <div className="space-y-1">
                <div className="space-y-1">
                    <Label htmlFor={`url-${id}`} className="text-[10px]">
                        URL
                    </Label>
                    <Input
                        id={`url-${id}`}
                        value={data.url || ""}
                        onChange={handleUrlChange}
                        placeholder="https://..."
                        className="h-6 text-[10px] nodrag"
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor={`payload-${id}`} className="text-[10px]">
                        Payload
                    </Label>
                    <textarea
                        id={`payload-${id}`}
                        value={data.payload || ""}
                        onChange={handlePayloadChange}
                        placeholder='{"key": "value"}'
                        rows={2}
                        className="w-full rounded-md border bg-background px-2 py-1 text-[10px] resize-none nodrag"
                    />
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} className="!bg-purple-500 !w-2 !h-2" />
        </BaseNode>
    );
}

export const WebhookNode = memo(WebhookNodeComponent);
