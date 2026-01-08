"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BaseNodeProps {
    children: ReactNode;
    className?: string;
    selected?: boolean;
    executing?: boolean;
    headerColor?: string;
    icon?: ReactNode;
    title: string;
}

export function BaseNode({ children, className, selected, executing, headerColor, icon, title }: BaseNodeProps) {
    return (
        <div
            className={cn(
                "rounded-md border bg-card shadow-sm min-w-[140px] max-w-[180px] transition-all duration-300",
                selected && "ring-1 ring-primary shadow-md",
                executing && "ring-4 ring-green-500 shadow-lg shadow-green-500/50 scale-105",
                className,
            )}
        >
            <div
                className={cn(
                    "flex items-center gap-1.5 px-2 py-1.5 rounded-t-md border-b transition-colors duration-300",
                    headerColor || "bg-muted",
                    executing && "bg-green-500 text-white",
                )}
            >
                {icon}
                <span className="font-medium text-xs">{title}</span>
                {executing && (
                    <span className="ml-auto flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                    </span>
                )}
            </div>
            <div className="p-2 text-xs">{children}</div>
        </div>
    );
}
