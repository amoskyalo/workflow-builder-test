import { WorkflowNode, WorkflowEdge, NodeType } from "@/types";

export interface ExecutionLog {
    id: string;
    timestamp: Date;
    nodeId: string;
    nodeType: NodeType;
    nodeLabel: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
}

export interface ExecutionState {
    isRunning: boolean;
    currentNodeId: string | null;
    logs: ExecutionLog[];
    visitedNodes: string[];
}

export interface ExecutionContext {
    variables: Record<string, unknown>;
}

type OnNodeEnter = (nodeId: string) => void;
type OnNodeExit = (nodeId: string) => void;
type OnLog = (log: ExecutionLog) => void;
type OnComplete = () => void;

interface ExecutionCallbacks {
    onNodeEnter: OnNodeEnter;
    onNodeExit: OnNodeExit;
    onLog: OnLog;
    onComplete: OnComplete;
}

function generateLogId(): string {
    return `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createLog(
    nodeId: string,
    nodeType: NodeType,
    nodeLabel: string,
    message: string,
    type: ExecutionLog["type"] = "info",
): ExecutionLog {
    return {
        id: generateLogId(),
        timestamp: new Date(),
        nodeId,
        nodeType,
        nodeLabel,
        message,
        type,
    };
}

function findStartNode(nodes: WorkflowNode[]): WorkflowNode | null {
    return nodes.find((n) => n.type === "start") || null;
}

function findOutgoingEdges(nodeId: string, edges: WorkflowEdge[]): WorkflowEdge[] {
    return edges.filter((e) => e.source === nodeId);
}

function findNodeById(nodeId: string, nodes: WorkflowNode[]): WorkflowNode | null {
    return nodes.find((n) => n.id === nodeId) || null;
}

function evaluateCondition(condition: string, context: ExecutionContext): boolean {
    if (!condition || condition.trim() === "") {
        return true;
    }

    try {
        let expr = condition;

        for (const [key, val] of Object.entries(context.variables)) {
            const regex = new RegExp(`\\b${key}\\b`, "g");
            expr = expr.replace(regex, JSON.stringify(val));
        }

        if (!/^[\d\s+\-*/<>=!&|().,"'true false null]+$/i.test(expr)) {
            console.warn("Complex expression detected, defaulting to true:", expr);
            return true;
        }

        return Boolean(eval(expr));
    } catch (error) {
        console.error("Failed to evaluate condition:", condition, error);
        return true;
    }
}

async function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDurationMs(duration: number | undefined, unit: string | undefined): number {
    const d = duration || 1;
    switch (unit) {
        case "minutes":
            return d * 1000 * 60;
        case "hours":
            return d * 1000 * 60 * 60;
        case "seconds":
        default:
            return Math.min(d * 1000, 5000);
    }
}

export async function executeWorkflow(
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    callbacks: ExecutionCallbacks,
    context: ExecutionContext = { variables: { value: 15, count: 3, x: 10 } },
): Promise<void> {
    const { onNodeEnter, onNodeExit, onLog, onComplete } = callbacks;

    const startNode = findStartNode(nodes);

    if (!startNode) {
        onLog(createLog("", "start", "System", "No Start node found in workflow", "error"));
        onComplete();
        return;
    }

    onLog(createLog("", "start", "System", "Starting workflow execution...", "info"));
    onLog(createLog("", "start", "System", `Context variables: ${JSON.stringify(context.variables)}`, "info"));

    const visited = new Set<string>();
    const queue: WorkflowNode[] = [startNode];

    while (queue.length > 0) {
        const currentNode = queue.shift()!;

        if (visited.has(currentNode.id)) {
            continue;
        }
        visited.add(currentNode.id);

        const nodeLabel = (currentNode.data.label as string) || currentNode.type;
        const currentType = currentNode.type;
        let shouldQueueNext = true;

        onNodeEnter(currentNode.id);
        await delay(300);

        switch (currentType) {
            case "start": {
                onLog(createLog(currentNode.id, "start", nodeLabel, "Workflow started", "success"));
                await delay(500);
                break;
            }

            case "condition": {
                const condition = (currentNode.data.condition as string) || "";
                const result = evaluateCondition(condition, context);
                onLog(
                    createLog(
                        currentNode.id,
                        "condition",
                        nodeLabel,
                        `Evaluating: "${condition || "empty"}" → ${result ? "TRUE" : "FALSE"}`,
                        result ? "success" : "warning",
                    ),
                );
                await delay(800);

                const outEdges = findOutgoingEdges(currentNode.id, edges);
                for (const edge of outEdges) {
                    const targetNode = findNodeById(edge.target, nodes);
                    if (targetNode) {
                        const isTrueBranch = edge.sourceHandle === "true" || (!edge.sourceHandle && result);
                        const isFalseBranch = edge.sourceHandle === "false" || (!edge.sourceHandle && !result);

                        if ((result && isTrueBranch) || (!result && isFalseBranch) || !edge.sourceHandle) {
                            queue.push(targetNode);
                            break;
                        }
                    }
                }
                shouldQueueNext = false;
                break;
            }

            case "delay": {
                const duration = (currentNode.data.duration as number) || 1;
                const unit = (currentNode.data.durationUnit as string) || "seconds";
                const actualDelay = Math.min(getDurationMs(duration, unit), 5000);

                onLog(
                    createLog(
                        currentNode.id,
                        "delay",
                        nodeLabel,
                        `Waiting ${duration} ${unit}... (simulated: ${actualDelay}ms)`,
                        "info",
                    ),
                );
                await delay(actualDelay);
                onLog(createLog(currentNode.id, "delay", nodeLabel, "Delay completed", "success"));
                break;
            }

            case "webhook": {
                const url = (currentNode.data.url as string) || "https://example.com/webhook";
                const payload = (currentNode.data.payload as string) || "{}";

                onLog(createLog(currentNode.id, "webhook", nodeLabel, `Calling webhook: ${url}`, "info"));
                await delay(600);

                onLog(
                    createLog(
                        currentNode.id,
                        "webhook",
                        nodeLabel,
                        `Payload: ${payload.substring(0, 50)}${payload.length > 50 ? "..." : ""}`,
                        "info",
                    ),
                );
                await delay(400);
                onLog(
                    createLog(
                        currentNode.id,
                        "webhook",
                        nodeLabel,
                        "Webhook called successfully (simulated)",
                        "success",
                    ),
                );
                break;
            }

            case "logger": {
                const message = (currentNode.data.message as string) || "No message";
                onLog(createLog(currentNode.id, "logger", nodeLabel, `LOG: ${message}`, "info"));
                await delay(500);
                break;
            }

            case "end": {
                onLog(createLog(currentNode.id, "end", nodeLabel, "Workflow completed", "success"));
                await delay(500);
                shouldQueueNext = false;
                break;
            }

            default:
                onLog(
                    createLog(
                        currentNode.id,
                        currentNode.type,
                        nodeLabel,
                        `Unknown node type: ${currentNode.type}`,
                        "warning",
                    ),
                );
        }

        onNodeExit(currentNode.id);
        await delay(200);

        if (shouldQueueNext) {
            const outEdges = findOutgoingEdges(currentNode.id, edges);
            for (const edge of outEdges) {
                const targetNode = findNodeById(edge.target, nodes);
                if (targetNode && !visited.has(targetNode.id)) {
                    queue.push(targetNode);
                }
            }
        }
    }

    onLog(createLog("", "end", "System", "Execution finished", "success"));
    onComplete();
}
