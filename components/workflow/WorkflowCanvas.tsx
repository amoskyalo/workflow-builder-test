"use client";

import { useCallback, useRef, useState, DragEvent } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    Connection,
    ReactFlowProvider,
    Node,
    Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./nodes";
import { NodePalette } from "./NodePalette";
import { ExecutionPanel } from "./ExecutionPanel";
import { NodeType, WorkflowNode, WorkflowEdge } from "@/types";
import { generateId } from "@/lib/storage";
import { executeWorkflow, ExecutionLog } from "@/lib/workflowEngine";

interface WorkflowCanvasProps {
    initialNodes?: WorkflowNode[];
    initialEdges?: WorkflowEdge[];
    onNodesChange?: (nodes: WorkflowNode[]) => void;
    onEdgesChange?: (edges: WorkflowEdge[]) => void;
}

function WorkflowCanvasInner({
    initialNodes = [],
    initialEdges = [],
    onNodesChange,
    onEdgesChange,
}: WorkflowCanvasProps) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes as Node[]);
    const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges as Edge[]);
    const reactFlowInstance = useRef<{
        screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number };
    } | null>(null);

    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<ExecutionLog[]>([]);
    const abortRef = useRef(false);

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => {
                const newEdges = addEdge(params, eds);
                onEdgesChange?.(newEdges as WorkflowEdge[]);
                return newEdges;
            });
        },
        [setEdges, onEdgesChange],
    );

    const handleNodesChange = useCallback(
        (changes: Parameters<typeof onNodesChangeInternal>[0]) => {
            onNodesChangeInternal(changes);
            setTimeout(() => {
                onNodesChange?.(nodes as WorkflowNode[]);
            }, 0);
        },
        [onNodesChangeInternal, onNodesChange, nodes],
    );

    const handleEdgesChange = useCallback(
        (changes: Parameters<typeof onEdgesChangeInternal>[0]) => {
            onEdgesChangeInternal(changes);
            setTimeout(() => {
                onEdgesChange?.(edges as WorkflowEdge[]);
            }, 0);
        },
        [onEdgesChangeInternal, onEdgesChange, edges],
    );

    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData("application/reactflow") as NodeType;

            if (!type || !reactFlowInstance.current || !reactFlowWrapper.current) {
                return;
            }

            const position = reactFlowInstance.current.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: generateId(),
                type,
                position,
                data: {
                    type,
                    label: type.charAt(0).toUpperCase() + type.slice(1),
                },
            };

            setNodes((nds) => {
                const newNodes = [...nds, newNode];
                onNodesChange?.(newNodes as WorkflowNode[]);
                return newNodes;
            });
        },
        [setNodes, onNodesChange],
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onInit = useCallback((instance: any) => {
        reactFlowInstance.current = instance;
    }, []);

    const setNodeExecuting = useCallback(
        (nodeId: string, executing: boolean) => {
            setNodes((nds) =>
                nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, executing } } : node)),
            );
        },
        [setNodes],
    );

    const clearAllExecuting = useCallback(() => {
        setNodes((nds) => nds.map((node) => ({ ...node, data: { ...node.data, executing: false } })));
    }, [setNodes]);

    const handleRun = useCallback(async () => {
        if (isRunning) return;

        abortRef.current = false;
        setIsRunning(true);
        setLogs([]);
        clearAllExecuting();

        await executeWorkflow(nodes as WorkflowNode[], edges as WorkflowEdge[], {
            onNodeEnter: (nodeId) => {
                if (!abortRef.current) {
                    setNodeExecuting(nodeId, true);
                }
            },
            onNodeExit: (nodeId) => {
                if (!abortRef.current) {
                    setNodeExecuting(nodeId, false);
                }
            },
            onLog: (log) => {
                if (!abortRef.current) {
                    setLogs((prev) => [...prev, log]);
                }
            },
            onComplete: () => {
                setIsRunning(false);
                clearAllExecuting();
            },
        });
    }, [isRunning, nodes, edges, setNodeExecuting, clearAllExecuting]);

    const handleStop = useCallback(() => {
        abortRef.current = true;
        setIsRunning(false);
        clearAllExecuting();
    }, [clearAllExecuting]);

    const handleClearLogs = useCallback(() => {
        setLogs([]);
    }, []);

    return (
        <>
            <div className="w-82 border-r bg-muted/30 overflow-y-auto">
                <NodePalette />
            </div>
            <div ref={reactFlowWrapper} className="flex-1">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={handleEdgesChange}
                    onConnect={onConnect}
                    onInit={onInit}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    snapToGrid
                    snapGrid={[15, 15]}
                    defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                    fitViewOnInit={false}
                    defaultEdgeOptions={{
                        style: { strokeWidth: 2 },
                        type: "smoothstep",
                    }}
                >
                    <Background gap={15} size={1} />
                    <Controls />
                    {/* <MiniMap nodeStrokeWidth={3} zoomable pannable className="bg-muted/50! border-3 border-red-800" /> */}
                </ReactFlow>
            </div>
            <div className="w-82 overflow-hidden">
                <ExecutionPanel
                    logs={logs}
                    isRunning={isRunning}
                    onRun={handleRun}
                    onStop={handleStop}
                    onClear={handleClearLogs}
                />
            </div>
        </>
    );
}

export function WorkflowCanvas(props: WorkflowCanvasProps) {
    return (
        <ReactFlowProvider>
            <WorkflowCanvasInner {...props} />
        </ReactFlowProvider>
    );
}
