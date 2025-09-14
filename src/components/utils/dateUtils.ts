export const formatDisplayDate = (dateString: string): string => {
    // Нормализуем дату, убирая время, чтобы избежать проблем с часовыми поясами
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Бэкенд может возвращать дату с временем (YYYY-MM-DDTHH:mm:ss.sssZ)
    // Нам нужна только дата, поэтому берем часть до "T"
    // Важно: new Date('YYYY-MM-DD') создает дату в UTC,
    // что может привести к смещению на день.
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
