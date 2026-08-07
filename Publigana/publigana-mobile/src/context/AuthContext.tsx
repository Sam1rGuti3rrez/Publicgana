import React, { createContext, useContext, useEffect, useState } from "react";

import authService from "@/services/auth/authService";
import {
    clearSession,
    getAccessToken,
    saveAccessToken,
    saveRefreshToken,
} from "@/storage/tokenStorage";
import type { LoginResponse, UserResponse } from "@/types/auth";

export type AppRole = "promotor" | "empresa";

interface AuthContextType {
    user: UserResponse | null;
    isLoading: boolean;
    login: (response: LoginResponse) => Promise<void>;
    logout: () => Promise<void>;
    devRole: AppRole;
    setDevRole: (role: AppRole) => void;
    activeRole: AppRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [devRole, setDevRole] = useState<AppRole>("empresa");

    // Restore session from stored token on startup
    useEffect(() => {
        async function restoreSession() {
            try {
                const token = await getAccessToken();
                if (token) {
                    const userData = await authService.me();
                    setUser(userData);
                }
            } catch {
                await clearSession();
            } finally {
                setIsLoading(false);
            }
        }
        restoreSession();
    }, []);

    const login = async (response: LoginResponse) => {
        await saveAccessToken(response.accessToken);
        if (response.refreshToken) {
            await saveRefreshToken(response.refreshToken);
        }
        setUser(response.usuario);
    };

    const logout = async () => {
        await clearSession();
        setUser(null);
    };

    const activeRole: AppRole = user?.rol?.toLowerCase() === "empresa" ? "empresa" : devRole;

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                devRole,
                setDevRole,
                activeRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }

    return context;
}