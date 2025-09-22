import { useEffect } from "react";

/**
 * Кастомный хук для выполнения действия при нажатии клавиши Escape.
 * @param {() => void} onEscape - Функция обратного вызова, которая будет вызвана при нажатии Escape.
 * @param {boolean} [isActive=true] - Флаг для активации/деактивации хука. По умолчанию true.
 */
export const useEscapeKey = (
    onEscape: () => void,
    isActive: boolean = true
) => {
    useEffect(() => {
        if (!isActive) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onEscape();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onEscape, isActive]);
};
