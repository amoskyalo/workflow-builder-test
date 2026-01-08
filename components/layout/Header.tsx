"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Workflow, LayoutDashboard, List, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/workflows", label: "Workflows", icon: List },
];

export function Header() {
    const { user, logout, isAuthenticated } = useAuth();
    const pathname = usePathname();

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 max-w-5xl items-center justify-center px-4">
                <Link href="/" className="flex items-center gap-2 mr-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Workflow className="h-4 w-4" />
                    </div>
                </Link>

                <div className="flex-1 flex items-center justify-center">
                    {isAuthenticated && (
                        <nav className="flex items-center gap-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    item.href === "/dashboard"
                                        ? pathname === item.href
                                        : pathname === item.href || pathname.startsWith(item.href + "/");
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 rounded-full px-2 py-[6px] text-xs font-medium transition-colors",
                                            "border border-border hover:bg-accent",
                                            isActive
                                                ? "bg-primary/10 text-primary border-primary/30"
                                                : "text-muted-foreground",
                                        )}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline-block">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    )}
                </div>

                <div className="ml-auto flex items-center gap-2">
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                                    {user ? getInitials(user.name) : "U"}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1 leading-none">
                                        <p className="font-medium">{user?.name}</p>
                                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
