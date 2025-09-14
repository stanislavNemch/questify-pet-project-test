import { createContext } from "react";
import type { UserData, LoginResponse } from "../types/auth";

// Описываем точную структуру контекста
export interface AuthContextType {
    isLoggedIn: boolean;
    user: UserData | null;
    token: string | null;
    login: (data: LoginResponse) => void;
    logout: () => void;
}

// Создаем и экспортируем сам контекст
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);
