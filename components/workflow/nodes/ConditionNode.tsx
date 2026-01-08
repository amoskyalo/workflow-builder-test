"use client";

import { memo, useCallback } from "react";
import { Handle, Position, NodeProps, Node, useReactFlow } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { ConditionNodeData } from "@/types";
import { BaseNode } from "./BaseNode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ConditionNodeType = Node<ConditionNodeData, "condition">;

function ConditionNodeComponent({ id, data, selected }: NodeProps<ConditionNodeType>) {
    const { setNodes } = useReactFlow();

    const handleConditionChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setNodes((nodes) =>
                nodes.map((node) =>
                    node.id === id ? { ...node, data: { ...node.data, condition: e.target.value } } : node,
                ),
            );
        },
        [id, setNodes],
    );

    return (
        <BaseNode
            selected={selected}
            executing={data.executing}
            headerColor="bg-yellow-100 dark:bg-yellow-950"
            icon={<GitBranch className="h-3 w-3 text-yellow-600" />}
            title={data.label || "Condition"}
        >
            <Handle type="target" position={Position.Top} className="bg-yellow-500 w-2 h-2" />
            <div className="space-y-1">
                <Label htmlFor={`condition-${id}`} className="text-[10px]">
                    Expression
                </Label>
                <Input
                    id={`condition-${id}`}
                    value={data.condition || ""}
                    onChange={handleConditionChange}
                    placeholder="value > 10"
                    className="h-6 text-[10px] nodrag px-2! w-[140px]"
                />
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                <span className="text-green-600">True</span>
                <span className="text-red-600">False</span>
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                id="true"
                style={{ left: "25%" }}
                className="bg-green-500 w-2 h-2"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="false"
                style={{ left: "75%" }}
                className="bg-red-500 w-2 h-2"
            />
        </BaseNode>
    );
}

export const ConditionNode = memo(ConditionNodeComponent);
