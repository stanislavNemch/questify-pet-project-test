import type { Difficulty, Category, CardType, CardStatus } from "../types/card";

export type PromoCard = {
    id: number;
    title: string;
    difficulty: Difficulty;
    category: Category;
    type: CardType;
    status: CardStatus;
};

export const promoCardsData: PromoCard[] = [
    {
        id: 1,
        title: "Submit report",
        difficulty: "Hard",
        category: "Work",
        type: "Task",
        status: "Incomplete",
    },
    {
        id: 302,
        title: "Daily coding 14 days",
        difficulty: "Normal",
        category: "Learning",
        type: "Challenge",
        status: "Complete",
    },
    {
        id: 2,
        title: "Buy the gift for Mary",
        difficulty: "Easy",
        category: "Family",
        type: "Task",
        status: "Incomplete",
    },
    {
        id: 101,
        title: "Clean the garage",
        difficulty: "Normal",
        category: "Stuff",
        type: "Task",
        status: "Complete",
    },
    {
        id: 3,
        title: "Visit the dentist at Lumident",
        difficulty: "Normal",
        category: "Health",
        type: "Task",
        status: "Incomplete",
    },
    {
        id: 4,
        title: "Finish homework",
        difficulty: "Easy",
        category: "Learning",
        type: "Task",
        status: "Incomplete",
    },
    {
        id: 201,
        title: "30-min HIIT workout",
        difficulty: "Hard",
        category: "Health",
        type: "Challenge",
        status: "Incomplete",
    },
    {
        id: 5,
        title: "Morning run",
        difficulty: "Easy",
        category: "Health",
        type: "Task",
        status: "Incomplete",
    },
    {
        id: 6,
        title: "Team webinar",
        difficulty: "Normal",
        category: "Learning",
        type: "Task",
        status: "Incomplete",
    },
    {
        id: 102,
        title: "Pay utility bills",
        difficulty: "Easy",
        category: "Stuff",
        type: "Task",
        status: "Complete",
    },
    {
        id: 202,
        title: "Read 50 pages",
        difficulty: "Normal",
        category: "Learning",
        type: "Challenge",
        status: "Incomplete",
    },
    {
        id: 301,
        title: "Cold shower 7 days",
        difficulty: "Hard",
        category: "Health",
        type: "Challenge",
        status: "Complete",
    },
];
