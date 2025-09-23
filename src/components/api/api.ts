import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import type { RefreshResponse } from "../types/auth";

const BASE_URL = "https://questify-backend.goit.global";

export const api = axios.create({
    baseURL: BASE_URL,
});

// --- Динамическая установка токена ---
export const setAuthHeader = (token: string | null) => {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
};

// --- Перехватчик ответов для обновления токенов ---
let isRefreshing = false;

type QueueEntry = {
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
};

let failedQueue: QueueEntry[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

type RetriableAxiosRequestConfig = AxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = (error.config ||
            {}) as RetriableAxiosRequestConfig;

        // Обработка ошибки соединения с сервером
        if (!error.response) {
            toast.error(
                "Ошибка соединения с сервером. Пожалуйста, проверьте ваше интернет-соединение."
            );
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<string | null>(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        } else {
                            originalRequest.headers = {
                                Authorization: `Bearer ${token}`,
                            };
                        }
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refreshToken");
            const sid = localStorage.getItem("sid");

            if (!refreshToken || !sid) {
                // Если нет токенов, ничего не делаем
                isRefreshing = false;
                return Promise.reject(error);
            }

            try {
                setAuthHeader(refreshToken); // Временно ставим refreshToken для запроса обновления
                const { data } = await api.post<RefreshResponse>(
                    "/auth/refresh",
                    { sid }
                );

                localStorage.setItem("accessToken", data.newAccessToken);
                localStorage.setItem("refreshToken", data.newRefreshToken);
                localStorage.setItem("sid", data.newSid);
                setAuthHeader(data.newAccessToken); // Устанавливаем новый accessToken

                processQueue(null, data.newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${data.newAccessToken}`;
                } else {
                    originalRequest.headers = {
                        Authorization: `Bearer ${data.newAccessToken}`,
                    };
                }

                return api(originalRequest);
            } catch (refreshError: unknown) {
                processQueue(refreshError, null);
                localStorage.clear();
                window.location.reload(); // Перезагрузка для выхода из системы
                toast.error("Сессия истекла. Пожалуйста, войдите снова.");
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
