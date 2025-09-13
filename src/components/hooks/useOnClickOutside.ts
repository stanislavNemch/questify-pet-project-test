import { useEffect } from "react";
import type { RefObject } from "react";

type Event = MouseEvent | TouchEvent;

export const useOnClickOutside = (
    // Говорим TypeScript, что ref может быть для HTMLElement
    ref: RefObject<HTMLElement | null>,
    handler: (event: Event) => void
) => {
    useEffect(() => {
        const listener = (event: Event) => {
            // Получаем сам DOM-элемент из ref
            const el = ref?.current;

            // Проверяем, что элемент существует и что клик был НЕ по нему или его дочерним элементам
            if (!el || el.contains((event?.target as Node) || null)) {
                return;
            }

            handler(event); // Вызываем функцию-обработчик
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        // Очищаем слушатели событий при размонтировании компонента, чтобы избежать утечек памяти
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]); // Зависимости эффекта
};
