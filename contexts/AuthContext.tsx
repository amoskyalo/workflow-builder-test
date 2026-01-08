"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UserSession, LoginFormValues, SignupFormValues } from "@/types";
import { getUserSession, saveUserSession, clearUserSession, generateId } from "@/lib/storage";
import dayjs from "dayjs";

interface AuthContextType {
    user: UserSession | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (values: LoginFormValues) => Promise<void>;
    signup: (values: SignupFormValues) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            const session = getUserSession();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(session);

            setIsLoading(false);
        }
    }, []);

    const login = async (values: LoginFormValues): Promise<void> => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const session: UserSession = {
            id: generateId(),
            name: values.email.split("@")[0],
            email: values.email,
            createdAt: dayjs().toISOString(),
        };

        saveUserSession(session);
        setUser(session);
        router.push("/dashboard");
    };

    const signup = async (values: SignupFormValues): Promise<void> => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const session: UserSession = {
            id: generateId(),
            name: values.name,
            email: values.email,
            createdAt: dayjs().toISOString(),
        };

        saveUserSession(session);
        setUser(session);
        router.push("/dashboard");
    };

    const logout = () => {
        clearUserSession();
        setUser(null);
        router.push("/login");
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
