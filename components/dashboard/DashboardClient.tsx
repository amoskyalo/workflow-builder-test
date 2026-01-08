"use client";

import { useWorkflows } from "@/contexts/WorkflowContext";
import { StatItem, StatsContainer } from "./StatsCard";
import { RecentWorkflows } from "./RecentWorkflows";
import { Workflow, Box, Activity } from "lucide-react";

export function DashboardClient() {
    const { stats, isLoading } = useWorkflows();

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="h-32 rounded-2xl border bg-card animate-pulse" />
                <div className="h-96 rounded-2xl border bg-card animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <StatsContainer>
                <StatItem
                    title="Total Workflows"
                    value={stats.totalWorkflows}
                    icon={Workflow}
                    description="All workflows in your workspace"
                />
                <StatItem
                    title="Total Nodes"
                    value={stats.totalNodes}
                    icon={Box}
                    description="Nodes across all workflows"
                />
                <StatItem
                    title="Avg. Nodes per Workflow"
                    value={stats.totalWorkflows > 0 ? (stats.totalNodes / stats.totalWorkflows).toFixed(1) : 0}
                    icon={Activity}
                    description="Average workflow complexity"
                />
            </StatsContainer>

            <RecentWorkflows workflows={stats.recentWorkflows} />
        </div>
    );
}
