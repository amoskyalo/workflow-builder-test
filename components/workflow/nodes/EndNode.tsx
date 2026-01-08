"use client";

import { memo } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Square } from "lucide-react";
import { EndNodeData } from "@/types";
import { BaseNode } from "./BaseNode";

type EndNodeType = Node<EndNodeData, "end">;

function EndNodeComponent({ data, selected }: NodeProps<EndNodeType>) {
    return (
        <BaseNode
            selected={selected}
            executing={data.executing}
            headerColor="bg-red-100 dark:bg-red-950"
            icon={<Square className="h-3 w-3 text-red-600" />}
            title={data.label || "End"}
        >
            <Handle type="target" position={Position.Top} className="bg-red-500 w-2 h-2" />
            <p className="text-muted-foreground">Termination</p>
        </BaseNode>
    );
}

export const EndNode = memo(EndNodeComponent);
