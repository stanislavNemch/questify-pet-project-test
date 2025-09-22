export const formatDisplayDate = (dateString: string): string => {
    // Нормализуем дату, убирая время, чтобы избежать проблем с часовыми поясами
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Бэкенд может возвращать дату с временем (YYYY-MM-DDTHH:mm:ss.sssZ)
    // Нам нужна только дата, поэтому берем часть до "T"
    // Этот трюк с заменой дефисов на слэши создает дату в локальной таймзоне.
    const cardDateLocal = new Date(dateString.split("T")[0].replace(/-/g, "/"));

    if (cardDateLocal.getTime() === today.getTime()) {
        return "TODAY";
    }

    if (cardDateLocal.getTime() === tomorrow.getTime()) {
        return "TOMORROW";
    }

    // Если дата другая, возвращаем день недели на английском
    return cardDateLocal.toLocaleDateString("en-US", { weekday: "long" });
};

export const isQuestDueSoon = (date: string, time: string): boolean => {
    // Собираем полную дату дедлайна из строки даты и времени
    const deadlineString = `${date.split("T")[0]}T${time}:00`;
    const deadline = new Date(deadlineString).getTime();

    // Получаем текущее время
    const now = new Date().getTime();

    // Вычисляем разницу в миллисекундах
    const difference = deadline - now;

    // Один час в миллисекундах = 60 минут * 60 секунд * 1000 миллисекунд
    const oneHour = 60 * 60 * 1000;

    // Возвращаем true, если разница положительная (дедлайн еще не прошел)
    // и меньше или равна одному часу.
    return difference > 0 && difference <= oneHour;
};
