"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Workflow } from "@/types";
import { useWorkflows } from "@/contexts/WorkflowContext";
import { MoreHorizontal, Eye, Copy, Trash2, Workflow as WorkflowIcon } from "lucide-react";

dayjs.extend(relativeTime);

interface RecentWorkflowsProps {
    workflows: Workflow[];
}

export function RecentWorkflows({ workflows }: RecentWorkflowsProps) {
    const router = useRouter();
    const { deleteWorkflowById, createWorkflow } = useWorkflows();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(null);

    const handleView = (workflow: Workflow) => {
        router.push(`/workflow/${workflow.id}`);
    };

    const handleDuplicate = (workflow: Workflow) => {
        createWorkflow({
            name: `${workflow.name} (Copy)`,
            description: workflow.description,
            nodes: workflow.nodes,
            edges: workflow.edges,
        });
    };

    const handleDeleteClick = (workflow: Workflow) => {
        setWorkflowToDelete(workflow);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (workflowToDelete) {
            deleteWorkflowById(workflowToDelete.id);
            setDeleteDialogOpen(false);
            setWorkflowToDelete(null);
        }
    };

    if (workflows.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Workflows</CardTitle>
                    <CardDescription>Your recently updated workflows will appear here</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <WorkflowIcon className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No workflows yet</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="p-0 gap-0">
                <CardHeader className="flex flex-row items-center justify-between px-4! pt-3! pb-3! border-b">
                    <div>
                        <CardTitle>Recent Workflows</CardTitle>
                        <CardDescription>Your {workflows.length} most recently updated workflows</CardDescription>
                    </div>
                    <Link href="/dashboard/workflows">
                        <Button variant="outline" size="xs">
                            View All
                        </Button>
                    </Link>
                </CardHeader>

                <CardContent className="p-0 px-4!">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Nodes</TableHead>
                                <TableHead>Connections</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workflows.map((workflow) => (
                                <TableRow key={workflow.id}>
                                    <TableCell>
                                        <Link
                                            href={`/workflow/${workflow.id}`}
                                            className="font-medium hover:text-primary hover:underline transition-colors"
                                        >
                                            {workflow.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                        >
                                            Active
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{workflow.nodes.length}</TableCell>
                                    <TableCell className="text-muted-foreground">{workflow.edges.length}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {dayjs(workflow.updatedAt).fromNow()}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleView(workflow)}>
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDuplicate(workflow)}>
                                                    <Copy className="h-4 w-4" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() => handleDeleteClick(workflow)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Workflow</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{workflowToDelete?.name}&quot;? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
