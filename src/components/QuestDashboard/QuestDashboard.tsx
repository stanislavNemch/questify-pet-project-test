import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { cardService } from "../services/cardService";
import QuestCard from "../QuestCard/QuestCard";
import QuestCardCreate from "../QuestCardCreate/QuestCardCreate";
import QuestCardCompleted from "../QuestCardCompleted/QuestCardCompleted";
import QuestCardChallenge from "../QuestCardChallenge/QuestCardChallenge"; // Убедимся, что он импортирован
import QuestGroup from "../QuestGroup/QuestGroup";
import css from "./QuestDashboard.module.css";
import toast from "react-hot-toast";
import { MdAdd } from "react-icons/md";
import type { CardData } from "../types/card";

interface DashboardProps {
    challengeCreationRequested: boolean;
    onChallengeCreationHandled: () => void;
}

function QuestDashboard({
    challengeCreationRequested,
    onChallengeCreationHandled,
}: DashboardProps) {
    // ... вся логика состояний (useState, useEffect) и хуков (useQuery) остается без изменений ...
    const [creatingType, setCreatingType] = useState<
        "Task" | "Challenge" | null
    >(null);
    const [openSections, setOpenSections] = useState<{
        [key: string]: boolean;
    }>({
        TODAY: true,
        TOMORROW: false,
        DONE: false,
    });

    useEffect(() => {
        if (challengeCreationRequested) {
            setCreatingType("Challenge");
            setOpenSections((prev) => ({ ...prev, TODAY: true }));
            onChallengeCreationHandled();
        }
    }, [challengeCreationRequested, onChallengeCreationHandled]);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["cards"],
        queryFn: () => cardService.getAllCards().then((res) => res.data),
    });

    if (isError) {
        toast.error(`Ошибка загрузки карточек: ${error.message}`);
    }

    const cards: CardData[] = data?.cards || [];
    const today = new Date().toISOString().split("T")[0];
    const incompleteCards = cards.filter((c) => c.status === "Incomplete");
    const doneCards = cards.filter((c) => c.status === "Complete");

    const sortCardsByType = (cardArray: CardData[]): CardData[] => {
        return [...cardArray].sort((a, b) => {
            if (a.type === "Task" && b.type === "Challenge") return -1;
            if (a.type === "Challenge" && b.type === "Task") return 1;
            return 0;
        });
    };

    const todayCards = sortCardsByType(
        incompleteCards.filter((c) => c.date.split("T")[0] <= today)
    );
    const tomorrowCards = sortCardsByType(
        incompleteCards.filter((c) => c.date.split("T")[0] > today)
    );

    const handleToggleSection = (section: string) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const closeForms = () => setCreatingType(null);

    // Функция для рендера правильного компонента карточки
    const renderCard = (card: CardData) => {
        if (card.type === "Challenge") {
            return <QuestCardChallenge key={card._id} card={card} />;
        }
        return <QuestCard key={card._id} card={card} />;
    };

    return (
        <div className={css.dashboardContainer}>
            <QuestGroup
                title="TODAY"
                isOpen={openSections.TODAY}
                onToggle={() => handleToggleSection("TODAY")}
            >
                {creatingType && (
                    <QuestCardCreate
                        type={creatingType}
                        closeForm={closeForms}
                    />
                )}
                {isLoading ? <p>Loading...</p> : todayCards.map(renderCard)}
            </QuestGroup>

            <QuestGroup
                title="TOMORROW"
                isOpen={openSections.TOMORROW}
                onToggle={() => handleToggleSection("TOMORROW")}
            >
                {tomorrowCards.map(renderCard)}
            </QuestGroup>

            <QuestGroup
                title="DONE"
                isOpen={openSections.DONE}
                onToggle={() => handleToggleSection("DONE")}
            >
                {doneCards.map((card) => (
                    <QuestCardCompleted key={card._id} cardData={card} />
                ))}
            </QuestGroup>

            <div className={css.createButtonsContainer}>
                <button
                    className={css.createButton}
                    onClick={() => {
                        setCreatingType("Task");
                        setOpenSections((prev) => ({ ...prev, TODAY: true }));
                    }}
                >
                    <MdAdd size={24} />
                </button>
            </div>
        </div>
    );
}

export default QuestDashboard;
