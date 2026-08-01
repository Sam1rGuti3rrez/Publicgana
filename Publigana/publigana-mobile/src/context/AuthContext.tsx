import React, { createContext, useContext, useState } from "react";

export type AppRole = "promotor" | "empresa";

interface AuthUser {
    role?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (userData: AuthUser) => void;
    logout: () => void;
    devRole: AppRole;
    setDevRole: (role: AppRole) => void;
    activeRole: AppRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<AuthUser | null>(null);
    const [devRole, setDevRole] = useState<AppRole>("empresa");

    const login = (userData: AuthUser) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const activeRole: AppRole = user?.role?.toLowerCase() === "empresa" ? "empresa" : devRole;

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                devRole,
                setDevRole,
                activeRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth debe usarse dentro de AuthProvider"
        );
    }

    return context;
}