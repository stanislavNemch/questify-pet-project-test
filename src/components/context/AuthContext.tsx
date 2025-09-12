import React, {
    createContext,
    useState,
    useContext,
    type ReactNode,
    useEffect,
} from "react";
import { authService } from "../services/authService";

interface AuthContextType {
    isLoggedIn: boolean;
    user: any | null;
    token: string | null;
    login: (data: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState<string | null>(null);

    // Инициализация при загрузке
    useEffect(() => {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");
        if (storedAccessToken && storedUser) {
            authService.setToken(storedAccessToken);
            setIsLoggedIn(true);
            setUser(JSON.parse(storedUser));
            setToken(storedAccessToken);
        }
    }, []);

    const handleLogin = (loginData: any) => {
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
