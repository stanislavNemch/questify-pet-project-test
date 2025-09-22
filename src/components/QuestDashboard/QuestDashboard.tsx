import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { cardService } from "../services/cardService";
import QuestCard from "../QuestCard/QuestCard";
import QuestCardCreate from "../QuestCardCreate/QuestCardCreate";
import QuestCardCompleted from "../QuestCardCompleted/QuestCardCompleted";
import QuestCardChallenge from "../QuestCardChallenge/QuestCardChallenge";
import QuestGroup from "../QuestGroup/QuestGroup";
import css from "./QuestDashboard.module.css";
import toast from "react-hot-toast";
import type { CardData, CardType } from "../types/card";

interface DashboardProps {
  creationType: CardType | null;
  onCreationHandled: () => void;
}

function QuestDashboard({ creationType, onCreationHandled }: DashboardProps) {
  const [isCreating, setIsCreating] = useState(false);

  const [openSections, setOpenSections] = useState<{
    [key: string]: boolean;
  }>({
    TODAY: true,
    TOMORROW: false,
    DONE: false,
  });

  // --- ДОБАВЛЯЕМ ЛОКАЛЬНЫЙ ТАЙМЕР ---
  // Это состояние будет обновляться каждую минуту, чтобы принудительно
  // перерисовать UI и пересчитать логику "горящих" задач.
  const [, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Создаем интервал, который обновляет состояние каждую минуту
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60 000 мс = 1 минута

    // Очищаем интервал, когда компонент размонтируется
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (creationType) {
      setIsCreating(true);
      setOpenSections((prev) => ({ ...prev, TODAY: true }));
    }
  }, [creationType]);

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

  const sortCards = (cardArray: CardData[]): CardData[] => {
    return [...cardArray].sort((a, b) => {
      if (a.type === "Task" && b.type === "Challenge") return -1;
      if (a.type === "Challenge" && b.type === "Task") return 1;
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      return 0;
    });
  };

  const todayCards = sortCards(
    incompleteCards.filter((c) => c.date.split("T")[0] <= today)
  );
  const tomorrowCards = sortCards(
    incompleteCards.filter((c) => c.date.split("T")[0] > today)
  );

  const handleToggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const closeForms = () => {
    setIsCreating(false);
    onCreationHandled();
  };

  const renderCard = (card: CardData) => {
    if (card.type === "Challenge") {
      return <QuestCardChallenge key={card._id} card={card} />;
    }
    return <QuestCard key={card._id} card={card} />;
  };

  return (
    <div className={css.dashboardContainer}>
      <div className="container">
        <QuestGroup
          title="TODAY"
          isOpen={openSections.TODAY}
          onToggle={() => handleToggleSection("TODAY")}
        >
          {isCreating && creationType && (
            <QuestCardCreate type={creationType} closeForm={closeForms} />
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
      </div>
    </div>
  );
}

export default QuestDashboard;
