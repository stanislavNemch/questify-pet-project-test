import axios from "axios";

type ApiErrorBody = { message?: string };

export function getErrorMessage(
    error: unknown,
    fallback = "An error occurred"
): string {
    if (axios.isAxiosError<ApiErrorBody>(error)) {
        return error.response?.data?.message || error.message || fallback;
    }
    if (error instanceof Error) {
        return error.message || fallback;
    }
    return fallback;
}
