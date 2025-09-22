// Запросы к API
export interface RegistrationRequest {
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// Ответы от API
export interface RegistrationResponse {
    email: string;
    id: string;
}

export interface UserData {
    email: string;
    id: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    sid: string;
    userData: UserData;
}

// Новый тип для ответа от /auth/refresh
export interface RefreshResponse {
    newAccessToken: string;
    newRefreshToken: string;
    newSid: string;
}
