"use client";

import { useEffect, useRef } from "react";
import { ExecutionLog } from "@/lib/workflowEngine";
import { cn } from "@/lib/utils";
import { Play, Square, Terminal, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

interface ExecutionPanelProps {
    logs: ExecutionLog[];
    isRunning: boolean;
    onRun: () => void;
    onStop: () => void;
    onClear: () => void;
}

const typeIcons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
};

const typeColors = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
};

const typeBgColors = {
    info: "bg-blue-500/10",
    success: "bg-green-500/10",
    warning: "bg-yellow-500/10",
    error: "bg-red-500/10",
};

export function ExecutionPanel({ logs, isRunning, onRun, onStop, onClear }: ExecutionPanelProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex flex-col h-full border-l bg-background overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <span className="font-semibold text-sm">Execution Console</span>
                    {isRunning && (
                        <span className="flex items-center gap-1 text-xs text-green-500">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Running
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {isRunning ? (
                        <Button type="button" size="xs" variant="destructive" onClick={onStop}>
                            <Square className="size-2" />
                            Stop
                        </Button>
                    ) : (
                        <Button type="button" size="xs" onClick={onRun}>
                            <Play className="size-2" />
                            Run
                        </Button>
                    )}
                    <Button type="button" size="xs" variant="outline" onClick={onClear} disabled={isRunning}>
                        Clear
                    </Button>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Terminal className="h-8 w-8 mb-2 opacity-50" />
                        <p>No execution logs yet</p>
                        <p className="text-xs mt-1">Click &quot;Run&quot; to execute the workflow</p>
                    </div>
                ) : (
                    logs.map((log) => {
                        const Icon = typeIcons[log.type];
                        return (
                            <div
                                key={log.id}
                                className={cn("flex items-start gap-2 px-2 py-1.5 rounded-sm", typeBgColors[log.type])}
                            >
                                <Icon className={cn("h-3 w-3 mt-0.5 shrink-0", typeColors[log.type])} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">
                                            {dayjs(log.timestamp).format("HH:mm:ss.SSS")}
                                        </span>
                                        {log.nodeLabel && (
                                            <span className="font-semibold text-foreground">[{log.nodeLabel}]</span>
                                        )}
                                    </div>
                                    <p className={cn("wrap-break-word", typeColors[log.type])}>{log.message}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
                <p>Sample variables: value=15, count=3, x=10</p>
            </div>
        </div>
    );
}
