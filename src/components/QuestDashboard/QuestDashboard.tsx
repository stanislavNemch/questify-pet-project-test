import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cardService } from "../services/cardService";
import QuestCard from "../QuestCard/QuestCard";
import QuestCardCreate from "../QuestCardCreate/QuestCardCreate";
import QuestCardCompleted from "../QuestCardCompleted/QuestCardCompleted";
import QuestCardChallenge from "../QuestCardChallenge/QuestCardChallenge";
import css from "./QuestDashboard.module.css";
import toast from "react-hot-toast";
import { MdAdd } from "react-icons/md";

function QuestDashboard() {
    // Состояние для отображения/скрытия формы создания новой карточки
    const [isCreating, setIsCreating] = useState(false);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["cards"],
        queryFn: () => cardService.getAllCards().then((res) => res.data),
    });

    if (isError) {
        toast.error(`Ошибка загрузки карточек: ${error.message}`);
    }

    const cards = data?.cards || [];

    // Группировка карточек
    const today = new Date().toISOString().split("T")[0];
    const incompleteTasks = cards.filter(
        (c) => c.status === "Incomplete" && c.type === "Task"
    );
    const challenges = cards.filter(
        (c) => c.status === "Incomplete" && c.type === "Challenge"
    );

    const todayCards = incompleteTasks.filter((c) => c.date <= today);
    const tomorrowCards = incompleteTasks.filter((c) => c.date > today);
    const doneCards = cards.filter((c) => c.status === "Complete");

    return (
        <div className={css.dashboardContainer}>
            {/* Секция для Challenges */}
            {challenges.length > 0 && (
                <>
                    <h2>CHALLENGES</h2>
                    <div className={css.QuestDashboard}>
                        {challenges.map((card) => (
                            <QuestCardChallenge key={card._id} card={card} />
                        ))}
                    </div>
                </>
            )}

            <h2>TODAY</h2>
            <div className={css.QuestDashboard}>
                {/* Форма создания появляется первой, если isCreating === true */}
                {isCreating && (
                    <QuestCardCreate closeForm={() => setIsCreating(false)} />
                )}

                {isLoading ? (
                    <p>Loading cards...</p>
                ) : (
                    todayCards.map((card) => (
                        <QuestCard key={card._id} card={card} />
                    ))
                )}
            </div>

            <h2>TOMORROW</h2>
            <div className={css.QuestDashboard}>
                {tomorrowCards.map((card) => (
                    <QuestCard key={card._id} card={card} />
                ))}
            </div>

            <h2>DONE</h2>
            <div className={css.QuestDashboard}>
                {doneCards.map((card) => (
                    <QuestCardCompleted key={card._id} cardData={card} />
                ))}
            </div>

            {/* Плавающая кнопка для создания новой задачи */}
            <button
                className={css.createButton}
                onClick={() => setIsCreating(true)}
            >
                <MdAdd size={24} />
            </button>
        </div>
    );
}

export default QuestDashboard;
