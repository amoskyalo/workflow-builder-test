import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItemProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    description?: string;
}

function StatItem({ title, value, icon: Icon, description }: StatItemProps) {
    return (
        <div className="flex flex-1 flex-col px-6 py-5">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{title}</p>
                <div className="flex size-8 items-center justify-center rounded-xl bg-muted">
                    <Icon className="size-5 text-muted-foreground" />
                </div>
            </div>

            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    );
}

interface StatsContainerProps {
    children: React.ReactNode;
    className?: string;
}

function StatsContainer({ children, className }: StatsContainerProps) {
    return (
        <div
            className={cn(
                "flex flex-col md:flex-row rounded-xl border bg-background/60 backdrop-blur-md divide-y md:divide-y-0 md:divide-x divide-border/50",
                className,
            )}
        >
            {children}
        </div>
    );
}

export { StatItem, StatsContainer };
