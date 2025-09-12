export type Difficulty = "Easy" | "Normal" | "Hard";
export type Category =
    | "Stuff"
    | "Family"
    | "Health"
    | "Learning"
    | "Leisure"
    | "Work";
export type CardType = "Task" | "Challenge";
export type CardStatus = "Incomplete" | "Complete";

// Данные, которые приходят от бэкенда для одной карточки
export interface CardData {
    _id: string;
    title: string;
    difficulty: Difficulty;
    category: Category;
    date: string;
    time: string;
    type: CardType;
    status: CardStatus;
}

// Ответ от API при запросе всех карточек
export interface GetAllCardsResponse {
    cards: CardData[];
}

// Данные для создания новой карточки
export interface CreateCardPayload {
    title: string;
    difficulty: Difficulty;
    category: Category;
    date: string;
    time: string;
    type: CardType;
}

// Данные для редактирования карточки
export type EditCardPayload = Omit<CreateCardPayload, "type">; // type нельзя менять при редактировании

// Ответ от API после создания карточки
export interface CreateCardResponse {
    createdCard: CardData;
}

// Ответ от API после редактирования карточки
export interface EditCardResponse {
    editedCard: CardData;
}

// Ответ от API после завершения карточки
export interface CompleteCardResponse {
    editedCard: CardData; // Бэкенд возвращает editedCard
}
