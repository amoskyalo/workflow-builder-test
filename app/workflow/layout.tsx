import { ReactNode } from "react";
import { WorkflowProvider } from "@/contexts/WorkflowContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

export const metadata = {
    title: "Workflow Editor | Workflow Builder",
    description: "Create and edit your workflows",
};

interface WorkflowEditorLayoutProps {
    children: ReactNode;
}

export default function WorkflowEditorLayout({ children }: WorkflowEditorLayoutProps) {
    return (
        <ProtectedRoute>
            <WorkflowProvider>
                <div className="h-dvh w-dvw overflow-hidden">{children}</div>
            </WorkflowProvider>
        </ProtectedRoute>
    );
}
