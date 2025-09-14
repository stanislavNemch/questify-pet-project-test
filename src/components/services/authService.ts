import { api, setAuthHeader } from "../api/api";
import type {
    RegistrationRequest,
    RegistrationResponse,
    LoginRequest,
    LoginResponse,
    RefreshResponse,
} from "../types/auth";

export const authService = {
    setToken: setAuthHeader, // Используем общую функцию

    register: (data: RegistrationRequest) =>
        api.post<RegistrationResponse>("/auth/register", data),

    login: (data: LoginRequest) => api.post<LoginResponse>("/auth/login", data),

    refresh: (sid: string) =>
        api.post<RefreshResponse>("/auth/refresh", { sid }),

    logout: () => api.post("/auth/logout"),
};
