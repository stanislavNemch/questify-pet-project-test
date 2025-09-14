import React, { useState, type ReactNode, useEffect } from "react";
import { authService } from "../services/authService";
import type { UserData, LoginResponse } from "../types/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");
        if (storedAccessToken && storedUser) {
            authService.setToken(storedAccessToken);
            setIsLoggedIn(true);
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                localStorage.clear();
            }
            setToken(storedAccessToken);
        }
    }, []);

    const handleLogin = (loginData: LoginResponse) => {
        localStorage.setItem("accessToken", loginData.accessToken);
        localStorage.setItem("refreshToken", loginData.refreshToken);
        localStorage.setItem("sid", loginData.sid);
        localStorage.setItem("user", JSON.stringify(loginData.userData));

        authService.setToken(loginData.accessToken);
        setIsLoggedIn(true);
        setUser(loginData.userData);
        setToken(loginData.accessToken);
    };

    const handleLogout = () => {
        localStorage.clear();
        authService.setToken(null);
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                token,
                login: handleLogin,
                logout: handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
