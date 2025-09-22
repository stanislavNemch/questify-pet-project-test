import axios from "axios";
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
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Обработка ошибки соединения с сервером
        if (!error.response) {
            toast.error(
                "Ошибка соединения с сервером. Пожалуйста, проверьте ваше интернет-соединение."
            );
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
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
                originalRequest.headers.Authorization = `Bearer ${data.newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
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
