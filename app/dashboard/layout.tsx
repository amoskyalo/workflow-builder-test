import { ReactNode } from "react";
import { WorkflowProvider } from "@/contexts/WorkflowContext";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

export const metadata = {
    title: "Dashboard | Workflow Builder",
    description: "Manage your workflows and view analytics",
};

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <ProtectedRoute>
            <WorkflowProvider>
                <div className="min-h-screen bg-background">
                    <Header />
                    <main className="container mx-auto px-4 py-8 max-w-5xl">{children}</main>
                </div>
            </WorkflowProvider>
        </ProtectedRoute>
    );
}
