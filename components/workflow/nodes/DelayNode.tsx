"use client";

import { memo, useCallback } from "react";
import { Handle, Position, NodeProps, Node, useReactFlow } from "@xyflow/react";
import { Clock } from "lucide-react";
import { DelayNodeData, DurationUnit } from "@/types";
import { BaseNode } from "./BaseNode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DelayNodeType = Node<DelayNodeData, "delay">;

function DelayNodeComponent({ id, data, selected }: NodeProps<DelayNodeType>) {
    const { setNodes } = useReactFlow();

    const handleDurationChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(e.target.value) || 0;
            setNodes((nodes) =>
                nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, duration: value } } : node)),
            );
        },
        [id, setNodes],
    );

    const handleUnitChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setNodes((nodes) =>
                nodes.map((node) =>
                    node.id === id
                        ? { ...node, data: { ...node.data, durationUnit: e.target.value as DurationUnit } }
                        : node,
                ),
            );
        },
        [id, setNodes],
    );

    return (
        <BaseNode
            selected={selected}
            executing={data.executing}
            headerColor="bg-blue-100 dark:bg-blue-950"
            icon={<Clock className="h-3 w-3 text-blue-600" />}
            title={data.label || "Delay"}
        >
            <Handle type="target" position={Position.Top} className="bg-blue-500 w-2 h-2" />
            <div className="space-y-1">
                <Label className="text-[10px]">Duration</Label>
                <div className="flex gap-1">
                    <Input
                        value={data.duration || ""}
                        onChange={handleDurationChange}
                        placeholder="0"
                        min={0}
                        className="h-6 text-[10px] w-12 nodrag"
                    />
                    <select
                        value={data.durationUnit || "seconds"}
                        onChange={handleUnitChange}
                        className="h-6 text-[10px] rounded-full border bg-background px-1 nodrag"
                    >
                        <option value="seconds">Sec</option>
                        <option value="minutes">Min</option>
                        <option value="hours">Hr</option>
                    </select>
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} className="bg-blue-500 w-2 h-2" />
        </BaseNode>
    );
}

export const DelayNode = memo(DelayNodeComponent);
