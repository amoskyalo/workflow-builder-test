"use client";

import { memo } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Play } from "lucide-react";
import { StartNodeData } from "@/types";
import { BaseNode } from "./BaseNode";

type StartNodeType = Node<StartNodeData, "start">;

function StartNodeComponent({ data, selected }: NodeProps<StartNodeType>) {
    return (
        <BaseNode
            selected={selected}
            executing={data.executing}
            headerColor="bg-green-100 dark:bg-green-950"
            icon={<Play className="h-3 w-3 text-green-600" />}
            title={data.label || "Start"}
        >
            <p className="text-muted-foreground">Entry point</p>
            <Handle type="source" position={Position.Bottom} className="bg-green-500 w-2 h-2" />
        </BaseNode>
    );
}

export const StartNode = memo(StartNodeComponent);
